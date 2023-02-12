const INITIAL_WAVE_GLOOPS = 1;
const INITIAL_WAVE = 0;
const INITIAL_GAME_STATUS = "active";
const INITIAL_PLAYER_HP = 10;
const INITIAL_GOLD_STASH_TOTAL = 5000;
const INITIAL_TOWER_LEVEL = 1;
const TOWER_SIZE = { width: 160, height: 160 };
const TOWER_LOCATION_SIZE = { width: 160, height: 70 };

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

const gloopSubSpecies = [];
let circles = [];
let fillText = [];
let gloops = [];
let images = [];
let locations = [];
let projectiles = [];
let rects = [];
let roundRects = [];
let staticObjects = [];
let superPowers = [];
let towers = [];
let uiElements = [];

const configWave = {
	gloopSubSpecies,
	currentWave: INITIAL_WAVE,
	earlyBonus: 100,
	goldMultiplier: 2,
	hpDefault: 50,
	goldDefault: 10,
	hpMultiplier: 1.025,
	nextWave: INITIAL_WAVE + 1,
	gloops: {
		default: {
			hp: 50,
			speed: 1,
			gold: 10,
		},
		multipliers: {
			speed: {
				current: 1,
				initial: 1,
				max: 2.5,
				step: 0.1,
			},
		},
	},
	speedMultiplierStep: 0.1,
	speedMultiplierInitial: 1,
	speedMultiplierCurrent: 1,
	speedMultiplierMax: 2.5,
	totalGloopsMultiplier: 0.25,
	_totalGloops: INITIAL_WAVE_GLOOPS,
	get totalGloops() {
		const total = Math.floor(
			this._totalGloops + (this.currentWave - 1) * this.totalGloopsMultiplier
		);
		return total;
	},
	setSpeedMultiplier: function () {
		if (this.currentWave > 0) {
			this.gloops.multipliers.speed.current =
				this.gloops.multipliers.speed.step +
				this.gloops.multipliers.speed.current;
		}

		if (
			this.gloops.multipliers.speed.current > this.gloops.multipliers.speed.max
		) {
			this.gloops.multipliers.speed.current = this.gloops.multipliers.speed.max;
		}
	},
	setHPMultiplier: function () {
		if (this.currentWave > 0) {
			this.hpMultiplierCurrent =
				this.hpMultiplierStep + this.hpMultiplierCurrent;
		}

		if (this.hpMultiplierCurrent > this.hpMultiplierMax) {
			this.hpMultiplierCurrent = this.hpMultiplierMax;
		}
	},
};

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
	waypointIndex: 0,
	wave: 0,
	immobile: false,
	targettable: true,
	gold: configWave.goldDefault,
	hp: configWave.hpDefault,
	hpMultiplier: configWave.hpMultiplierInitial,
	speed: configWave.gloops.default.speed,
	speedMultiplier: configWave.gloops.multipliers.speed.initial,
};

const imgIdleFranklin = new Image();
const imgGloopBob = new Image();
const imgGloopSam = new Image();
const imgGloopSmooch = new Image();
const imgGloopTom = new Image();
imgIdleFranklin.src = "static/spritesheet_franklin.png";
imgGloopBob.src = "static/spritesheet_bob.png";
imgGloopSam.src = "static/spritesheet_sam.png";
imgGloopSmooch.src = "static/spritesheet_smooch.png";
imgGloopTom.src = "static/spritesheet_tom.png";

const configGloopFranklin = {
	img: imgIdleFranklin,
	width: 144.165,
	height: 55,
	x: 430,
	y: 600,
	immobile: true,
	targettable: false,
	totalFrames: 50,
	animationSpeedInMilliseconds: 500,
};

const configGloopBob = {
	img: imgGloopBob,
	width: 192,
	height: 70,
	totalFrames: 19,
	animationSpeedInMilliseconds: 250,
	speedMultiplier: 1.5,
};

const configGloopSam = {
	img: imgGloopSam,
	width: 175,
	height: 70,
	spritesheetReverse: true,
};

const configGloopSmooch = {
	img: imgGloopSmooch,
	width: 67,
	height: 70,
	spritesheetReverse: true,
	totalFrames: 18,
};

const configGloopTom = {
	img: imgGloopTom,
	width: 281,
	height: 100,
	spritesheetReverse: true,
	totalFrames: 40,
	animationSpeedInMilliseconds: 150,
	speedMultiplier: 0.5,
	hp: configWave.hpDefault * 5,
};

gloopSubSpecies.push(configGloopBob);
gloopSubSpecies.push(configGloopSam);
gloopSubSpecies.push(configGloopSmooch);
gloopSubSpecies.push(configGloopTom);

const configPlayer = {
	ctx,
	x: canvas.width,
	y: 0,
	hp: INITIAL_PLAYER_HP,
};

const player = new Player(configPlayer);
const superPowerTypes = player.superPowers;
superPowerTypes.forEach((superPowerType) => {
	const imgReady = new Image();
	const imgCooldown = new Image();
	const imageConfig =
		ui.buttons[`superpower-${superPowerType.type}`].drawing.image;
	imgReady.src = imageConfig.src;
	imgCooldown.src = imageConfig.onCooldown.src;
	imageConfig.img = imgReady;
	imageConfig.onCooldown.img = imgCooldown;
	const buttonSuperPower = new CanvasImage(imageConfig);
	uiElements.push(buttonSuperPower);
});

const configTower = {
	ctx,
	x: 135,
	y: 135,
	towersIndex: towers.length,
	attackRadius: 100,
	attacksMultiple: false,
	showRange: true,
	projectileSize: 10,
	attackDamage: 25,
	attackSpeedInMilliseconds: 1000,
	purchaseCost: 50,
	upgradeCost: 100,
	level: INITIAL_TOWER_LEVEL,
	width: TOWER_SIZE.width,
	height: TOWER_SIZE.height,
};

const imgTowerMagic = new Image();
imgTowerMagic.src = "static/tower_magic.png";

const configTowerMagic = {
	baseConfig: configTower,
	img: imgTowerMagic,
	type: "magic",
};

const imgTowerSplash = new Image();
imgTowerSplash.src = "static/tower_splash.png";

const configTowerSplash = {
	baseConfig: configTower,
	img: imgTowerSplash,
	attacksMultiple: true,
	type: "splash",
};

const towerTypes = [];
towerTypes.push(configTowerMagic);
towerTypes.push(configTowerSplash);

const configTowerLocation = {
	ctx,
	towerTypes,
	x: 0,
	y: 0,
	width: TOWER_LOCATION_SIZE.width,
	height: TOWER_LOCATION_SIZE.height,
	fillColor: "transparent",
	strokeColor: "yellow",
	// strokeColor: "transparent",
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

const cleanupSuperPowers = () => {
	const activeSuperPowers = superPowers.filter(
		(superPower) => superPower.destroyMe === false
	);
	superPowers = [...activeSuperPowers];
};

const summonGloop = (configGloop) => {
	const newGloop = new Gloop(configGloop);
	gloops.push(newGloop);
};

const summonGloops = (configSummon) => {
	const { totalGloops, configGloop, xOffset, wave } = configSummon;
	const newGloops = [];
	for (let i = 0; i < totalGloops; i++) {
		const configSubSpecies = randomFromArray(configWave.gloopSubSpecies);
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
		location.type = towerLocations[i].type; //tower type
		location.xTowerOffset = towerLocations[i].xTowerOffset;
		location.yTowerOffset = towerLocations[i].yTowerOffset;
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
	configWave.setSpeedMultiplier();
	if (configWave.nextWave > 1) {
		configGloop.speed =
			configWave.gloops.default.speed *
			configWave.gloops.multipliers.speed.current;
		configGloop.hp =
			configWave.hpDefault + configWave.currentWave * configWave.hpMultiplier;
		configGloop.gold =
			configGloop.gold + configWave.currentWave * configWave.goldMultiplier;
	} else {
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

// const populateImages = () => {
// 	if (images.length === 0) {
// 		const img = new Image();
// 		img.src = "static/gloop.png";
// 		const config = {
// 			x: 200,
// 			y: 200,
// 			img: img,
// 			width: 30,
// 			height: 30,
// 		};
// 		const drawing = generateDrawing("Image", config);
// 		images.push(drawing);
// 	}
// };

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
		const initialLocations = towerLocations;
		const configGenerate = {
			configTowerLocation,
			configTower,
			configTowerTypes,
			towerLocations: initialLocations,
		};
		generateTowerLocations(configGenerate);
	}
};

const populateStaticObjects = () => {
	if (staticObjects.length === 0) {
		const configGenerate = {
			...configGloop,
			...configGloopFranklin,
		};
		const newGloop = new Gloop(configGenerate);
		staticObjects.push(newGloop);
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
	// populateImages();
	populateRoundRects();
	populateStaticObjects();
	// populateTowers(configTowerMagic);
	populateTowerLocations(towerTypes);

	if (game.status === "initial") {
		update(roundRects);
		update(fillText);
	}

	if (game.status === "active") {
		update(staticObjects);
		update(superPowers);
		update(locations);
		update(circles);
		update(gloops);
		update(towers);
		update(projectiles);
		update(fillText);
		update(uiElements);
	}

	if (game.status === "gameover") {
		render(staticObjects);
		render(towers);
		render(projectiles);
		render(roundRects);
		render(fillText);
	}

	requestAnimationFrame(animationLoop);

	cleanupGloops();
	cleanupTowerLocations();
	cleanupProjectiles();
	cleanupSuperPowers();
};

animationLoop();
startEventListeners();
