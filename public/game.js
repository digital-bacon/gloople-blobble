const INITIAL_WAVE_GLOOPS = 1;
const INITIAL_WAVE = 0;
const INITIAL_GAME_STATUS = "active";
const INITIAL_PLAYER_HP = 10;
const INITIAL_GOLD_STASH_TOTAL = 5000;
const INITIAL_TOWER_LEVEL = 1;
const TOWER_LOCATION_SIZE = 160;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameStatusTypes = getGameStatusTypes();
const towerLocations = getTowerLocations(TOWER_LOCATION_SIZE);
const waypoints = getWayPoints();
const canvas = getCanvasProperties(gameCanvas);
const screenCenter = getScreenCenter();

const ui = new UserInterface();
const game = new Game();
const goldStash = new GoldStash();
const player = new Player();

let circles = [];
let fillText = [];
let gloops = [];
let images = [];
let locations = [];
let projectiles = [];
let rects = [];
let roundRects = [];
let towers = [];

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
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

const imgGloopBob = new Image();
imgGloopBob.src = "static/spritesheet_bob.png";

const configGloopBob = {
	baseConfig: configGloop,
	img: imgGloopBob,
	width: 192,
	height: 70,
	spritesheetReverse: true,
	animationSpeedInMilliseconds: 100,
};

const imgGloopSam = new Image();
imgGloopSam.src = "static/spritesheet_sam.png";

const configGloopSam = {
	baseConfig: configGloop,
	img: imgGloopSam,
	width: 175,
	height: 70,
	spritesheetReverse: true,
};

const configTower = {
	ctx,
	x: 135,
	y: 135,
	towersIndex: towers.length,
	attackRadius: 100,
	attacksMultiple: false,
	showRange: true,
	projectileSize: 10,
	attackDamage: 100,
	attackSpeedInMilliseconds: 1000,
	purchaseCost: 50,
	upgradeCost: 100,
	level: INITIAL_TOWER_LEVEL,
};

const imgTowerMagic = new Image();
imgTowerMagic.src = "static/tower_magic.png";

const configTowerMagic = {
	baseConfig: configTower,
	img: imgTowerMagic,
	width: TOWER_LOCATION_SIZE,
	height: TOWER_LOCATION_SIZE,
};

const imgTowerSplash = new Image();
imgTowerSplash.src = "static/tower_splash.png";

const configTowerSplash = {
	baseConfig: configTower,
	img: imgTowerSplash,
	width: TOWER_LOCATION_SIZE,
	height: TOWER_LOCATION_SIZE,
	attacksMultiple: true,
};

const towerTypes = [];
towerTypes.push(configTowerMagic);
// towerTypes.push(configTowerSplash);

const configTowerLocation = {
	ctx,
	towerTypes,
	x: 0,
	y: 0,
	width: TOWER_LOCATION_SIZE,
	height: TOWER_LOCATION_SIZE,
	fillColor: "transparent",
	strokeColor: "yellow",
};

const configWave = {
	currentWave: INITIAL_WAVE,
	earlyBonus: 100,
	goldMultiplier: 2,
	hpDefault: 50,
	hpMultiplier: 1.025,
	nextWave: INITIAL_WAVE + 1,
	speedDefault: 1,
	speedMultiplier: 0.2,
	totalGloopsMultiplier: 0.25,
	gloopSubSpecies: configGloopSam,
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

const cleanupTowerLocations = () => {
	const survivingLocations = locations.filter(
		(location) => location.destroyMe === false
	);
	locations = [...survivingLocations];
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
	const configSubSpecies = { ...configWave.gloopSubSpecies };
	for (let i = 0; i < totalGloops; i++) {
		const gloop = { ...configGloop, ...configSubSpecies };
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
	return newTower;
};

const summonTowers = (configSummon) => {
	const { configTower, configTowerType, towerLocations } = configSummon;
	const newTowers = [];
	for (let i = 0; i < towerLocations.length; i++) {
		const tower = { ...configTower, ...configTowerType };
		tower.x = towerLocations[i].x;
		tower.y = towerLocations[i].y;
		newTowers.push(tower);
	}
	newTowers.forEach((tower) => {
		summonTower(tower);
	});
};

const generateTowerLocation = (configLocation) => {
	const newLocation = new TowerLocation(configLocation);
	locations.push(newLocation);
};

const generateTowerLocations = (configGenerate) => {
	const { configTowerLocation, configTowerTypes, towerLocations } =
		configGenerate;
	const newLocations = [];
	for (let i = 0; i < towerLocations.length; i++) {
		const location = { ...configTowerLocation };
		location.towerTypes = configTowerTypes;
		location.x = towerLocations[i].x;
		location.y = towerLocations[i].y;
		location.id = towerLocations[i].id;
		newLocations.push(location);
	}
	newLocations.forEach((location) => {
		generateTowerLocation(location);
	});
};

const clearBuildButtons = () => {
	locations.forEach((location) => {
		location.button = [];
		ui.buttons.towerBuild.activeId = null;
	});
};

const clearTowerButtons = () => {
	towers.forEach((tower) => {
		tower.button = [];
		ui.buttons.towerUpgrade.activeId = null;
	});
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

const populateImages = () => {
	if (images.length === 0) {
		const img = new Image();
		img.src = "static/gloop.png";
		const config = {
			x: 200,
			y: 200,
			img: img,
			width: 30,
			height: 30,
		};
		const drawing = generateDrawing("Image", config);
		images.push(drawing);
	}
};

const populateFillText = () => {
	const elements = [
		ui.messages.goldStash,
		ui.messages.playerHP,
		ui.buttons.start,
		ui.messages.gameOver,
		ui.buttons.playAgain,
		ui.buttons.nextWave,
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

const populateTowers = (configTowerType) => {
	if (towers.length === 0) {
		const initialTowers = towerLocations.filter(
			(location) => location.id === 2
		);
		const configSummon = {
			configTower,
			configTowerType,
			towerLocations: initialTowers,
		};
		summonTowers(configSummon);
	}
};

const populateTowerLocations = (configTowerTypes) => {
	if (locations.length === 0) {
		const initialLocations = towerLocations.filter(
			(location) => location.id !== 2
		);
		const configGenerate = {
			configTowerLocation,
			configTower,
			configTowerTypes,
			towerLocations: initialLocations,
		};
		generateTowerLocations(configGenerate);
	}
};

const populateGloops = (configSubSpecies) => {
	if (gloops.length === 0 || isWaveClear(configWave.currentWave)) {
		nextWave(configSubSpecies);
	}
};

const animationLoop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	populateCircles();
	populateFillText();
	populateGloops(configGloopBob);
	populateRoundRects();
	populateTowers(configTowerMagic);
	populateTowerLocations(towerTypes);
	populateImages();

	if (game.status === "initial") {
		update(roundRects);
		update(fillText);
	}

	if (game.status === "active") {
		update(towers);
		update(locations);
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

	requestAnimationFrame(animationLoop);

	cleanupGloops();
	cleanupTowerLocations();
	cleanupProjectiles();
};

animationLoop();
startEventListeners();
