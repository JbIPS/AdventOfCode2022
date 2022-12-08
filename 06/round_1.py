#!/usr/bin/python3

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for item in f.read():
            yield item


last_four = []
for pos, item in enumerate(yield_input()):
    last_four.append(item)
    if len(last_four) == 4:
        if len(set(last_four)) == 4:
            print(pos+1)
            break
        last_four = last_four[1:]

