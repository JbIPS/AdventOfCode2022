#!/usr/bin/python3

import sys

elves_calories = []
current_calories = 0

with open(sys.argv[1]) as f:
    for l in f:
        l = l.strip()
        if not l:
            elves_calories.append(current_calories)
            current_calories = 0
        else:
            current_calories += int(l)

print(elves_calories)
elves_calories.sort(reverse=True)
print(sum(elves_calories[:3]))
