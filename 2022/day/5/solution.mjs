import * as os from "os";
import * as r from "ramda";

import { default as fetch } from "node-fetch";

function parseInt(text) {
  return Number.parseInt(text, 10);
}

async function part1(input) {
  const [layout, steps] = input.trim().split("\n\n");

  const rows = layout
    .split("\n")
    .slice(0, -1)
    .map((row) => {
      // regex magic; fuck if I know
      return Array.from(row.matchAll(/\[(.)\]|   (?: |$)/g)).map((match) => match[1]);
    });

  const n = rows[0].length; // assume at least one row and all of the same length
  const stacks = Array.from({ length: n }, () => new Array());

  for (const row of Array.from(rows).reverse()) {
    void row.forEach((item, index) => {
      if (item) stacks[index].push(item);
    });
  }

  void steps.split("\n").map((step) => {
    const match = step.match(/move (\d+) from (\d+) to (\d+)/);
    const [, count, prev, next] = match.map(parseInt);

    for (let i = 0; i < count; i += 1) {
      void stacks[next - 1].push(stacks[prev - 1].pop());
    }
  });

  const result = stacks.map((stack) => r.last(stack));
  return result.join("");
}

async function part2(input) {
  const [layout, steps] = input.trim().split("\n\n");

  const rows = layout
    .split("\n")
    .slice(0, -1)
    .map((row) => {
      // regex magic; fuck if I know
      return Array.from(row.matchAll(/\[(.)\]|   (?: |$)/g)).map((match) => match[1]);
    });

  const n = rows[0].length; // assume at least one row and all of the same length
  const stacks = Array.from({ length: n }, () => new Array());

  for (const row of Array.from(rows).reverse()) {
    void row.forEach((item, index) => {
      if (item) stacks[index].push(item);
    });
  }

  void steps.split("\n").map((step) => {
    const match = step.match(/move (\d+) from (\d+) to (\d+)/);
    const [, count, prev, next] = match.map(parseInt);

    const placeholder = [];

    for (let i = 0; i < count; i += 1) {
      void placeholder.push(stacks[prev - 1].pop());
    }

    for (let i = 0; i < count; i += 1) {
      void stacks[next - 1].push(placeholder.pop());
    }
  });

  const result = stacks.map((stack) => r.last(stack));
  return result.join("");
}

async function main(args) {
  const headers = [["cookie", `session=${process.env.SESSION}`]];
  const response = await fetch("https://adventofcode.com/2022/day/5/input", { headers });

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
