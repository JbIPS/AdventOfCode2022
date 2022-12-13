#!/usr/bin/python3

from enum import Enum
from itertools import zip_longest

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

def pairs():
    input = yield_input()
    while True:
        pair1 = eval(next(input))
        pair2 = eval(next(input))
        yield (pair1, pair2)
        # empty line
        try :
            next(input)
        except StopIteration:
            break


class Order(Enum):
    ORDERED = 1,
    EQUAL = 2,
    WRONG = 3

def is_list(item):
    return isinstance(item, list)

def cmp_item(i1, i2):
    if is_list(i1) and is_list(i2):
        return cmp_list(i1, i2)
    elif is_list(i1):
        return cmp_list(i1, [i2])
    elif is_list(i2):
        return cmp_list([i1], i2)
    else:
        return cmp_integer(i1, i2)

def cmp_integer(i1, i2):
    if i1 == i2:
        return Order.EQUAL
    if i1 < i2:
        return Order.ORDERED
    return Order.WRONG

def cmp_list(l1, l2):
    #print(f"cmp {l1} and {l2}")
    for item1, item2 in zip_longest(l1,l2):
        if item1 is None:
            return Order.ORDERED
        if item2 is None:
            return Order.WRONG
        order = cmp_item(item1, item2)
        if order != Order.EQUAL:
            return order
    return Order.EQUAL

def main():
    round_1 = sum([i for i, pair in enumerate(pairs(), 1) if cmp_list(*pair) == Order.ORDERED])
    print("Round 1 :", round_1)


if __name__ == "__main__":
    main()

