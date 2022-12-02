const Fs = require('fs')

const POINTS = {
	X: 1,
	Y: 2,
	Z: 3
}

function matchScore(opponent, mine) {
	switch(opponent) {
		case 'A': return mine === 'X' ? 3 : mine === 'Y' ? 6 : 0
		case 'B': return mine === 'X' ? 0 : mine === 'Y' ? 3 : 6
		case 'C': return mine === 'X' ? 6 : mine === 'Y' ? 0 : 3
	}
}

function getRightPick(opponent, roundResult) {
	switch(roundResult) {
		case 'X': return opponent === 'A' ? 'Z' : opponent === 'B' ? 'X' : 'Y'
		case 'Y': return opponent === 'A' ? 'X' : opponent === 'B' ? 'Y' : 'Z'
		case 'Z': return opponent === 'A' ? 'Y' : opponent === 'B' ? 'Z' : 'X'
	}
}

function forEachRound(callback) {
	const stream = Fs.createReadStream('day2_input.txt', {encoding: 'utf8'})

	let totalScore = 0
	stream.on('readable', () => {
		let data
		while((data = stream.read()) != null) {
			const lines  = data.split('\n')
			lines.forEach((line) => {
				if(line !== '') {
					totalScore += callback(...line.split(' '))
				}
			})
		}
	})

	return new Promise((resolve) => {
		stream.on('end', () => {
			resolve(totalScore)
		})
	})
}

function part1() {
	return forEachRound((opponent, mine) => {
		return  matchScore(opponent, mine) + POINTS[mine]
	})
}

function part2() {
	return forEachRound((opponent, roundResult) => {
		const myPick = getRightPick(opponent, roundResult)
		return POINTS[myPick] + (POINTS[roundResult] - 1) * 3
	})
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
