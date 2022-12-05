import * as os from "os";
import * as r from "ramda";

import { default as fetch } from "node-fetch";

function isLowerCase(c) {
  return /[a-z]/.test(c);
}

function isUpperCase(c) {
  return /[A-Z]/.test(c);
}

function priority(item) {
  if (isLowerCase(item)) {
    const offset = String.prototype.charCodeAt.call("a", 0);
    return item.charCodeAt(0) - offset + 1;
  }

  if (isUpperCase(item)) {
    const offset = String.prototype.charCodeAt.call("A", 0);
    return item.charCodeAt(0) - offset + 27;
  }

  throw new Error(`Unexpected item '${item}'`);
}

async function part1(input) {
  const bags = input.trim().split("\n");
  const common = bags.map((bag) => {
    const items = bag.split("");
    const compartments = r.splitAt(items.length / 2, items);
    return r.intersection(compartments[0], compartments[1]);
  });

  const priorities = common.flatMap((items) => {
    return items.map((item) => priority(item));
  });

  return r.sum(priorities);
}

async function part2(input) {
  const bags = input.trim().split("\n");

  if (bags.length % 3 !== 0) {
    throw new Error(`Unexpected length '${bags.length}' not divisible by 3`);
  }

  const groups = r.splitEvery(3, bags);

  const priorities = groups.map((group) => {
    const badges = r.intersection(group[0], r.intersection(group[1], group[2]));

    if (badges.length !== 1) {
      throw new Error(`Unexpected badges '${badges.join(",")}'`);
    }

    return priority(badges[0]);
  });

  return r.sum(priorities);
}

async function main(args) {
  const headers = [["cookie", `session=${process.env.SESSION}`]];
  const response = await fetch("https://adventofcode.com/2022/day/3/input", { headers });

  if (!response.ok) throw new Error(response.statusText);

  const input = await response.text();

  const callback = args[0] === "2" ? part2 : part1;
  return Promise.resolve(callback(input));
}

function onFulfilled(data) {
  void process.stdout.write(String(data));
  void process.stdout.write(os.EOL);
}

function onRejected(reason) {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  void process.stderr.write(error.toString());
  void process.stderr.write(os.EOL);
}

void main(process.argv.slice(2)).then(onFulfilled, onRejected);
