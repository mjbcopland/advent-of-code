#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";
import { EOL } from "os";
import { head } from "ramda";

function parse(seat) {
  const row = seat.substring(0, 7);
  const col = seat.substring(7);

  return {
    row: Number.parseInt(row.replace(/F/g, "0").replace(/B/g, "1"), 2),
    col: Number.parseInt(col.replace(/L/g, "0").replace(/R/g, "1"), 2),

    get id() {
      return this.row * 8 + this.col;
    },
  };
}

function compare(a, b) {
  return b.id - a.id;
}

function* main(argv) {
  const input = readFileSync(resolve(argv[2]), "utf8");
  const seats = input.trim().split("\n").map(parse).sort(compare);

  yield head(seats).id;

  yield seats.find((seat, index) => {
    return seat.id - 1 !== seats[index + 1].id;
  }).id - 1;

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
