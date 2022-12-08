const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day8_input.txt', {encoding: 'utf8'})
	return input.split('\n').filter(line => line !== '').map(line => line.split('').map(t => parseInt(t, 10)))
}

async function part1() {
	const forest = await readInput()
	return forest.reduce((memo, line, vIndex) => {
		if(vIndex === 0 || vIndex === forest.length - 1) memo += line.length
		else {
			memo += line.reduce((memo, tree, hIndex) => {
				if(hIndex === 0 || hIndex === line.length - 1) ++memo
				else {
					const column = forest.map(line => line[hIndex])
					const visibleTop = column.slice(0, vIndex).every(t => t < tree)
					const visibleLeft = line.slice(0, hIndex).every(t => t < tree)
					const visibleBottom = column.slice(vIndex + 1).every(t => t < tree)
					const visibleRight = line.slice(hIndex + 1).every(t => t < tree)
					if(visibleLeft || visibleRight || visibleTop || visibleBottom) ++memo
				}
				return memo
			}, 0)
		}
		return memo
	}, 0)
}

function getView(height, trees) {
	let index = 0
	let taller = false
	while(!taller && index < trees.length) {
		if(trees[index] >= height) taller = true
		++index
	}
	return index
}

async function part2() {
	const forest = await readInput()
	return forest.reduce((memo, line, vIndex) => {
			const lineMax = line.reduce((memo, tree, hIndex) => {
				const column = forest.map(line => line[hIndex])
				if(vIndex === 0 || vIndex === forest.length -1 || hIndex === 0 || hIndex === line.length - 1) return memo
				const treeScore = 
					getView(tree, column.slice(0, vIndex).reverse()) *
					getView(tree, line.slice(0, hIndex).reverse()) *
					getView(tree, column.slice(vIndex + 1)) *
					getView(tree, line.slice(hIndex + 1))
				return memo > treeScore ? memo : treeScore
			}, 0)
			return memo > lineMax ? memo : lineMax
	}, 0)
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
