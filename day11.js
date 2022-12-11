const Fs = require('fs/promises')

const STATE = {
	'NEW_MONKEY': 0,
	'ITEMS': 1,
	'OP': 2,
	'TEST': 3,
	'TRUE': 4,
	'FALSE': 5
}

async function readInput() {
	const input = await Fs.readFile('./day11_input.txt', {encoding: 'utf8'})
	const lines = input.split('\n').filter(line => line !== '')
	const monkeys = []
	let state = STATE.NEW_MONKEY
	for(let line of lines) {
		switch(state) {
			case STATE.NEW_MONKEY:
				const monkey = /Monkey (\d+)/.exec(line)
				const monkeyNum = monkey[1]	
				monkeys.push({
					id: monkeyNum,
					items: [],
					test: 0,
					true: 0,
					false: 0,
					op: ''
				})
				state = STATE.ITEMS
				break
			case STATE.ITEMS: 
				const items = line.split(':').pop().split(',')
					.map(i => i.trim())
					.map(i => parseInt(i, 10))
				monkeys[monkeys.length - 1].items = items
				state = STATE.OP
				break
			case STATE.OP:
				monkeys[monkeys.length - 1].op = line.split('=').pop()
				state = STATE.TEST
				break
			case STATE.TEST:
				monkeys[monkeys.length - 1].test = /divisible by (\d+)/.exec(line)[1]
				state = STATE.TRUE
				break
			case STATE.TRUE:
				monkeys[monkeys.length - 1].true = /throw to monkey (\d+)/.exec(line)[1]
				state = STATE.FALSE
				break
			case STATE.FALSE:
				monkeys[monkeys.length - 1].false = /throw to monkey (\d+)/.exec(line)[1]
				state = STATE.NEW_MONKEY
				break
		}
	}
	return monkeys
}


async function part1() {
	const monkeys = await readInput()
	const inspected = new Array(monkeys.length).fill(0)
	let round = 0
	while(round < 20) {
		for(let i = 0; i < monkeys.length; i++) {
			const monkey = monkeys[i]
			while(monkey.items.length > 0) {
				let old = monkey.items.shift()
				let worry = eval(monkey.op)
				worry = Math.floor(worry / 3)
				inspected[i]++
				monkeys[worry % monkey.test === 0 ? monkey.true : monkey.false].items.push(worry)
			}
		}
		round++
	}
	inspected.sort((a,b) => b-a)
	const first = inspected[0]
	const second = inspected[1]
	return first * second
}

async function part2() {
	const monkeys = await readInput()
	const inspected = new Array(monkeys.length).fill(0)
	const modulo = monkeys
    .map((monkey) => monkey.test)
    .reduce((dividerA, dividerB) => dividerA * dividerB, 1);
	let round = 0
	while(round < 10_000) {
		for(let i = 0; i < monkeys.length; i++) {
			const monkey = monkeys[i]
			while(monkey.items.length > 0) {
				let old = monkey.items.shift()
				let worry = eval(monkey.op)
				//worry = Math.floor(worry / 3)
				inspected[i]++
				monkeys[worry % monkey.test === 0 ? monkey.true : monkey.false].items.push(worry % modulo)
			}
		}
		round++
	}
	inspected.sort((a,b) => b-a)
	const first = inspected[0]
	const second = inspected[1]
	return first * second
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
