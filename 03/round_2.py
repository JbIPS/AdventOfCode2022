#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

def get_score(item):
    if item.islower():
        return ord(item) - ord("a") + 1
    else:
        return ord(item) - ord("A") + 27

packs = []
score = 0
for items in yield_input():
    packs.append(set(items))
    if len(packs) == 3:
        common = packs[0]
        for pack in packs[1:]:
            common &= pack
        assert(len(common) == 1)
        score += get_score(list(common)[0])
        packs = []

print(score)
