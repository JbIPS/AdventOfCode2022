const fs = require("fs/promises");

async function start() {
	const file = await fs.readFile("day9_input.txt", { encoding: "utf8" });
	const movements = file.split("\n").map((line) => {
		const [direction, stringVal] = line.split(" ");
		const value = parseInt(stringVal);
		return { direction, value };
	});

	const tail = { x: 0, y: 0 };
	const head = { x: 0, y: 0 };
	const visited = [];

	const followPosition = (tail, head) => {
		const lineDif = Math.abs(tail.x - head.x);
		const colDif = Math.abs(tail.y - head.y);
		if (lineDif <= 1 && colDif <= 1) {
			return;
		}
		if (lineDif === 0) {
			tail.y += head.y > tail.y ? 1 : -1;
		} else if (colDif === 0) {
			tail.x += head.x > tail.x ? 1 : -1;
		} else {
			tail.y += head.y > tail.y ? 1 : -1;
			tail.x += head.x > tail.x ? 1 : -1;
		}
	};

	movements.forEach((movement) => {
		const { direction, value } = movement;

		for (let i = 0; i < value; i++) {
			if (direction === "U") {
				head.y++;
			}
			if (direction === "D") {
				head.y--;
			}
			if (direction === "R") {
				head.x++;
			}
			if (direction === "L") {
				head.x--;
			}
			followPosition(tail, head);
			if (
				!visited.some(
					(position) => position.x === tail.x && position.y === tail.y
				)
			) {
				visited.push(Object.assign({}, tail));
			}
		}
	});

	console.log(visited.length);
}
start();

async function startPartTwo() {
	const file = await fs.readFile("day9_input.txt", { encoding: "utf8" });
	const movements = file.split("\n").map((line) => {
		const [direction, stringVal] = line.split(" ");
		const value = parseInt(stringVal);
		return { direction, value };
	});

	const head = { x: 0, y: 0 };
	const knots = [
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
	];

	const visited = [];

	const followPosition = (tail, head) => {
		const lineDif = Math.abs(tail.x - head.x);
		const colDif = Math.abs(tail.y - head.y);
		if (lineDif <= 1 && colDif <= 1) {
			return;
		}
		if (lineDif === 0) {
			tail.y += head.y > tail.y ? 1 : -1;
		} else if (colDif === 0) {
			tail.x += head.x > tail.x ? 1 : -1;
		} else {
			tail.y += head.y > tail.y ? 1 : -1;
			tail.x += head.x > tail.x ? 1 : -1;
		}
	};

	movements.forEach((movement) => {
		const { direction, value } = movement;

		for (let i = 0; i < value; i++) {
			if (direction === "U") {
				head.y++;
			}
			if (direction === "D") {
				head.y--;
			}
			if (direction === "R") {
				head.x++;
			}
			if (direction === "L") {
				head.x--;
			}

			knots.forEach((knot, ind, knots) => {
				ind === 0
					? followPosition(knot, head)
					: followPosition(knot, knots[ind - 1]);

				if (
					ind === 8 &&
					!visited.some(
						(position) => position.x === knot.x && position.y === knot.y
					)
				) {
					visited.push(Object.assign({}, knot));
				}
			});
		}
	});

	console.log(visited.length);
}
startPartTwo();
