const fs = require("fs/promises");

async function start() {
	const file = await fs.readFile("day11_input.txt", { encoding: "utf8" });
	let monkeyModulo = 1;

	const monkeysInput = file.split("\n\n").map((monkey) => {
		const lines = monkey.split("\n").map((line) => line.split(" "));
		monkeyModulo *= lines[3].slice(5).map((num) => parseInt(num))[0];
		return {
			monkeyValue: parseInt(lines[0][1][0]),
			items: lines[1].slice(4).map((num) => parseInt(num)),
			operation: lines[2].slice(6),
			testValue: lines[3].slice(5).map((num) => parseInt(num))[0],
			trueCondition: lines[4].slice(9).map((num) => parseInt(num))[0],
			falseCondition: lines[5].slice(9).map((num) => parseInt(num))[0],
			incrementalCount: 0,
		};
	});

	const monkeyBusiness = (input, rounds, relief) => {
		const monkeys = [...input];
		for (let i = 0; i < rounds; i++) {
			monkeys.forEach((monkey) => {
				const {
					monkeyValue,
					items,
					operation,
					testValue,
					trueCondition,
					falseCondition,
				} = monkey;

				const operatedItems = items.map((item) => {
					let modItem = item % monkeyModulo;
					monkeys[monkeyValue].incrementalCount++;
					const val = parseInt(operation[1]) ? parseInt(operation[1]) : modItem;
					switch (operation[0]) {
						case "+":
							return Math.floor((modItem += val) / relief);
						case "-":
							return Math.floor((modItem -= val) / relief);
						case "*":
							return Math.floor((modItem *= val) / relief);
					}
				});

				operatedItems.forEach((item) => {
					if (item % testValue === 0) {
						monkeys[trueCondition].items.push(item);
					} else {
						monkeys[falseCondition].items.push(item);
					}
					monkeys[monkeyValue].items.shift();
				});
			});
		}
		monkeys.sort((a, b) => b.incrementalCount - a.incrementalCount);
		return monkeys[0].incrementalCount * monkeys[1].incrementalCount;
	};
	console.log("First part : " + monkeyBusiness(monkeysInput, 20, 3));
	console.log("Second part : " + monkeyBusiness(monkeysInput, 10000, 1));
}
start();
