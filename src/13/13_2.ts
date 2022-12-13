import { cp } from 'fs'
import { readFile } from 'fs/promises'
import { flatten, sample } from 'lodash'
import { join } from 'path'

function s(n: number) {
  return Array(n * 2)
    .fill(' ')
    .join('')
}

type ArrOrInt = number | ArrOrInt[]

function compare(o1: ArrOrInt, o2: ArrOrInt, level = 1): 0 | 1 | -1 {
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
        return 1
      } else if (i === o2.length && i < o1.length) {
        console.log(s(level + 1), 'Right side ran out of items, wrong order')
        return -1
      }
      const res = compare(left, right, level + 1)
      if (res !== 0) {
        return res
      }
    }
  } else if (!Array.isArray(o1) && !Array.isArray(o2)) {
    if (o1 < o2) {
      console.log(s(level), 'Left side smaller, right order')
      return 1
    } else if (o1 > o2) {
      console.log(s(level), 'Right side smaller, wrong order')
      return -1
    }
  }
  return 0
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

  const pairs = (input + '\n\n[[2]]\n[[6]]').split('\n\n')
  const sortedPairs = []
  pairs.forEach((p, i) => {
    const [left, right] = p.split('\n').map((txt) => JSON.parse(txt))

    sortedPairs.push(
      ...[
        right, //[...right].sort((e1, e2) => compare(e2, e1)),
        left, //[...left].sort((e1, e2) => compare(e2, e1)),
      ],
    )
  })

  sortedPairs.sort((e1, e2) => compare(e2, e1))

  console.log(JSON.stringify(sortedPairs, null, 2))
  const i1 = sortedPairs.findIndex((x) => JSON.stringify(x) === '[[2]]') + 1
  const i2 = sortedPairs.findIndex((x) => JSON.stringify(x) === '[[6]]') + 1

  console.log(i1, i2)
  console.log(i1 * i2)
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
