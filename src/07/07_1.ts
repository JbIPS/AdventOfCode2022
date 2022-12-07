import { readFile } from 'fs/promises'
import { join } from 'path'
import { inspect } from '../utils/inspect'
import { FsTree, Line, Tree } from './types'
import { parseCdCommand, parseFile, printTree } from './utils'

function parseLine(line: string): Line {
  if (line.startsWith('$ cd')) {
    return parseCdCommand(line)
  }
  if (line === '$ ls') {
    return { type: 'ls' }
  }
  if (line.startsWith('dir ') || /^(\d+)/.test(line)) {
    return parseFile(line)
  }
  throw new Error('unexpected line ' + line)
}

function buildStack(lines: string[]): Line[] {
  const stack: Line[] = []
  lines.forEach((line) => stack.push(parseLine(line)))
  return stack
}

function buildTree(currentTree: FsTree, stack: Line[], root: FsTree): FsTree {
  //   console.log('------------')
  //   console.log(
  //     printTree(
  //       root,
  //       (node: FsTree) => `${node.value?.name} (${node.value?.size})`,
  //     ),
  //   )
  //   console.log('value', currentTree.value)
  //   console.log(stack)

  let line
  while ((line = stack.shift())) {
    console.log('processing', line)
    switch (line.type) {
      case 'cd':
        if (line.dir === '/') return buildTree(currentTree, stack, root)
        if (line.dir === '..') {
          return buildTree(currentTree.parent!, stack, root)
        }
        const dirNode = {
          parent: currentTree,
          children: [],
          value: { name: line.dir, size: 0 },
        }
        currentTree.children.push(dirNode)
        return buildTree(dirNode, stack, root)
        break
      case 'file':
        if (line.isDir) break
        currentTree.children.push({
          parent: currentTree,
          children: [],
          value: { name: line.name, size: line.size },
        })
        break
    }
  }
  return currentTree
}

function computeDirSize(tree: FsTree): number {
  let size = tree.value!.size
  for (const node of tree.children ?? []) {
    size += computeDirSize(node)
  }
  return size
}

function findDirectoriesWithSizeLt100k(
  tree: FsTree,
  res: FsTree[] = [],
): FsTree[] {
  if (tree.value?.size === 0) {
    // warning: change with is_dir?
    const size = computeDirSize(tree)
    if (size < 100000) {
      res.push(tree)
    }
  }

  for (const node of tree.children ?? []) {
    findDirectoriesWithSizeLt100k(node, res)
  }

  return res
}

function getSampleStack() {
  const commands = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

  return buildStack(commands.split('\n'))
}

async function main() {
  const input = await readFile(join(__dirname, 'input.txt'), {
    encoding: 'utf-8',
  })

  const tree: FsTree = {
    children: [],
    value: { name: '/', size: 0 },
    parent: null,
  }

  //buildTree(tree, getSampleStack(), tree)
  buildTree(tree, buildStack(input.trim().split('\n')), tree)

  console.log(
    printTree(
      tree,
      (node: FsTree) => `${node.value?.name} (${node.value?.size})`,
    ),
  )

  console.log(computeDirSize(tree))

  console.log(
    findDirectoriesWithSizeLt100k(tree).reduce(
      (acc, tree) => acc + computeDirSize(tree),
      0,
    ),
  )
}

main().catch(console.error)

/*{
      type: 'cd',
      dir: '/',
    },
    {
      type: 'cd',
      dir: 'a',
    },
    {
      type: 'cd',
      dir: '..',
    },
    {
      type: 'cd',
      dir: 'b',
    },
    {
      type: 'file',
      name: 'fa',
      size: 10,
      isDir: false,
    },

*/
