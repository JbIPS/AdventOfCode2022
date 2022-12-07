export interface CdCommand {
  type: 'cd'
  dir: string
}

export interface DirCommand {
  type: 'cd'
  dir: string
}

export interface LsCommand {
  type: 'ls'
}

export interface FileLine {
  type: 'file'
  name: string
  isDir: boolean
  size: number
}

export type Line = CdCommand | DirCommand | FileLine | LsCommand

export interface Tree<T> {
  children: Tree<T>[]
  parent: Tree<T> | null
  value?: T
}
