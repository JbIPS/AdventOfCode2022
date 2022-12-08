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

score = 0
for items in yield_input():
    nb_items = len(items)
    pack1, pack2 = set(items[:nb_items//2]), set(items[nb_items//2:])
    common = pack1 & pack2
    assert(len(common) == 1)
    score += get_score(list(common)[0])

print(score)
