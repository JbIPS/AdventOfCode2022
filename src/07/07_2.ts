import { readFile } from 'fs/promises'
import { join } from 'path'
import { FsTree, Line } from './types'
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

function findAllDirectoriesWithSize(
  tree: FsTree,
  res: Map<string, number> = new Map(),
): Map<string, number> {
  if (tree.value?.size === 0) {
    const size = computeDirSize(tree)
    res.set(tree.value.name, size)
  }

  for (const node of tree.children ?? []) {
    findAllDirectoriesWithSize(node, res)
  }

  return res
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

  const usedSpace = computeDirSize(tree)

  const totalSpace = 70e6
  const freeSpace = totalSpace - usedSpace
  const requiredSpace = 30e6
  const spaceToFreeUp = requiredSpace - freeSpace
  console.log(spaceToFreeUp)

  const allDirectories = findAllDirectoriesWithSize(tree)
  console.log(
    [...allDirectories.entries()]
      .filter(([name, size]) => size > spaceToFreeUp)
      .sort(([nA, sA], [nB, sB]) => sA - sB)[0],
  )
}

main().catch(console.error)
