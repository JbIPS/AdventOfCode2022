#!/usr/bin/python3

import re
from pprint import pprint

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l


class Operation:
    def __init__(self, operation):
        self.op = operation

    def __call__(self, value):
        local_dict = {'old': value}
        exec(self.op, {}, local_dict)
        return local_dict['new']


# Let's do some math
# Let a number N.
# By definition N = Ki*I + Ri and N%I = Ri.
#
# Let's do (N+p)%I = (Ki*I + Ri + p)%I = (Ri+p)%I = (N%I+p)%I
# So doing the additon on N or N%I doesn't change the final modulo
#
# Let's do (N*x)%I = (Ki*I*x + Ri*x)%I = (Ri*x)%I = (N%I*x)%I
# So doing the multiplication on N or N%I doesn't change the final modulo
#
# Let's have J=m*I. N = Kj*J + Rj
# N%I = (Kj*J + Rj)%I = (Kj*m*I + Rj)%I = Rj%I
# So N%I == N%J%I. So we can keep N%J.
#
# Let's have a "common divider" which is the product of all our dividers,
# it will not change the results of our operations, and it is a by definition a
# multiple of any of our dividers.
common_divider = 1


header_reg = re.compile("Monkey [0-9]:")
class Monkey:
    def __init__(self, input):
        global common_divider
        self.inspections = 0
        line = next(input)
        assert(header_reg.match(line))
        line = next(input)
        items_line = line[len("Starting items: "):]
        self.items = [int(i) for i in items_line.split(", ")]

        line = next(input)
        self.op = Operation(line[len("Operation: "):])

        line = next(input)
        self.divider = int(line[len("Test: divisible by "):])
        common_divider *= self.divider

        line = next(input)
        self.target_true = int(line[len("If true: throw to monkey "):])

        line = next(input)
        self.target_false = int(line[len("If false: throw to monkey "):])

    def inspect_one(self, item):
        self.inspections += 1
        #print(f"-- inspect {item} => ", end="")
        new_worry = self.op(item)
        #print(f"{new_worry} => ", end="")
        new_worry = new_worry % common_divider
        #print(f"{new_worry}", end="")
        target = self.target_true if new_worry % self.divider == 0 else self.target_false
        #print(f" => Send to {target}")
        monkeys[target].receive(new_worry)

    def inspect(self):
        for item in self.items:
            self.inspect_one(item)
        self.items = []

    def receive(self, item):
        self.items.append(item)

    def __str__(self):
        return f"Monkey({self.items})"

    def __repr__(self):
        return f"{self}"



def parse_monkeys():
    monkeys = []
    input = yield_input()
    while True:
        monkeys.append(Monkey(input))
        try:
            next(input)
        except StopIteration:
            break
    return monkeys

monkeys = None

def main():
    global monkeys
    monkeys = parse_monkeys()
    #pprint(monkeys)
    for _ in range(10000):
        for monkey in monkeys:
            monkey.inspect()
        #pprint(monkeys)
    sorted_monkeys = sorted(monkeys, key=lambda m: m.inspections, reverse=True)
    print(sorted_monkeys[0].inspections * sorted_monkeys[1].inspections)


if __name__ == "__main__":
    main()

