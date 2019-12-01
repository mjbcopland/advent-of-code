#!/usr/bin/env python3

import fileinput


def get_fuel(mass):
    return (mass // 3) - 2


def total_fuel(mass):
    fuel = get_fuel(mass)
    return fuel + total_fuel(fuel) if fuel > 0 else 0


if __name__ == "__main__":
    with fileinput.input() as file:
        modules = list(int(line) for line in file)

        print("Part 1:", sum(map(get_fuel, modules)))
        print("Part 2:", sum(map(total_fuel, modules)))
