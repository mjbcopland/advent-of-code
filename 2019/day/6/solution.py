#!/usr/bin/env python3

import collections
import fileinput

with fileinput.input() as file:
    pairs = (line.strip().split(")") for line in file)

    orbits = collections.defaultdict(set)

    for left, right in pairs:
        orbits[left].add(right)

    queue = ["COM"]
    paths = {"COM": []}

    while len(queue) > 0:
        node = queue.pop()

        for child in orbits[node]:
            paths[child] = paths[node] + [node]
            queue.append(child)

    print("Part 1:", sum(len(path) for path in paths.values()))

    san = paths["SAN"]
    you = paths["YOU"]

    common = [a for (a, b) in zip(san, you) if a == b]

    print("Part 2:", len(san) + len(you) - (2 * len(common)))
