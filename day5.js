const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day5_input.txt', {encoding: 'utf8'})
	const [stacksInput, movementsInput] = input.split('\n\n')
	const stacks = []
	const stackLines = stacksInput.split('\n')
	// Pop last lines containing crates number
	stackLines.pop()
	for(line of stackLines) {
		for(let i = 0; i < line.length; i += 4) {
			const crate = line.slice(i, i+3)
			const stackIndex = i / 4
			if(!stacks[stackIndex]) stacks[stackIndex] = []
			if(crate !== '   ') stacks[stackIndex].unshift(crate.charAt(1))
		}
	}
	const movements = movementsInput.split('\n').filter(line => line !== '').map(mvmt => {
		const tokens = mvmt.split(' ')
		return {
			number: parseInt(tokens[1], 10),
			origin: parseInt(tokens[3], 10),
			destination: parseInt(tokens[5], 10)
		}
	})
	return [stacks, movements]
}

async function part1() {
	const [stacks, movements] = await readInput()
	for(let movement of movements) {
		for(let i = 0; i < movement.number; i++) {
			stacks[movement.destination - 1].push(stacks[movement.origin - 1].pop())
		}
	}
	return stacks.map(stack => stack.pop()).join('')
}

async function part2() {
	const [stacks, movements] = await readInput()
	for(let movement of movements) {
		stacks[movement.destination - 1] = stacks[movement.destination - 1].concat(stacks[movement.origin - 1].splice(movement.number * -1))
	}
	return stacks.map(stack => stack.pop()).join('')
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
