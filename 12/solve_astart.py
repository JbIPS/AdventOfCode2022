#!/usr/bin/python3

from enum import Enum
from time import sleep
from math import sqrt

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

class Seen(Enum):
    NONE = 0
    CURRENT = 1
    SEEN = 2

current_color = None

def print_color(color, out):
    global current_color
    if current_color != color:
        current_color = color
        print(color, end="")
    print(out, end="")

class Cell:
    def __init__(self, height, coord):
        self.height = height
        self.coord = coord
        self.seen = Seen.NONE
        self.path_length = 0

    # Yield other if we can go there from self
    def yield_check_up(self, other):
        #print(f"{other.seen} {other.height} {self.height}")
        if other.seen == Seen.NONE and other.height <= self.height + 1:
            other.path_length = self.path_length+1
            other.seen = Seen.CURRENT
            yield other

    def yield_check_down(self, other):
        #print(f"{other.seen} {other.height} {self.height}")
        if other.seen == Seen.NONE and other.height >= self.height - 1:
            other.path_length = self.path_length+1
            other.seen = Seen.CURRENT
            yield other

    def print(self):
        global current_color
        if self.seen == Seen.NONE:
            color = "\033[40m"
        elif self.seen == Seen.CURRENT:
            color = "\033[46m"
        else:
            color = "\033[44m"
        char = chr(ord('a')+self.height)
        print_color(color, char)

def move_up(coord):
    return coord[0]-1, coord[1]

def move_down(coord):
    return coord[0]+1, coord[1]

def move_left(coord):
    return coord[0], coord[1]-1

def move_right(coord):
    return coord[0], coord[1]+1


class Map:
    def __init__(self):
        self.map = []
        for i, line in enumerate(yield_input()):
            map_line = []
            for j, h in enumerate(line):
                if h == "S":
                    self.start = (i, j)
                    height = 0
                elif h == "E":
                    self.end = (i, j)
                    height = 25
                else:
                    height = ord(h) - ord('a')
                map_line.append(Cell(height, (i,j)))
            self.map.append(map_line)
            self.nb_lines = len(self.map)
            self.nb_columns = len(self.map[0])
        print(self.nb_lines, self.nb_columns)

    def get(self, coord):
        return self.map[coord[0]][coord[1]]

    def clear(self):
        for line in self.map:
            for cell in line:
                cell.seen = Seen.NONE
                cell.path_length = 0

    # Direction is up or down
    def see_arround(self, cell, direction):
        attr = f"yield_check_{direction}"
        coord = cell.coord
        if coord[0]> 0:
            yield from getattr(cell, attr)(self.get(move_up(coord)))
        if coord[0] < self.nb_lines-1:
            yield from getattr(cell, attr)(self.get(move_down(coord)))
        if coord[1] > 0:
            yield from getattr(cell, attr)(self.get(move_left(coord)))
        if coord[1] < self.nb_columns-1:
            yield from getattr(cell, attr)(self.get(move_right(coord)))

    def flood_map(self, start, scoring, check, direction):
        to_see = [self.get(start)]
        round = 0
        while True:
            cell, to_see = to_see[0], to_see[1:]
            if check(cell):
                return cell.path_length, round
            cell.seen = Seen.SEEN
            to_see.extend(self.see_arround(cell, direction))
            to_see.sort(key=scoring)
            round += 1
            self.print(round)
            sleep(0.005)

    def find_a_way_to_summit(self):
        # Scoring is important.
        # A* found quickly A solution, but it may not the best one.

        # This scoring is fast but not exact:
        # Result:422, round:1460
        scoring = lambda c: c.path_length + abs(c.coord[0]-self.end[0])**2 + abs(c.coord[1]-self.end[1])**2

        # This scoring give more importance to path_length and give the good result
        # Result:412, round:3722
        scoring = lambda c: c.path_length + sqrt(abs(c.coord[0]-self.end[0])**2 + abs(c.coord[1]-self.end[1])**2)
        return self.flood_map(self.start, scoring, lambda cell: cell.coord == self.end, "up")

    def find_shorter_path_to_summit(self):
        # This scoring is fast but not exact:
        #Result:410, round: 2276
        scoring = lambda c: c.height

        # This scoring give more importance to path_length and give the good result
        # Result:402, round:2400
        scoring = lambda c: c.path_length + c.height
        return self.flood_map(self.end, scoring, lambda cell: cell.height == 0, "down")

    def print(self, round):
        global current_color
        # clear the terminal
        print("\033c", end="")
        current_color = None
        print(round)
        for line in self.map:
            for cell in line:
                cell.print()
            print()


def round1(map):
    return map.find_a_way_to_summit()

def round2(map):
    return map.find_shorter_path_to_summit()

def main():
    map = Map()
    result_1 = round1(map)
    map.clear()
    result_2 = round2(map)
    print("Round 1 :", result_1)
    print("Round 2 :", result_2)
    print(map.nb_lines, map.nb_columns)


if __name__ == "__main__":
    main()
