#!/usr/bin/python3

from enum import IntEnum

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l

class Option(IntEnum):
    Rock = 1
    Paper = 2
    Scissor = 3

    def score(self, other):
        if self == other:
            return 3
        me = self.value % 3
        other = (other.value+1) % 3
        if me == other:
            return 6
        else:
            return 0

def option_from_action(action):
    if action in "AX":
        return Option.Rock
    if action in "BY":
        return Option.Paper
    return Option.Scissor

def option_from_strat(strat):
    opponent, me = map(option_from_action, strat.split())
    return opponent, me

def get_score(opponent, me):
    my_score = me.value
    my_score += me.score(opponent)
    return my_score

my_score = 0
for strat in yield_input():
    my_score += get_score(*option_from_strat(strat))

print(my_score)
