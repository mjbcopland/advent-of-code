#!/usr/bin/env python3

import fileinput
import itertools


def chunks(xs, n):
    for i in range(0, len(xs), n):
        yield xs[i : i + n]


def execute(intcode, noun, verb):
    # copy input but also convert to mutable list
    memory = [*intcode]

    memory[1] = noun
    memory[2] = verb

    try:
        for [opcode, *params] in chunks(memory, 4):
            if opcode == 99:
                break

            [i, j, k] = params

            if opcode == 1:
                memory[k] = memory[i] + memory[j]
            elif opcode == 2:
                memory[k] = memory[i] * memory[j]

    except Exception as exception:
        raise Exception(f"Something went wrong ({exception})")

    return memory


if __name__ == "__main__":
    with fileinput.input() as file:
        text = ",".join(line.strip() for line in file)
        intcode = list(map(int, text.split(",")))

        # print(execute(intcode, 12, 2))

        target = 19690720
        length = len(intcode)

        for (noun, verb) in itertools.product(range(length), range(length)):
            try:
                result = execute(intcode, noun, verb)[0]
                if result == target:
                    print(f"{noun:02d}{verb:02d}")
                    break
            except Exception:
                pass
        else:
            raise Exception("Not found")
