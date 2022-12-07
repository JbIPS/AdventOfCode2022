import { CdCommand, FileLine, Tree } from './types'

export function parseCdCommand(line: string): CdCommand {
  const parsed = /^\$ cd (.+)$/.exec(line)
  if (parsed === null) throw new Error(`Cannot parse cd command "${line}"`)
  return { type: 'cd', dir: parsed[1] }
}

export function parseFile(line: string): FileLine {
  const [sizeOrType, name] = line.split(' ')
  if (sizeOrType == 'dir') {
    return { type: 'file', isDir: true, size: 0, name }
  }
  return { type: 'file', isDir: false, size: Number(sizeOrType), name }
}

export function printTree<T>(
  initialTree: Tree<T>,
  printNode: (t: Tree<T>, branch: string) => string,
) {
  function printBranch(tree: Tree<T>, branch: string) {
    const isGraphHead = branch.length === 0
    const children = tree.children || []

    let branchHead = ''

    if (!isGraphHead) {
      branchHead = children && children.length !== 0 ? '┬ ' : '─ '
    }

    const toPrint = printNode(tree, `${branch}${branchHead}`)

    if (typeof toPrint === 'string') {
      console.log(`${branch}${branchHead}${toPrint}`)
    }

    let baseBranch = branch

    if (!isGraphHead) {
      const isChildOfLastBranch = branch.slice(-2) === '└─'
      baseBranch = branch.slice(0, -2) + (isChildOfLastBranch ? '  ' : '│ ')
    }

    const nextBranch = baseBranch + '├─'
    const lastBranch = baseBranch + '└─'

    children.forEach((child, index) => {
      printBranch(
        child,
        children.length - 1 === index ? lastBranch : nextBranch,
      )
    })
  }

  printBranch(initialTree, '')
}
