const fs = require("fs/promises");

async function startFirstPart() {
	const file = await fs.readFile("day7_input.txt", { encoding: "utf8" });

	const directories = [{ name: "/", value: 0 }];
	let currentDirectory = 0;

	file.split("\n").forEach((line) => {
		const command = line.split(" ");

		if (command[0] === "$" && command[1] === "cd" && command[2] !== "/") {
			if (command[2] === "..") {
				if (currentDirectory !== 0) {
					currentDirectory = directories[currentDirectory].parentIndex;
				}
			} else
				currentDirectory = directories.findIndex(
					(directory) => directory.name === command[2]
				);
		} else if (command[0] === "dir") {
			directories.push({
				name: command[1],
				value: 0,
				parentIndex: currentDirectory,
			});
		} else if (parseInt(command[0])) {
			directories[currentDirectory].value += parseInt(command[0]);
			if (currentDirectory !== 0) {
				let n = currentDirectory;
				while (n !== 0) {
					n = directories[n].parentIndex;
					directories[n].value += parseInt(command[0]);
				}
			}
		}
	});

	let valuesAtMost = 0;

	directories.forEach((dir) => {
		valuesAtMost += dir.value > 100000 ? 0 : dir.value;
	});

	console.log(valuesAtMost);
}
startFirstPart();
