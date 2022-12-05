import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import * as r from "ramda";
import * as url from "url";

async function part1(args) {
  const filename = args[0] || url.fileURLToPath(new URL("input.txt", import.meta.url));
  const input = await fs.readFile(filename);
  const data = input.toString().trim().split("\n");

  const table = {
    A: { X: 3, Y: 6, Z: 0 },
    B: { X: 0, Y: 3, Z: 6 },
    C: { X: 6, Y: 0, Z: 3 },
  };

  const scores = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  const score = data.reduce((prev, next) => {
    const [a, b] = next.split(" ");
    return prev + scores[b] + table[a][b];
  }, 0);

  return score;
}

async function part2(args) {
  const filename = args[0] || url.fileURLToPath(new URL("input.txt", import.meta.url));
  const input = await fs.readFile(filename);
  const data = input.toString().trim().split("\n");

  const table = {
    A: { X: 3, Y: 1, Z: 2 },
    B: { X: 1, Y: 2, Z: 3 },
    C: { X: 2, Y: 3, Z: 1 },
  };

  const scores = {
    X: 0,
    Y: 3,
    Z: 6,
  };

  const score = data.reduce((prev, next) => {
    const [a, b] = next.split(" ");
    return prev + scores[b] + table[a][b];
  }, 0);

  return score;
}

const main = part2;

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
