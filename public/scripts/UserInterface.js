class UserInterface {
	constructor() {
		return {
			buttons: {
				nextWave: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						shape: {
							x: 25,
							y: 25,
							radius: 20,
							fillColor: "#5f464b",
							strokeColor: "rgba(0, 0, 0, 0)",
						},
						text: {
							x: 25,
							y: 30,
							fillStyle: "#c2fbef",
							font: "bold 14px sans-serif",
							text: "Next",
							textAlign: "center",
							maxWidth: 40,
						},
					},
				},
				start: {
					evalAvailable: function () {
						return game.status === "initial";
					},
					drawing: {
						shape: {
							id: "start-game",
							x: canvas.center.x - 160,
							y: canvas.center.y - 25,
							width: 320,
							height: 50,
							radii: 10,
							strokeStyle: "green",
							fillStyle: "pink",
						},
						text: {
							x: canvas.center.x,
							y: canvas.center.y + 9,
							fillStyle: "black",
							font: "bold 24px sans-serif",
							text: "UNLEASH THE GLOOPS!",
							textAlign: "center",
							maxWidth: 316,
						},
					},
				},
				playAgain: {
					evalAvailable: function () {
						return game.status === "gameover";
					},
					drawing: {
						shape: {
							id: "play-again",
							x: canvas.center.x - 55,
							y: canvas.center.y + 4,
							width: 110,
							height: 40,
							radii: 10,
							strokeStyle: "green",
							fillStyle: "blue",
						},
						text: {
							x: canvas.center.x,
							y: canvas.center.y + 30,
							fillStyle: "gold",
							font: "bold 16px sans-serif",
							text: "Play Again!",
							textAlign: "center",
							maxWidth: 106,
						},
					},
				},
				towerBuild: {
					evalAvailable: function () {
						return game.status === "active";
					},
					activeId: null,
					drawing: {
						shape: {
							id: "tower-build",
							x: 245,
							y: 150,
							width: 110,
							height: 40,
							radii: 10,
							strokeStyle: "orange",
							fillStyle: "#f06449",
						},
						text: {
							x: 245 + 55,
							y: 150 + 25,
							fillStyle: "black",
							font: {
								weight: "bold",
								size: "14",
								family: "sans-serif",
							},
							text: "Build⛏️🪚Tower",
							textAlign: "center",
							maxWidth: 106,
						},
					},
				},
				towerUpgrade: {
					evalAvailable: function () {
						return game.status === "active";
					},
					activeId: null,
					drawing: {
						shape: {
							id: "tower-upgrade",
							x: 0,
							y: 200,
							width: 110,
							height: 40,
							radii: 10,
							strokeStyle: "red",
							fillStyle: "black",
						},
						text: {
							x: 0,
							y: 200 + 10,
							fillStyle: "black",
							font: {
								weight: "bold",
								size: "14",
								family: "sans-serif",
							},
							text: "LVL.?? 💰???????",
							textAlign: "center",
							maxWidth: 106,
						},
					},
				},
			},
			messages: {
				gameOver: {
					evalAvailable: function () {
						return game.status === "gameover";
					},
					drawing: {
						text: {
							x: canvas.center.x,
							y: canvas.center.y - 30,
							fillStyle: "maroon",
							font: "bold 24px sans-serif",
							text: "THE GL😈😈PS ATE YOUR FACE!!",
							textAlign: "center",
							maxWidth: canvas.width - 4,
						},
					},
				},
				goldStash: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						text: {
							x: 25,
							y: 64,
							fillStyle: "gold",
							font: "bold 16px sans-serif",
							textAlign: "center",
							maxWidth: canvas.width - 4,
							get text() {
								return goldStash.total.toString();
							},
						},
					},
				},
				playerHP: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						text: {
							x: 25,
							y: 64 + 18,
							fillStyle: "#aaf0d1",
							font: "bold 16px sans-serif",
							textAlign: "center",
							maxWidth: canvas.width - 4,
							get text() {
								return player.hp.toString();
							},
						},
					},
				},
			},
		};
	}
}
