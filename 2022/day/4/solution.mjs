import * as os from "os";
import * as r from "ramda";

import { default as fetch } from "node-fetch";

function parseInt(text) {
  return Number.parseInt(text, 10);
}

async function part1(input) {
  const lines = input.trim().split("\n");
  const pairs = lines.map((line) => line.split(",").map((pair) => pair.split("-").map(parseInt)));

  function check(a, b) {
    return a[0] <= b[0] && b[1] <= a[1];
  }

  return pairs.filter(([a, b]) => {
    return check(a, b) || check(b, a);
  }).length;
}

async function part2(input) {
  const lines = input.trim().split("\n");
  const pairs = lines.map((line) => line.split(",").map((pair) => pair.split("-").map(parseInt)));

  function check(a, b) {
    return a[0] <= b[0] && b[0] <= a[1];
  }

  return pairs.filter(([a, b]) => {
    return check(a, b) || check(b, a);
  }).length;
}

async function main(args) {
  const headers = [["cookie", `session=${process.env.SESSION}`]];
  const response = await fetch("https://adventofcode.com/2022/day/4/input", { headers });

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
