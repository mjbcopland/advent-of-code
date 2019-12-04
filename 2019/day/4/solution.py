#!/usr/bin/env python3

import fileinput
import itertools


def count(iterable):
    return sum(1 for _ in iterable)


def is_valid(number):
    text = str(number)
    groups = (g for k, g in itertools.groupby(text))

    if len(text) != 6:
        return False

    if text != "".join(sorted(text)):
        return False

    if not any(map(lambda g: count(g) == 2, groups)):
        return False

    return True


if __name__ == "__main__":
    with fileinput.input() as file:
        line = next(file)
        lower, upper = map(int, line.split("-"))

    print(count(filter(is_valid, range(lower, upper))))
