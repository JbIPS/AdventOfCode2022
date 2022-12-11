import { readFile } from 'fs/promises'
import { range } from 'lodash'
import { join } from 'path'

class Monkey {
  public timesInspected = 0

  constructor(
    public readonly items: number[],
    public readonly operation: (x: number) => number,
    public readonly test: number,
    public readonly targetIfTrue: number,
    public readonly targetIfFalse: number,
  ) {}

  public giveItem(item: number) {
    this.items.push(item)
  }

  private processNextItem(): { target: number; value: number } {
    const item = this.items.shift()
    if (item === undefined) throw 'kaboom'
    this.timesInspected++
    const newWorryLevel = Math.floor(this.operation(item) / 3)
    return {
      value: newWorryLevel,
      target:
        newWorryLevel % this.test === 0
          ? this.targetIfTrue
          : this.targetIfFalse,
    }
  }

  public processItems(): { target: number; value: number }[] {
    return range(0, this.items.length).map((_) => this.processNextItem())
  }

  private static getOperationFunction(
    operand1: string,
    op: string,
    operand2: string,
  ): (x: number) => number {
    if (operand1 === 'old' && op === '*' && operand2 === 'old') {
      return (x) => x * x
    }
    return {
      '+': (x: number) => x + Number(operand2),
      '*': (x: number) => x * Number(operand2),
    }[op as '+' | '*']
  }

  public static fromInput(input: string) {
    const lines = input.split('\n')
    const items = /^  Starting items: (.+)$/
      .exec(lines[1])![1]
      .split(', ')
      .map(Number)

    const [_, operand1, op, operand2] =
      /^  Operation: new = (.+) (.+) (.+)$/.exec(lines[2])!
    const operationFunction = this.getOperationFunction(operand1, op, operand2)
    const test = Number(/^  Test: divisible by (\d+)/.exec(lines[3])![1])
    const targetIfTrue = Number(
      /^    If true: throw to monkey (\d+)/.exec(lines[4])![1],
    )
    const targetIfFalse = Number(
      /^    If false: throw to monkey (\d+)/.exec(lines[5])![1],
    )
    return new Monkey(
      items,
      operationFunction,
      test,
      targetIfTrue,
      targetIfFalse,
    )
  }
}

function parseInput(input: string): Monkey[] {
  return input.split('\n\n').map((block) => {
    return Monkey.fromInput(block)
  })
}

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  const monkeys = parseInput(input)
  for (const round of range(0, 20)) {
    for (const [i, monkey] of monkeys.entries()) {
      console.log('Monkey', i)
      const items = monkey.processItems()
      items.forEach((item) => monkeys[item.target].giveItem(item.value))
    }
    console.log(
      monkeys
        .map(
          (monkey, i) =>
            `Monkey ${i} : ${monkey.items} (${monkey.timesInspected})`,
        )
        .join('\n'),
    )
    console.log(
      [...monkeys]
        .sort((m1, m2) => m2.timesInspected - m1.timesInspected)
        .slice(0, 2)
        .map((monkey) => monkey.timesInspected)
        .reduce((acc, x) => acc * x),
    )
  }
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
