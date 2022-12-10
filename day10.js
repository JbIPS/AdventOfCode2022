const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day10_input.txt', {encoding: 'utf8'})
	return input.split('\n').filter(line => line !== '')
}


async function part1() {
	const instructions = await readInput()
	return instructions.reduce((memo, instruction) => {
		if(instruction.startsWith('addx')) {
			let index = 2
			while(index !== 0) {
				--index
				memo.cycle += 1
				if(index === 0) memo.x += parseInt(instruction.split(' ').pop(), 10)
				if(memo.cycle <= 220 && (memo.cycle - 20) % 40 === 0) {
					memo.strength += memo.cycle * memo.x
				}
			}
		} else {
			memo.cycle += 1
			if(memo.cycle <= 220 && (memo.cycle - 20) % 40 === 0) {
				memo.strength += memo.cycle * memo.x
			}
		}
		return memo
	}, {x: 1, strength: 0, cycle: 1}).strength
}

function updateCRT({crt, x, cycle}) {
	let output = ''
	if(crt % 40 <= x + 1 && crt % 40 >= x - 1) {
		output += '#'
	} else {
		output += '.'
	}
	if(cycle % 40 === 0) {
		output += '\n'
	}
	return output
}

async function part2() {
	const instructions = await readInput()
	return instructions.reduce((memo, instruction) => {
		if(instruction.startsWith('addx')) {
			let index = 2
			while(index !== 0) {
				--index
				memo.output += updateCRT(memo)
				memo.crt++
				memo.cycle += 1
				if(index === 0) memo.x += parseInt(instruction.split(' ').pop(), 10)
			}
		} else {
			memo.output += updateCRT(memo)
			memo.crt++
			memo.cycle += 1
		}
		return memo
	}, {x: 1, cycle: 1, crt: 0, output: ''}).output
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log( solution))
.catch(console.error)
