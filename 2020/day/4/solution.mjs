#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";
import { EOL } from "os";
import {
  allPass,
  always,
  both,
  compose,
  endsWith,
  equals,
  fromPairs,
  gte,
  has,
  ifElse,
  inc,
  length,
  lte,
  partialRight,
  prop,
  split,
  test,
} from "ramda";

const within = ([min, max]) => both(lte(min), gte(max));
const parseInt = partialRight(Number.parseInt, [10]);

const fields = [
  {
    name: "byr",
    description: "Birth Year",
    required: true,
    policy: "Four digits; at least 1920 and at most 2002.",
    validate: allPass([test(/^[0-9]*$/), compose(equals(4), length), compose(within([1920, 2002]), parseInt)]),
  },
  {
    name: "iyr",
    description: "Issue Year",
    required: true,
    policy: "Four digits; at least 2010 and at most 2020.",
    validate: allPass([test(/^[0-9]*$/), compose(equals(4), length), compose(within([2010, 2020]), parseInt)]),
  },
  {
    name: "eyr",
    description: "Expiration Year",
    required: true,
    policy: "Four digits; at least 2020 and at most 2030.",
    validate: allPass([test(/^[0-9]*$/), compose(equals(4), length), compose(within([2020, 2030]), parseInt)]),
  },
  {
    name: "hgt",
    description: "Height",
    required: true,
    policy: `
      A number followed by either cm or in:
        If cm, the number must be at least 150 and at most 193.
        If in, the number must be at least 59 and at most 76.
    `,
    validate: allPass([
      test(/^[0-9]+(cm|in)$/),
      ifElse(endsWith("cm"), compose(within([150, 193]), parseInt), compose(within([59, 76]), parseInt)),
    ]),
  },
  {
    name: "hcl",
    description: "Hair Color",
    required: true,
    policy: "A '#' followed by exactly six characters 0-9 or a-f.",
    validate: allPass([test(/^#[0-9a-f]{6}/)]),
  },
  {
    name: "ecl",
    description: "Eye Color",
    required: true,
    policy: "Exactly one of: amb blu brn gry grn hzl oth.",
    validate: allPass([test(/(amb|blu|brn|gry|grn|hzl|oth)/)]),
  },
  {
    name: "pid",
    description: "Passport ID",
    required: true,
    policy: "A nine-digit number, including leading zeroes.",
    validate: allPass([test(/^[0-9]*$/), compose(equals(9), length)]),
  },
  {
    name: "cid",
    description: "Country ID",
    required: false,
    policy: "Ignored, missing or not.",
    validate: always(true),
  },
];

function parse(passport) {
  const pairs = passport.split(/\s/);
  return fromPairs(pairs.map(split(":")));
}

function check(credentials) {
  return fields.filter(prop("required")).every((field) => has(field.name, credentials));
}

function validate(credentials) {
  return fields.every((field) => field.validate(prop(field.name, credentials)));
}

function* main(argv) {
  const input = readFileSync(resolve(argv[2]), "utf8");
  const passports = input.trim().split("\n\n").map(parse);

  yield passports.reduce((count, passport) => {
    return check(passport) ? inc(count) : count;
  }, 0);

  yield passports.reduce((count, passport) => {
    return check(passport) && validate(passport) ? inc(count) : count;
  }, 0);

  yield; // final newline
}

function onSuccess(output) {
  return process.stdout.write(Array.from(output).join(EOL));
}

function onFailure(error) {
  return process.stderr.write(error.toString());
}

try {
  onSuccess(main(process.argv));
} catch (error) {
  onFailure(error);
}
