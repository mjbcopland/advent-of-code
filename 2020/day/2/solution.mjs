#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";
import { EOL } from "os";

function parse(line) {
  const [policy, password] = line.split(": ");
  const [range, letter] = policy.split(" ");
  const [min, max] = range.split("-").map((x) => Number.parseInt(x));
  return { min, max, letter, password };
}

function* main(argv) {
  const input = readFileSync(resolve(argv[2]), "utf8");
  const lines = input.trim().split("\n");

  yield lines.reduce((result, line) => {
    const { min, max, letter, password } = parse(line);
    const count = password.split("").filter((c) => c === letter).length;
    return min <= count && count <= max ? result + 1 : result;
  }, 0);

  yield lines.reduce((result, line) => {
    const { min, max, letter, password } = parse(line);
    const count = Number(password[min - 1] === letter) + Number(password[max - 1] === letter);
    return count === 1 ? result + 1 : result;
  }, 0);

  yield;
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
