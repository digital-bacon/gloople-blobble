const INITIAL_WAVE_GLOOPS = 1;
const INITIAL_WAVE = 0;
const INITIAL_GAME_STATUS = "initial";
const INITIAL_PLAYER_HP = 10;
const INITIAL_GOLD_STASH_TOTAL = 0;
const INITIAL_TOWER_LEVEL = 1;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameStatusTypes = getGameStatusTypes();
const towerLocations = getTowerLocations();
const waypoints = getWayPoints();
const canvas = getCanvasProperties(gameCanvas);
const screenCenter = getScreenCenter();

const ui = new UserInterface();
const game = new Game();
const goldStash = new GoldStash();
const player = new Player();

let circles = [];
let towers = [];
let fillText = [];
let gloops = [];
let projectiles = [];
let rects = [];
let roundRects = [];

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
	attackDamage: 100,
	upgradeCost: 100,
	level: INITIAL_TOWER_LEVEL,
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
	totalGloopsMultiplier: 0.25,
	_totalGloops: INITIAL_WAVE_GLOOPS,
	get totalGloops() {
		const total = Math.floor(
			this._totalGloops + (this.currentWave - 1) * this.totalGloopsMultiplier
		);
		return total;
	},
};

const xOffset = Math.round(screenCenter.x - canvas.center.x); // because the canvas is centered
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

const clearTowerButtons = () => {
	towers.forEach((tower) => (tower.button = []));
};

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
		if (ui.buttons.nextWave.evalAvailable()) {
			const config = ui.buttons.nextWave.drawing.shape;
			const drawing = generateDrawing("Circle", config);
			circles.push(drawing);
		}
	}
};

const populateFillText = () => {
	const elements = [
		ui.messages.goldStash,
		ui.messages.playerHP,
		ui.buttons.start,
		ui.messages.gameOver,
		ui.buttons.playAgain,
	];

	fillText = [];
	if (fillText.length === 0) {
		elements.forEach((element) => {
			if (element.evalAvailable()) {
				const config = element.drawing.text;
				const drawing = generateDrawing("FillText", config);
				fillText.push(drawing);
			}
		});
	}
};

const populateRoundRects = () => {
	const elements = [ui.buttons.start, ui.buttons.playAgain];

	roundRects = [];
	if (roundRects.length === 0) {
		elements.forEach((element) => {
			if (element.evalAvailable()) {
				const config = element.drawing.shape;
				const drawing = generateDrawing("RoundRect", config);
				roundRects.push(drawing);
			}
		});
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
startEventListeners();
