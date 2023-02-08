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
							fillColor: "cyan",
							strokeColor: "rgba(0, 0, 0, 0)",
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
								size: "16",
								family: "sans-serif",
							},
							text: "Upgrade!",
							textAlign: "center",
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
