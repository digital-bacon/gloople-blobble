class UserInterface {
	constructor() {
		return {
			buttons: {
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
							fillStyle: "gem",
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
							fillStyle: "black",
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
							text: "Build⛏️Tower",
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
				"superpower-acidrain": {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							id: "superpower-acidrain",
							img: null,
							src: "static/button_superpower_acidrain.png",
							onCooldown: {
								img: null,
								src: "static/button_superpower_acidrain_off.png",
							},
							x: canvas.center.x - 100 - 50 - 10,
							y: canvas.height - 104 - 10,
							width: 100,
							height: 104,
						},
					},
				},
				"superpower-fireball": {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							img: null,
							src: "static/button_superpower_fireball.png",
							onCooldown: {
								img: null,
								src: "static/button_superpower_fireball_off.png",
							},
							id: "superpower-fireball",
							x: canvas.center.x - 50,
							y: canvas.height - 104 - 10,
							width: 100,
							height: 104,
						},
					},
				},
				"superpower-stones": {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							img: null,
							src: "static/button_superpower_stones.png",
							onCooldown: {
								img: null,
								src: "static/button_superpower_stones_off.png",
							},
							id: "superpower-stones",
							x: canvas.center.x + 50 + 10,
							y: canvas.height - 104 - 10,
							width: 100,
							height: 104,
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
							fillStyle: "#D85678",
							font: "bold 48px sans-serif",
							text: "THE GL😈😈PS ATE YOUR FACE!!",
							textAlign: "center",
							maxWidth: canvas.width - 4,
						},
					},
				},
			},
			playerStatus: {
				background: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						image: {
							img: null,
							src: "static/button_long_bg.png",
							id: "ui-player-bg",
							x: -80,
							y: -45,
							width: 326,
							height: 175,
						},
					},
				},
				buttonNextWaveBg: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							img: null,
							src: "static/ui_player_next_wave_icon.png",
							id: "ui-player-next-wave-bg",
							x: 10,
							y: 5,
							width: 46 * 0.9,
							height: 37 * 0.9,
						},
					},
				},
				buttonNextWaveText: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						text: {
							x: 65,
							y: 30,
							fillStyle: "#d8d8d8",
							font: "bold 24px 'Trebuchet MS', sans-serif",
							text: "Next Wave",
							textAlign: "left",
							maxWidth: 125,
						},
					},
				},
				gemStashIcon: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						image: {
							img: null,
							src: "static/ui_player_gem_stash_icon.png",
							id: "ui-player-gem-stash-icon",
							x: 15,
							y: 44,
							width: 51 * 0.6,
							height: 40 * 0.6,
						},
					},
				},
				gemStashText: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						text: {
							x: 65,
							y: 62,
							fillStyle: "#1bea00",
							font: "bold 24px 'Trebuchet MS', sans-serif",
							textAlign: "left",
							maxWidth: canvas.width - 4,
							get text() {
								return gemStash.total.toString();
							},
						},
					},
				},
				playerHPIcon: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						image: {
							img: null,
							src: "static/ui_player_hp_icon.png",
							id: "ui-player-hp-icon",
							x: 15,
							y: 72,
							width: 37 * 0.8,
							height: 33 * 0.8,
						},
					},
				},
				playerHPText: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						text: {
							x: 65,
							y: 68 + 24,
							fillStyle: "#f96a63",
							font: "bold 24px 'Trebuchet MS', sans-serif",
							textAlign: "left",
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
