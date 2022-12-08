#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l


class Stack:
    def __init__(self):
        self.content = []

    def insert_bottom(self, item):
        if item.strip():
            self.content.insert(0, item)

    def push(self, items):
        self.content.extend(items)

    def pop(self, number):
        self.content, items = self.content[:-number], self.content[-number:]
        return items

    def top(self):
        return self.content[-1]

    def __str__(self):
        return f"{self.content}"

def extract_items(line):
    for i in range(9):
        yield line[1+4*i]


class Order:
    def __init__(self, line):
        _, number, _, _from, _, to = line.split()
        self.number = int(number)
        self._from = int(_from)-1
        self.to = int(to) -1

    def apply(self, stacks):
        stack_from = stacks[self._from]
        stack_to = stacks[self.to]
        stack_to.push(stack_from.pop(self.number))

    def __str__(self):
        return f"move {self.number} from {self._from} to {self.to}"

stacks = []
for _ in range(9):
    stacks.append(Stack())

def do_stuf(line):
    if line.startswith("["):
        items = extract_items(line)
        for stack, item in zip(stacks, items):
            stack.insert_bottom(item)
    elif line.startswith("move"):
        order = Order(line)
        order.apply(stacks)



for line in yield_input():
    do_stuf(line)

result = ""
for stack in stacks:
    result += stack.top()
print(result)
