const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameStatusTypes = [
	"initial",
	"active",
	"gameover",
];

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

const configNextWaveButton = {
	x: 25,
	y: 25,
	radius: 20,
	fillColor: "cyan",
	strokeColor: "rgba(0, 0, 0, 0)",
};

const configText = {
	x: 25,
	y: 64,
	fillStyle: "gold",
	font: "bold 16px sans-serif",
	text: "Hello World",
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
	speedDefault: 3,
	hpDefault: 3,
	currentWave: 0,
	nextWave: 1,
	speedMultiplier: 0.2,
	hpMultiplier: 1.025,
	goldMultiplier: 2,
};

const goldStash = {
	total: 0,
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
	hp: 10,
	setTotal(amount) {
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
	status: "initial",
	setStatus(status) {
		const match = gameStatusTypes.filter(gameType => gameType === status)
		if (match.length === 0) {
			console.log(status, "is not a valid game status😡😡😡")
			return;
		}
		this.status = status;
	},
	
	reset() {
		console.log("resetting")
		configWave.currentWave = 0;
		configWave.nextWave = 1;
	}
}

// console.log(player.hp);

const xOffset = Math.round(screenCenter.x - canvasCenter.x); // because the canvas is centered
const yOffset = 0; // because the canvas is at the top of the page

// Uncomment this block to enable waypoint building in the console.
const trackedArray = [];
document.onclick = (event) => {
	trackedArray.push(getMousePosition(event));
	console.log(JSON.stringify(trackedArray));
};

const getMousePosition = (event) => {
	const x = event.clientX - xOffset;
	const y = event.clientY;
	return { x, y };
};

const randomHex = () => (Math.random() * 0xfffff * 1000000).toString(16);

const colorFromHexString = (hexadecimalString) => {
	return "#" + hexadecimalString.slice(0, 6).toUpperCase();
};

const randomColor = () => colorFromHexString(randomHex());

const generateCircle = (configCircle) => {
	const newCircle = new Circle(configCircle);
	circles.push(newCircle);
};

const generateFillText = (configFillText) => {
	const newFillText = new FillText(configFillText);
	fillText.push(newFillText);
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

const isIntersectingCircle = (mousePoint, circle) => {
	return (
		Math.sqrt(
			(mousePoint.x - circle.position.x) ** 2 +
				(mousePoint.y - circle.position.y) ** 2
		) < circle.radius
	);
};

gameCanvas.addEventListener("click", (event) => {
	const mousePosition = getMousePosition(event);
	circles.forEach((circle) => {
		if (isIntersectingCircle(mousePosition, circle)) {
			nextWave();
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
		totalGloops: 1,
		xOffset: 40,
		wave: configWave.currentWave,
	};

	summonGloops(configSummon);
};

const isWaveClear = (waveNumber) => {
	const matched = gloops.filter((gloop) => gloop.wave === waveNumber);
	return matched.length === 0;
};

const loop = () => {
	//console.log(configWave.currentWave)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (circles.length === 0) {
		generateCircle(configNextWaveButton);
	}

	fillText = [];
	if (fillText.length === 0) {
		const configGoldStashText = { ...configText };
		configGoldStashText.text = goldStash.total.toString();
		configGoldStashText.textAlign = "center";
		configGoldStashText.x = 25;
		configGoldStashText.y = 64;
		configGoldStashText.fillStyle = "gold";
		configGoldStashText.font = "bold 16px sans-serif";
		generateFillText(configGoldStashText);

		const configPlayerHPText = { ...configText };
		configPlayerHPText.textAlign = configGoldStashText.textAlign;
		configPlayerHPText.font = configGoldStashText.font;
		configPlayerHPText.x = configGoldStashText.x;
		configPlayerHPText.y = configGoldStashText.y + 18;
		configPlayerHPText.fillStyle = "#aaf0d1";
		configPlayerHPText.text = player.hp.toString();
		generateFillText(configPlayerHPText);
	}

	if (towers.length === 0) {
		const configSummon = {
			configTower,
			towerLocations,
		};
		summonTowers(configSummon);
	}

	if (gloops.length === 0 || isWaveClear(configWave.currentWave)) {
		nextWave();
	}
	requestAnimationFrame(loop);

	circles.forEach((circle) => {
		circle.update();
	});

	fillText.forEach((text) => {
		text.update();
	});

	gloops.forEach((gloop) => {
		gloop.update();
	});

	towers.forEach((tower) => {
		tower.update();
	});

	projectiles.forEach((projectile) => {
		projectile.update();
	});

	const survivingGloops = gloops.filter((gloop) => gloop.destroyMe === false);
	gloops = [...survivingGloops];

	const activeProjectiles = projectiles.filter(
		(projectile) => projectile.destroyMe === false
	);
	projectiles = [...activeProjectiles];
};

game.setStatus("active")
if (game.status === "active") {
	loop();
}
