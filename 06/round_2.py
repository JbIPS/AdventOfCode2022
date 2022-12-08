#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for item in f.read():
            yield item


last_set = []
for pos, item in enumerate(yield_input()):
    last_set.append(item)
    if len(last_set) == 14:
        if len(set(last_set)) == 14:
            print(pos+1)
            break
        last_set = last_set[1:]

