#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";
import { EOL } from "os";

function run(entries, target) {
  const seen = new Map();

  for (const entry of entries) {
    const diff = target - entry;

    if (seen.has(diff)) {
      return entry * diff;
    } else {
      seen.set(entry);
    }
  }

  throw new Error();
}

function* main(argv) {
  const input = readFileSync(resolve(argv[2]), "utf8");
  const entries = input.split("\n").map((line) => Number.parseInt(line));

  yield `Part 1: ${run(entries, 2020)}`;

  for (const entry of entries) {
    try {
      const partial = run(entries, 2020 - entry);
      yield `Part 2: ${entry * partial}`;
    } catch {
      // pass
    }
  }

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
