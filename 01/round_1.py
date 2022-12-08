#!/usr/bin/python3

import sys

max_calories = 0
current_calories = 0

with open(sys.argv[1]) as f:
    for l in f:
        l = l.strip()
        if not l:
            max_calories = max(max_calories, current_calories)
            current_calories = 0
        else:
            current_calories += int(l)

print(max_calories)
