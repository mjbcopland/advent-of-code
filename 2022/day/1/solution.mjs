import * as fs from "fs/promises";
import * as os from "os";
import * as r from "ramda";

async function main(args) {
  const input = await fs.readFile(args[0]);
  const elves = input.toString().trim().split("\n\n");

  const totals = elves.map((data, index) => {
    return r.sum(data.split("\n").map((n) => Number.parseInt(n, 10)));
  });

  const sorted = r.sort(r.descend(r.identity), totals);

  return r.sum(sorted.slice(0, 3));
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
