#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

class Range:
    def __init__(self, str_range):
        self.start, self.end = map(int, str_range.split("-"))

    def is_overlapping(self, other):
        return other.start <= self.start <= other.end or other.start <= self.end <= other.end

    def __str__(self):
        return f"[{self.start} - {self.end}]"


score = 0
for ranges in yield_input():
    range1, range2 = map(Range, ranges.split(","))
    if range1.is_overlapping(range2) or range2.is_overlapping(range1):
        score += 1

print(score)
