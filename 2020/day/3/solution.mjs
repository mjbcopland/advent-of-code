#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";
import { EOL } from "os";

function product(values) {
  return values.reduce((total, value) => total * value, 1);
}

function run(lines, x, y) {
  let count = 0;

  for (let i = 0, j = 0; j < lines.length; i += x, j += y) {
    const line = lines[j];
    if (line[i % line.length] === "#") {
      count += 1;
    }
  }

  return count;
}

function* main(argv) {
  const input = readFileSync(resolve(argv[2]), "utf8");
  const lines = input.trim().split("\n");

  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  yield run(lines, 3, 1);
  yield product(slopes.map(([x, y]) => run(lines, x, y)));

  // yield lines.reduce((result, line) => {
  //   const { min, max, letter, password } = parse(line);
  //   const count = Number(password[min - 1] === letter) + Number(password[max - 1] === letter);
  //   return count === 1 ? result + 1 : result;
  // }, 0);

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
