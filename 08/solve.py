#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

class Tree:
    def __init__(self, height):
        self.height = height
        self.visible = False

    def __str__(self):
        return f"{self.height}"


def read_map():
    map = []
    for line in yield_input():
        map.append([Tree(int(i)) for i in line])
    return map

def yield_by_column(map, column):
    for line in map:
        yield line[column]

def mark_visible_trees_in_line(line):
    max_height = None
    for tree in line:
        if max_height is None or tree.height > max_height:
            tree.visible = True
            max_height = tree.height


def mark_visible_trees(map):
    for line in map:
        mark_visible_trees_in_line(line)
        mark_visible_trees_in_line(line[::-1])
    nb_column = len(map[0])
    for column in range(nb_column):
        mark_visible_trees_in_line(yield_by_column(map, column))
        mark_visible_trees_in_line(yield_by_column(reversed(map), column))


def count_visible_in_line(line, height):
    count = 0
    for tree in line:
        count +=1
        if tree.height >= height:
            break
    return count


def round1(map):
    count = 0
    mark_visible_trees(map)
    for line in map:
        for tree in line:
            if tree.visible:
                count += 1
    return count

def round2(map):
    best_score = 0
    for line_idx, line in enumerate(map):
        for column_idx, tree in enumerate(line):
            score = 1
            # Look left
            score *= count_visible_in_line(reversed(line[:column_idx]), tree.height)
            # Look right
            score *= count_visible_in_line(line[column_idx+1:], tree.height)
            # Look up
            score *= count_visible_in_line(yield_by_column(reversed(map[:line_idx]), column_idx), tree.height)
            # Look down
            score *= count_visible_in_line(yield_by_column(map[line_idx+1:], column_idx), tree.height)
            best_score = max(score, best_score)

    return best_score


def main():
    map = read_map()
    print("Round 1 :", round1(map))
    print("Round 2 :", round2(map))


if __name__ == "__main__":
    main()

