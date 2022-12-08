#!/usr/bin/python3

import re

class Directory:
    def __init__(self, parent=None, name=None):
        self.parent = parent
        self.name = name or "/"
        self.size_of_files = 0
        self.subdirs = {}

    def add_file(self, size):
        self.size_of_files += size

    def add_subdir(self, entry):
        self.subdirs[entry.name] = entry

    def __str__(self):
        if parent:
            return f"{self.parent}{self.name}/"
        else:
            return f"{self.name}"

def yield_input():
    import sys
    with open(sys.argv[1]) as f:
        for l in f:
            l = l.strip()
            yield l


cd_cmd = re.compile("^\$ cd (?P<path>.*)$")
ls_cmd = re.compile("^\$ ls$")
dir_result = re.compile("^dir (?P<path>.*)$")
file_result = re.compile("^(?P<size>[0-9]+) (?P<path>.*)$")

total_size = 0

def build_tree():
    global total_size
    root = Directory()
    current = None
    lines = yield_input()
    line = next(lines)
    try:
        while True:
            if m:= cd_cmd.match(line):
                path = m.group("path")
                if path == "/":
                    current = root
                elif path == "..":
                    current = current.parent
                else:
                    current = current.subdirs[path]
                line = next(lines)
            elif m:= ls_cmd.match(line):
                line = next(lines)
                while not line.startswith("$"):
                    if m:= dir_result.match(line):
                        path = m.group("path")
                        directory = Directory(current, path)
                        current.add_subdir(directory)
                    elif m:= file_result.match(line):
                        size = int(m.group("size"))
                        total_size += size
                        current.add_file(size)
                    line = next(lines)
    except StopIteration:
        pass
    return root


def round1(tree):
    small_dirs_size = 0

    # Visit a directory and return it size.
    # If it size is <= 100_000 it add it to small_dirs
    def visit_dir(current):
        nonlocal small_dirs_size
        size = current.size_of_files
        for subdir in current.subdirs.values():
            size += visit_dir(subdir)
        #print(size)
        if size <= 100_000:
            small_dirs_size += size
        return size

    visit_dir(tree)
    return small_dirs_size

def round2(tree):
    needed_size = 30_000_000 - (70_000_000 - total_size)
    #print(f"Total size is {total_size}. So we need {needed_size}")
    current_size = total_size

    # Visit a directory and return it size.
    # If it size is <= 100_000 it add it to small_dirs
    def visit_dir(current):
        nonlocal current_size
        size = current.size_of_files
        for subdir in current.subdirs.values():
            size += visit_dir(subdir)
        if size >= needed_size and size < current_size:
            current_size = size
        return size

    visit_dir(tree)

    return current_size

def main():
    tree = build_tree()
    print("Round 1 :", round1(tree))
    print("Round 2 :", round2(tree))


if __name__ == "__main__":
    main()

