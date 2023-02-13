class UserInterface {
	constructor() {
		return {
			buttons: {
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
			},
			gameOverScreen: {
				background: {
					evalAvailable: function () {
						return game.status === "gameover";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/ui_game_over_bg.png",
							id: "ui-game-over-bg",
							x: canvas.center.x - 526 / 2,
							y: canvas.center.y - 643 / 2,
							width: 526,
							height: 643,
						},
					},
				},
				playAgainButton: {
					evalAvailable: function () {
						return game.status === "gameover";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/ui_play_again_button.png",
							id: "ui-play-again-button",
							x: canvas.center.x - 185 / 2,
							y: canvas.center.y + 164,
							width: 185,
							height: 176,
						},
					},
				},
			},
			superPowers: {
				acidRain: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							active: true,
							id: "superpower-acidRain",
							img: null,
							src: "static/button_superpower_acidrain.png",
							onCooldown: {
								active: false,
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
				fireBall: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/button_superpower_fireball.png",
							onCooldown: {
								active: false,
								img: null,
								src: "static/button_superpower_fireball_off.png",
							},
							id: "superpower-fireBall",
							x: canvas.center.x - 50,
							y: canvas.height - 104 - 10,
							width: 100,
							height: 104,
						},
					},
				},
				stones: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/button_superpower_stones.png",
							onCooldown: {
								active: false,
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
			playerStatus: {
				background: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/button_long_bg.png",
							id: "ui-player-bg",
							x: -120,
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
							active: true,
							img: null,
							src: "static/ui_next_wave_button.png",
							id: "ui-player-next-wave-bg",
							x: 10,
							y: 275,
							width: 188 * 0.5,
							height: 137 * 0.5,
						},
					},
				},
				buttonNextWaveTimerText: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						text: {
							x: 110,
							y: 321,
							id: "next-wave-timer-text",
							fillStyle: "orange",
							font: "bold 36px 'Trebuchet MS', sans-serif",
							get text() {
								return Math.floor(
									convertMillisecondsToSeconds(
										configWave.getMillisecondsUntilNextWave()
									)
								);
							},
							textAlign: "left",
							maxWidth: 125,
						},
					},
				},
				waveCountText: {
					evalAvailable: function () {
						return game.status === "active" || game.status === "gameover";
					},
					drawing: {
						text: {
							x: 20,
							y: 33,
							id: "wave-count-text",
							fillStyle: "#d8d8d8",
							font: "bold 32px 'Trebuchet MS', sans-serif",
							get text() {
								return `WAVE ${configWave.currentWave.toString()}`;
							},
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
							active: true,
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
							id: "gem-stash-text",
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
							active: true,
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
							id: "player-hp-text",
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
			splashScreen: {
				logo: {
					evalAvailable: function () {
						return game.status === "initial";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/gloople_blobble_logo.png",
							id: "gloople-blobble-logo",
							x: 165,
							y: 80,
							width: 1563 * 0.6,
							height: 597 * 0.6,
						},
					},
				},
				playButton: {
					evalAvailable: function () {
						return game.status === "initial";
					},
					drawing: {
						image: {
							active: true,
							img: null,
							src: "static/ui_play_button.png",
							id: "ui-play-button",
							x: 539,
							y: 430,
							width: 346 * 0.6,
							height: 341 * 0.6,
						},
					},
				},
			},
			towers: {
				buttonBuildMeteor: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							towerId: null,
							active: false,
							img: null,
							src: "static/ui_build_meteor_tower_button.png",
							id: "ui-build-meteor-tower-button",
							x: canvas.center.x,
							y: canvas.center.y,
							width: 300 * 0.7,
							height: 137 * 0.7,
						},
					},
				},
				buttonBuildQuake: {
					evalAvailable: function () {
						return game.status === "active";
					},
					drawing: {
						image: {
							towerId: null,
							active: false,
							img: null,
							src: "static/ui_build_quake_tower_button.png",
							id: "ui-build-quake-tower-button",
							x: canvas.center.x - 150,
							y: canvas.center.y - 150,
							width: 300 * 0.7,
							height: 137 * 0.7,
						},
					},
				},
			},
		};
	}
}
