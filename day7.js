const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day7_input.txt', {encoding: 'utf8'})
	const filesTree = {
		name: '/',
		size: 0,
		children: [],
		parent: null
	}
	let currentNode
	for(let line of input.split('\n')) {
		if(line.startsWith('$')) {
			const [_, cmd, arg] = line.split(' ')
			if(cmd === 'cd') {
				if(arg === '/') currentNode = filesTree
				else if(arg === '..') currentNode = currentNode.parent
				else currentNode = currentNode.children.find(n => n.name === arg)
			} 
		} else if (line !== ''){
			const [size, name] = line.split(' ')
			currentNode.children.push({
				name,
				size: size === 'dir' ? 0 : parseInt(size, 10),
				children: size === 'dir' ? [] : undefined,
				parent: currentNode
			})
		}
		
	}
	// Update nodes size in tree
	updateNodeSize(filesTree)
	return filesTree
}

function updateNodeSize(node) {
	if(node.children) {
		node.size = node.children.reduce((memo, child) => {
			memo += updateNodeSize(child)
			return memo
		}, 0)
	}
	return node.size
}

function getNodeWithLimit(node, isInLimit, result) {
	if(!node.children) return result
	const childrenUnderLimit = node.children.reduce((memo, child) => {
		memo = memo.concat(getNodeWithLimit(child, isInLimit, []))
		return memo
	}, result)
	if(isInLimit(node)) childrenUnderLimit.push(node)
	return childrenUnderLimit
}

async function part1() {
	const fileTree = await readInput()
	return getNodeWithLimit(fileTree, (node) => node.size <= 100000, []).reduce((memo, node) => memo += node.size, 0)
}

async function part2() {
	const DISK_SIZE = 70000000
	const TARGET = 30000000
	const tree = await readInput()
	const usedSize = tree.size
	const memToFree = TARGET - (DISK_SIZE - usedSize)
	return getNodeWithLimit(tree, (node) => node.size >= memToFree, [])
	.map(node => node.size)
	.sort()
	.shift()
	
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
