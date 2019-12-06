#!/usr/bin/env python3

import fileinput
import itertools


def get_coordinates(path):
    # start at the origin
    x, y = (0, 0)
    dist = 0

    # include the starting coordinate
    coordinates = [((x, y), dist)]

    for step in path:
        direction = step[0]
        length = int(step[1:])
        dist += length

        if direction == "U":
            y += length
        if direction == "D":
            y -= length
        if direction == "L":
            x -= length
        if direction == "R":
            x += length

        coordinates.append(((x, y), dist))

    return coordinates


def get_segments(coordinates):
    _, *tail = coordinates
    return zip(coordinates, tail)


def get_m_c(segment):
    start, end = segment

    xi, yi = start
    xj, yj = end

    m = (yi - yj) / (xi - xj)
    c = yi - (m * xi)

    return (m, c)


def get_intersection(pair):
    # (left, d1), (right, d2) = pair
    ((a, d1), (b, _)), ((c, d2), (d, _)) = pair

    left, right = pair

    (a, d1), (b, _) = left
    (c, d2), (d, _) = right

    # print(left, right)

    try:
        m1, c1 = get_m_c((a, b))
    except ZeroDivisionError:
        # left segment is vertical
        return get_vertical_intersection(left, right)

    try:
        m2, c2 = get_m_c((c, d))
    except ZeroDivisionError:
        # right segment is vertical
        return get_vertical_intersection(right, left)

    try:
        x = (c2 - c1) / (m1 - m2)
        y = (m1 * x) + c1

        d = d1 + d2 + manhatten_distance(a, (x, y)) + manhatten_distance(c, (x, y))

        return ((x, y), d) if inside((x, y), left) and inside((x, y), right) else None

    except ZeroDivisionError:
        # the segments are parallel so cannot intersect
        return None


def get_vertical_intersection(vert, other):
    (v1, d1), (v2, _) = vert
    (o1, d2), (o2, _) = other

    (xi, _), (xj, _) = (v1, v2)

    assert xi == xj, "Segment is not vertical"

    x = xi

    try:
        m, c = get_m_c((o1, o2))
    except ZeroDivisionError:
        # both segments are vertical and cannot intersect
        return None

    y = (m * x) + c
    d = d1 + d2 + manhatten_distance(v1, (x, y)) + manhatten_distance(o1, (x, y))

    return (
        ((x, y), d) if inside((x, y), (v1, v2)) and inside((x, y), (o1, o2)) else None
    )


def inside(coord, segment):
    x, y = coord
    (xi, yi), (xj, yj) = segment

    return xi <= x <= xj and yi <= y <= yj


def manhatten_distance(start, end):
    xi, yi = start
    xj, yj = end

    return abs(xi - xj) + abs(yi - yj)


if __name__ == "__main__":
    with fileinput.input() as file:
        paths = (line.strip().split(",") for line in file)

        coordinates = map(get_coordinates, paths)

        segments = map(get_segments, coordinates)

        intersections = []

        for pair in itertools.product(*segments):
            intersection = get_intersection(pair)
            if intersection is not None:
                intersections.append(intersection)

        intersections.sort(key=lambda x: x[1])

        try:
            print(intersections[0])
        except IndexError:
            print("Error: no intersections")
