import { readFile } from 'fs/promises'
import { sample } from 'lodash'
import { join } from 'path'

function s(n: number) {
  return Array(n * 2)
    .fill(' ')
    .join('')
}

type ArrOrInt = number | ArrOrInt[]

function compare(o1: ArrOrInt, o2: ArrOrInt, level = 1): boolean | null {
  console.log(s(level), 'Compare', JSON.stringify(o1), 'vs', JSON.stringify(o2))

  if (Array.isArray(o1) && !Array.isArray(o2)) {
    console.log(
      s(level),
      `Mixed types; convert right to [${o2}] and retry comparison`,
    )
    return compare(o1, [o2], level)
  } else if (!Array.isArray(o1) && Array.isArray(o2)) {
    console.log(
      s(level),
      `Mixed types; convert left to [${o1}] and retry comparison`,
    )
    return compare([o1], o2, level)
  } else if (Array.isArray(o1) && Array.isArray(o2)) {
    for (let i = 0; i < Math.max(o1.length, o2.length); i++) {
      const left = o1[i],
        right = o2[i]

      if (i === o1.length && i < o2.length) {
        console.log(s(level + 1), 'Left side ran out of items, right order')
        return true
      } else if (i === o2.length && i < o1.length) {
        console.log(s(level + 1), 'Right side ran out of items, wrong order')
        return false
      }
      const res = compare(left, right, level + 1)
      if (res !== null) {
        return res
      }
    }
  } else if (!Array.isArray(o1) && !Array.isArray(o2)) {
    if (o1 < o2) {
      console.log(s(level), 'Left side smaller, right order')
      return true
    } else if (o1 > o2) {
      console.log(s(level), 'Right side smaller, wrong order')
      return false
    }
  }
  return null
}

console.log(
  compare(
    [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
    [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
  ),
)

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  const pairs = input.split('\n\n')
  let res = 0
  pairs.forEach((p, i) => {
    const [left, right] = p.split('\n').map((txt) => JSON.parse(txt))
    if (compare(left, right) === true) {
      console.log('bingo')
      res += i + 1
    }
  })
  console.log(res)
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
