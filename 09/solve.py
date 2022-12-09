#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

class Coord:
    def __init__(self):
        self.x = 0
        self.y = 0

    def up(self):
        self.x += 1

    def down(self):
        self.x -= 1

    def right(self):
        self.y += 1

    def left(self):
        self.y -= 1

    def follow(self, other):
        x_dist = abs(self.x-other.x)
        y_dist = abs(self.y-other.y)
        if x_dist <= 1 and y_dist <= 1:
            return
        if x_dist == 0:
            self.y += 1 if other.y>self.y else -1
        elif y_dist == 0:
            self.x += 1 if other.x>self.x else -1
        else:
            self.y += 1 if other.y>self.y else -1
            self.x += 1 if other.x>self.x else -1

    def as_tuple(self):
        return (self.x, self.y)

class Rope:
    def __init__(self, length):
        self.tails_positions = set()
        self.knots = []
        for _ in range(length):
            self.knots.append(Coord())
        self.tails_positions.add(self.knots[-1].as_tuple())

    def up(self):
        self.knots[0].up()
        self.follow()

    def down(self):
        self.knots[0].down()
        self.follow()

    def right(self):
        self.knots[0].right()
        self.follow()

    def left(self):
        self.knots[0].left()
        self.follow()

    def follow(self):
        for i, knot in enumerate(self.knots[1:]):
            knot.follow(self.knots[i])
        self.tails_positions.add(self.knots[-1].as_tuple())


def main():
    rope1 = Rope(2)
    rope2 = Rope(10)
    command_map = {
        'U': "up",
        'D': "down",
        'R': "right",
        'L': "left",
    }
    for command in yield_input():
        direction, number = command.split()
        number = int(number)
        for _ in range(number):
            getattr(rope1, command_map[direction])()
            getattr(rope2, command_map[direction])()
    print("Round 1 :", len(rope1.tails_positions))
    print("Round 2 :", len(rope2.tails_positions))


if __name__ == "__main__":
    main()

