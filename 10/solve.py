#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

def yield_command():
    for line in yield_input():
        if line == "noop":
            yield None
        if line.startswith("addx"):
            v = int(line[5:])
            yield None
            yield v

def round_1():
    X = 1
    result = 0
    for cycle, command in enumerate(yield_command(), 1):
        if cycle in (20, 60, 100, 140, 180, 220):
            result += cycle*X
        if command is not None:
            X += command


def round_2():
    X = 1
    result = 0
    for cycle, command in enumerate(yield_command()):
        current_pos = cycle%40
        char = "#" if abs(current_pos-X) <= 1 else " "
        end = "\n" if current_pos == 39 else ""
        print(char, end=end)
        if command is not None:
            X += command

def main():
    result_1 = round_1()
    print("Round 1 :", result_1)

    round_2()


if __name__ == "__main__":
    main()

