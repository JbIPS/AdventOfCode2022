const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day9_input.txt', {encoding: 'utf8'})
	return input.split('\n').filter(line => line !== '').map(line => {
		const [direction, mp] = line.split(' ')
		return {
			direction,
			mp
		}
	})
}

function updateTailPosition(tailPosition, headPosition) {
	if(Math.abs(tailPosition.x - headPosition.x) <= 1) {
		if( Math.abs(tailPosition.y - headPosition.y) <= 1) return
		tailPosition.y += tailPosition.y < headPosition.y ? 1 : -1
		if(tailPosition.x - headPosition.x !== 0) {
			tailPosition.x += tailPosition.x < headPosition.x ? 1 : -1
		}
	} else {
		if(tailPosition.y - headPosition.y !== 0) {
			tailPosition.y += tailPosition.y < headPosition.y ? 1 : -1
		} 
		tailPosition.x += tailPosition.x < headPosition.x ? 1 : -1
	}
}

async function part1() {
	const inputs = await readInput()
	const tailPosition = {x: 0, y: 0}
	const headPosition = {x: 0, y: 0}
	const visitedPosition = []
	for(let mvmt of inputs) {
		while(mvmt.mp > 0) {
			switch(mvmt.direction) {
				case 'U': ++headPosition.y
					break
				case 'D': --headPosition.y
					break
				case 'R': ++headPosition.x
					break
				case 'L': --headPosition.x
					break
			}
			updateTailPosition(tailPosition, headPosition)
			if(!visitedPosition.some(pos => pos.x === tailPosition.x && pos.y === tailPosition.y)) visitedPosition.push(Object.assign({}, tailPosition))
			--mvmt.mp
		}
	}
	return visitedPosition.length
}

async function part2() {
	const inputs = await readInput()
	const headPosition = {x: 0, y: 0}
	const knots = []
	for(let i = 0; i < 9; i++) {
		knots[i] = {x: 0, y: 0}
	}
	const visitedPosition = []
	for(let mvmt of inputs) {
		while(mvmt.mp > 0) {
			switch(mvmt.direction) {
				case 'U': ++headPosition.y
					break
				case 'D': --headPosition.y
					break
				case 'R': ++headPosition.x
					break
				case 'L': --headPosition.x
					break
			}
			knots.forEach((knot, index, knots) => {
				updateTailPosition(knot, index === 0 ? headPosition : knots[index - 1])
				if(index === knots.length - 1 && !visitedPosition.some(pos => pos.x === knot.x && pos.y === knot.y)) visitedPosition.push(Object.assign({}, knot))
			})
			--mvmt.mp
		}
	}
	
	 return visitedPosition.length
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
