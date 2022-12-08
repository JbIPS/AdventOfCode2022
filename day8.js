const fs = require("fs/promises");

async function start() {
	const file = await fs.readFile("day8_input.txt", { encoding: "utf8" });
	let visibleTrees = 0;
	let highScore = 0;

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
					let leftScore = 0;
					for (let i = treeIndex; i > 0; i--) {
						if (trees[i - 1] >= tree) {
							leftView = false;
							leftScore = treeIndex - i + 1;
						}
					}
					if (leftView) {
						leftScore = treeIndex;
					}

					//check right row
					let rightView = true;
					let rightScore = 0;
					for (let i = treeIndex; i < trees.length; i++) {
						if (trees[i + 1] >= tree) {
							rightView = false;
							rightScore = i - treeIndex + 1;
						}
					}
					if (rightView) {
						rightScore = trees.length - treeIndex + 1;
					}

					//check top column
					let topView = true;
					let topScore = 0;
					for (let i = lineIndex; i > 0; i--) {
						if (totalLines[i - 1][treeIndex] >= tree) {
							topView = false;
							topScore = lineIndex - i + 1;
						}
					}
					if (topView) {
						topScore = lineIndex;
					}

					//check bottom column
					let bottomView = true;
					let bottomScore = 1;
					for (let i = lineIndex; i < totalLines.length - 1; i++) {
						if (totalLines[i + 1][treeIndex] >= tree) {
							bottomView = false;
							bottomScore = i - lineIndex + 1;
						}
					}
					if (bottomView) {
						bottomScore = totalLines.length - lineIndex + 1;
					}

					if (leftView || rightView || topView || bottomView) {
						visibleTrees++;
					}
					const currentScore = leftScore * rightScore * topScore * bottomScore;

					if (currentScore > highScore) {
						highScore = currentScore;
					}
				}
			}
		});
	});

	console.log(visibleTrees);
	console.log(highScore);
}
start();
