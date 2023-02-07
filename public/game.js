const INITIAL_WAVE_GLOOPS = 10;
const INITIAL_WAVE = 0;
const INITIAL_GAME_STATUS = "initial";
const INITIAL_PLAYER_HP = 10;
const INITIAL_GOLD_STASH_TOTAL = 0;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameStatusTypes = ["initial", "active", "gameover"];

const towerLocations = [
	{ x: 135, y: 135 },
	{ x: 275, y: 150 },
	{ x: 410, y: 210 },
];

const waypoints = [
	{ x: 0, y: 217 },
	{ x: 95, y: 215 },
	{ x: 98, y: 97 },
	{ x: 224, y: 103 },
	{ x: 219, y: 254 },
	{ x: 381, y: 254 },
	{ x: 382, y: 181 },
	{ x: 667, y: 176 },
];

const circles = [];
const towers = [];
let fillText = [];
let gloops = [];
let projectiles = [];
let rects = [];
let roundRects = [];

const canvas = {
	width: gameCanvas.width,
	height: gameCanvas.height,
};

const canvasCenter = {
	x: gameCanvas.width / 2,
	y: gameCanvas.height / 2,
};

const screenCenter = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
};

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
	radius: 15,
	fillColor: "black",
	strokeColor: "yellow",
	waypointIndex: 0,
	wave: 0,
	_gold: 10,
	get gold() {
		return this._gold;
	},
	set gold(value) {
		if (value < 0) {
			return (this._gold = 0);
		}
		this._gold = value;
	},
	get hp() {
		return this._hp;
	},
	set hp(value) {
		if (value < 0) {
			return (this._hp = 0);
		}
		this._hp = value;
	},
	get speed() {
		return this._speed;
	},
	set speed(value) {
		if (value < 0) {
			return (this._speed = 0);
		}
		this._speed = value;
	},
};

const configTower = {
	ctx,
	x: 135,
	y: 135,
	width: 50,
	height: 50,
	fillColor: "transparent",
	strokeColor: "cyan",
	towersIndex: towers.length,
	attackRadius: 60,
	attacksMultiple: false,
	showRange: true,
	projectileSize: 10,
};

const configWave = {
	currentWave: INITIAL_WAVE,
	earlyBonus: 100,
	goldMultiplier: 2,
	hpDefault: 5,
	hpMultiplier: 1.025,
	nextWave: INITIAL_WAVE + 1,
	speedDefault: 1,
	speedMultiplier: 0.2,
	totalGloops: INITIAL_WAVE_GLOOPS,
	totalGloopsMultiplier: 0.5,
};

const goldStash = {
	total: INITIAL_GOLD_STASH_TOTAL,
	drawing: {
		x: 25,
		y: 64,
		fillStyle: "gold",
		font: "bold 16px sans-serif",
		textAlign: "center",
		get text() {
			return goldStash.total.toString();
		},
	},
	setTotal(amount) {
		if (amount < 0) {
			return (this.total = 0);
		}
		this.total = this.convertToWhole(amount);
	},
	deposit(amount) {
		this.total += this.convertToWhole(amount);
	},
	withdraw(amount) {
		this.total -= this.convertToWhole(amount);
	},
	convertToWhole(amount) {
		return Math.floor(amount);
	},
};

const player = {
	_hp: INITIAL_PLAYER_HP,
	get hp() {
		return this._hp;
	},
	set hp(value) {
		this._hp = value;
		if (this._hp <= 0) {
			return game.setStatus("gameover");
		}
	},
	drawing: {
		x: goldStash.drawing.x,
		y: goldStash.drawing.y + 18,
		fillStyle: "#aaf0d1",
		font: goldStash.drawing.font,
		textAlign: goldStash.drawing.textAlign,
		get text() {
			return player.hp.toString();
		},
	},
	setHP(amount) {
		if (amount < 0) {
			return (this.hp = 0);
		}
		this.hp = this.convertToWhole(amount);
	},
	gainHP(amount) {
		this.hp += this.convertToWhole(amount);
	},
	loseHP(amount) {
		this.hp -= this.convertToWhole(amount);
	},
	convertToWhole(amount) {
		return Math.floor(amount);
	},
};

const game = {
	status: INITIAL_GAME_STATUS,
	setStatus(status) {
		const match = gameStatusTypes.filter((gameType) => gameType === status);
		if (match.length === 0) {
			console.log(status, "is not a valid game status😡😡😡");
			return;
		}
		this.status = status;
		if (this.status === "gameover") {
			gloops = [];
			towers.forEach((tower) => (tower.target = null));
		}
		if (this.status === "active") {
			this.reset();
		}
	},

	reset() {
		configWave.currentWave = INITIAL_WAVE;
		configWave.nextWave = INITIAL_WAVE + 1;
		goldStash.setTotal(INITIAL_GOLD_STASH_TOTAL);
		player.setHP(INITIAL_PLAYER_HP);
		gloops = [];
		projectiles = [];
		towers.forEach((tower) => (tower.target = null));
	},
};

const ui = {
	buttons: {
		nextWave: {
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
			drawing: {
				shape: {
					id: "start-game",
					x: canvasCenter.x - 160,
					y: canvasCenter.y - 25,
					width: 320,
					height: 50,
					radii: 10,
					strokeStyle: "green",
					fillStyle: "pink",
				},
				text: {
					x: canvasCenter.x,
					y: canvasCenter.y + 9,
					fillStyle: "black",
					font: "bold 24px sans-serif",
					text: "UNLEASH THE GLOOPS!",
					textAlign: "center",
				},
			},
		},
		playAgain: {
			drawing: {
				shape: {
					id: "play-again",
					x: canvasCenter.x - 55,
					y: canvasCenter.y + 4,
					width: 110,
					height: 40,
					radii: 10,
					strokeStyle: "green",
					fillStyle: "blue",
				},
				text: {
					x: canvasCenter.x,
					y: canvasCenter.y + 30,
					fillStyle: "gold",
					font: "bold 16px sans-serif",
					text: "Play Again!",
					textAlign: "center",
				},
			},
		},
	},
	messages: {
		gameOver: {
			drawing: {
				x: canvasCenter.x,
				y: canvasCenter.y - 30,
				fillStyle: "maroon",
				font: "bold 24px sans-serif",
				text: "THE GL😈😈PS ATE YOUR FACE!!",
				textAlign: "center",
			},
		},
	},
};

const xOffset = Math.round(screenCenter.x - canvasCenter.x); // because the canvas is centered
const yOffset = 0; // because the canvas is at the top of the page

// Uncomment this block to enable waypoint building in the console.
const trackedArray = [];
document.onclick = (event) => {
	trackedArray.push(getMousePosition(event));
	// console.log(JSON.stringify(trackedArray));
};

const cleanupGloops = () => {
	const survivingGloops = gloops.filter((gloop) => gloop.destroyMe === false);
	gloops = [...survivingGloops];
};

const cleanupProjectiles = () => {
	const activeProjectiles = projectiles.filter(
		(projectile) => projectile.destroyMe === false
	);
	projectiles = [...activeProjectiles];
};

const summonGloop = (configGloop) => {
	const newGloop = new Gloop(configGloop);
	gloops.push(newGloop);
};

const summonGloops = (configSummon) => {
	const { totalGloops, configGloop, xOffset, wave } = configSummon;
	const newGloops = [];
	for (let i = 0; i < totalGloops; i++) {
		const gloop = { ...configGloop };
		gloop.wave = wave;
		newGloops.push(gloop);
	}
	let totalOffset = 0;
	newGloops.forEach((gloop) => {
		gloop.x = gloop.x - totalOffset;
		summonGloop(gloop);
		totalOffset += xOffset;
	});
};

const summonTower = (configTower) => {
	const newTower = new Tower(configTower);
	towers.push(newTower);
};

const summonTowers = (configSummon) => {
	const { configTower, towerLocations } = configSummon;
	const newTowers = [];
	for (let i = 0; i < towerLocations.length; i++) {
		const tower = { ...configTower };
		tower.x = towerLocations[i].x;
		tower.y = towerLocations[i].y;
		if (i === 1) {
			tower.attackRadius = 90;
		}
		newTowers.push(tower);
	}
	newTowers.forEach((tower) => {
		summonTower(tower);
	});
};

gameCanvas.addEventListener("click", (event) => {
	const mousePosition = getMousePosition(event);
	circles.forEach((circle) => {
		if (isIntersectingCircle(mousePosition, circle)) {
			const currentWaveGloops = gloops.filter(gloop => gloop.wave === configWave.currentWave);
			const countGloops = currentWaveGloops.length;
			if (countGloops > 0) {
				const totalReward = configWave.earlyBonus * countGloops;
				goldStash.deposit(totalReward)
			}
			nextWave();
		}
	});

	roundRects.forEach((roundRect) => {
		if (isIntersectingRect(mousePosition, roundRect)) {
			if (roundRect.id === "start-game") {
				game.setStatus("active");
			}
			if (roundRect.id === "play-again") {
				game.setStatus("initial")
			}
		}
	});
});

const nextWave = () => {
	if (configWave.nextWave > 1) {
		configGloop.speed =
			configWave.speedDefault +
			configWave.currentWave * configWave.speedMultiplier;
		configGloop.hp =
			configWave.hpDefault + configWave.currentWave * configWave.hpMultiplier;
		configGloop.gold =
			configGloop.gold + configWave.currentWave * configWave.goldMultiplier;
	} else {
		configGloop.speed = configWave.speedDefault;
		configGloop.hp = configWave.hpDefault;
	}
	configWave.currentWave = configWave.nextWave;
	configWave.nextWave++;
	const configSummon = {
		configGloop,
		totalGloops: configWave.totalGloops,
		xOffset: 40,
		wave: configWave.currentWave,
	};

	summonGloops(configSummon);
};

const isWaveClear = (waveNumber) => {
	const matched = gloops.filter((gloop) => gloop.wave === waveNumber);
	return matched.length === 0;
};

const populateCircles = () => {
	if (circles.length === 0) {
		const nextWaveButton = generateDrawing(
			"Circle",
			ui.buttons.nextWave.drawing.shape
		);
		circles.push(nextWaveButton);
	}
};

const populateFillText = () => {
	fillText = [];
	if (fillText.length === 0) {
		if (game.status !== "initial") {
			const drawingGoldStashText = generateDrawing(
				"FillText",
				goldStash.drawing
			);
			fillText.push(drawingGoldStashText);

			const drawingPlayerHPText = generateDrawing("FillText", player.drawing);
			fillText.push(drawingPlayerHPText);
		}

		if (game.status === "initial") {
			const drawingStartButtonText = generateDrawing(
				"FillText",
				ui.buttons.start.drawing.text
			);
			fillText.push(drawingStartButtonText);
		}

		if (game.status === "gameover") {
			const drawingGameOverText = generateDrawing(
				"FillText",
				ui.messages.gameOver.drawing
			);
			fillText.push(drawingGameOverText);

			const drawingPlayAgainButtonText = generateDrawing(
				"FillText",
				ui.buttons.playAgain.drawing.text
			);
			fillText.push(drawingPlayAgainButtonText);
		}
	}
};

const populateRoundRects = () => {
	roundRects = [];
	if (roundRects.length === 0) {
		if (game.status === "initial") {
			const drawingStartButton = generateDrawing(
				"RoundRect",
				ui.buttons.start.drawing.shape
			);
			roundRects.push(drawingStartButton);
		}

		if (game.status === "gameover") {
			const drawingPlayAgainButton = generateDrawing(
				"RoundRect",
				ui.buttons.playAgain.drawing.shape
			);
			roundRects.push(drawingPlayAgainButton);
		}
	}
};

const populateTowers = () => {
	if (towers.length === 0) {
		const configSummon = {
			configTower,
			towerLocations,
		};
		summonTowers(configSummon);
	}
};

const populateGloops = () => {
	if (gloops.length === 0 || isWaveClear(configWave.currentWave)) {
		nextWave();
	}
};

const animationLoop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	populateCircles();
	populateFillText();
	populateGloops();
	populateRoundRects();
	populateTowers();

	requestAnimationFrame(animationLoop);

	if (game.status === "initial") {
		update(roundRects);
		update(fillText);
	}

	if (game.status === "active") {
		update(towers);
		update(circles);
		update(gloops);
		update(projectiles);
		update(fillText);
	}

	if (game.status === "gameover") {
		render(towers);
		render(projectiles);
		render(roundRects);
		render(fillText);
	}

	cleanupGloops();
	cleanupProjectiles();
};

animationLoop();
