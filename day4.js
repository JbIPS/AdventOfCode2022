const Fs = require('fs/promises')

function fullyContains(elf1, elf2) {
	return (elf1.min <= elf2.min && elf1.max >= elf2.max) || (elf2.min <= elf1.min && elf2.max >= elf1.max)
}

function overlap(elf1, elf2) {
	return (elf1.min <= elf2.min && elf1.max >= elf2.min) || (elf2.min <= elf1.min && elf2.max >= elf1.min)
}

async function compareSectors(comparingFn) {
	const pairs = (await Fs.readFile('./day4_input.txt', {encoding: 'utf8'})).split('\n')
	return pairs.reduce((overlap, pair) => {
		if(pair === '') return overlap
		const [elf1, elf2] = pair.split(',').map(boundaries => {
			const [min, max] = boundaries.split('-')
			return {
				min: parseInt(min, 10),
				max: parseInt(max, 10)
			}
		})
		if(comparingFn(elf1, elf2)) overlap++
		return overlap
	}, 0)
}

function part1() {
	return compareSectors(fullyContains)
}

function part2() {
	return compareSectors(overlap)
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
