const fs = require("fs/promises");

async function start() {
	const file = await fs.readFile("day8_input.txt", { encoding: "utf8" });
	let visibleTrees = 0;

	const totalLines = file
		.split("\n")
		.map((line) => line.split("").map((tree) => parseInt(tree)));
	totalLines.forEach((trees, lineIndex) => {
		trees.forEach((tree, treeIndex) => {
			if (lineIndex === 0 || lineIndex === totalLines.length - 1) {
				visibleTrees++;
			} else {
				if (treeIndex === 0 || treeIndex === trees.length - 1) {
					visibleTrees++;
				} else {
					//check left row
					let leftView = true;
					for (let i = treeIndex; i > 0; i--) {
						if (trees[i - 1] >= tree) {
							leftView = false;
						}
					}

					//check right row
					let rightView = true;
					for (let i = treeIndex; i < trees.length; i++) {
						if (trees[i + 1] >= tree) {
							rightView = false;
						}
					}

					//check top column
					let topView = true;
					for (let i = lineIndex; i > 0; i--) {
						if (totalLines[i - 1][treeIndex] >= tree) {
							topView = false;
						}
					}

					//check bottom column
					let bottomView = true;
					for (let i = lineIndex; i < totalLines.length - 1; i++) {
						if (totalLines[i + 1][treeIndex] >= tree) {
							bottomView = false;
						}
					}

					if (leftView || rightView || topView || bottomView) {
						visibleTrees++;
					}
				}
			}
		});
	});
	console.log(visibleTrees);
}
start();
