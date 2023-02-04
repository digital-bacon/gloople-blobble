const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

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

const summonGloop = (configGloop) => {
	const newGloop = new Gloop(configGloop)
	gloops.push(newGloop);
}

const summonGloops = (configSummon) => {
	const { totalGloops, configGloop, xOffset } = configSummon
	const newGloops = []
	for (let i = 0; i < totalGloops; i++) {
		newGloops.push({ ...configGloop })
	}
	let totalOffset = 0
	newGloops.forEach(gloop => {
		gloop.x = gloop.x - totalOffset
		summonGloop(gloop)
		totalOffset += xOffset
	})
}

const summonTower = (configTower) => {
	const newTower = new Tower(configTower)
	towers.push(newTower);
}

const summonTowers = (configSummon) => {
	const { totalTowers, configTower, xOffset } = configSummon
	const newTowers = []
	for (let i = 0; i < totalTowers; i++) {
		newTowers.push({ ...configTower })
	}
	let totalOffset = 0
	newTowers.forEach(tower => {
		tower.x = tower.x - totalOffset
		summonTower(tower)
		totalOffset += xOffset
	})
}

class Tower {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.width = configObject.width;
		this.height = configObject.height;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.towersIndex = configObject.towersIndex;
		this.attackRadius = configObject.attackRadius;

		this.detectGloop = function () {
			if (gloops.length === 0) {
				return false
			}
			return true
		};

		this.destroy = function () {
			towers.splice(this.towersIndex, 1);
		};

		this.update = function () {
				const rangeConfig = {...configGloop};
				rangeConfig.fillColor =  "rgba(0,0,0,0)";
				rangeConfig.radius = this.attackRadius / 2;
				// rangeConfig.width = this.attackRadius;
				// rangeConfig.height = this.attackRadius;
				const towerCenter = {
					x: this.position.x + this.width / 2,
					y: this.position.y + this.height / 2,
				};
				
				rangeConfig.x = (towerCenter.x);
				rangeConfig.y = (towerCenter.y);
				const range = new Gloop(rangeConfig);
				// ctx.fillStyle = "rgba(0,0,0,0)";
				// ctx.fill();
				range.render();
				const xGloop = gloops[0].position.x;
				const yGloop = gloops[0].position.y;
				
				let xDelta = Math.abs(towerCenter.x - xGloop);
				
				let yDelta = Math.abs(towerCenter.y - yGloop);
			
				const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta) - gloops[0].radius;
				
				
				if (distance <= this.attackRadius / 2) {
					gloops[0].color = "purple";
					console.log("I 👀 you 😈")
				}
				else {
					gloops[0].color = "black";
				}

			this.render()
		};

		this.render = function () {
			if (this.width > 0 && this.height > 0) {
				ctx.beginPath();
				ctx.rect(this.position.x, this.position.y, this.width, this.height);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.strokeStyle = this.stroke;
				ctx.stroke();
				ctx.closePath();
			}
		};
		return this;
	}
}

class Gloop {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.waypointIndex = configObject.waypointIndex;
		this.speed = configObject.speed;
		this.gloopsIndex = configObject.gloopsIndex;
		this.hp = configObject.hp;

		this.destroy = function () {
			gloops.splice(this.gloopsIndex, 1);
		}

		this.loseHP = function (total) {
			this.hp -= total
		}

		this.update = function () {
			if (this.hp <= 0) {
				this.destroy()
				return
			}
			if (this.waypointIndex < waypoints.length) {
				let xMoveTo = waypoints[this.waypointIndex].x;
				let yMoveTo = waypoints[this.waypointIndex].y;
				let xDelta = xMoveTo - this.position.x;
				let yDelta = yMoveTo - this.position.y;
				const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
				const moves = Math.floor(distance / this.speed);
				let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
				let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
				this.position.x += xTravelDistance;
				this.position.y += yTravelDistance;
				this.render();

				const reachedWaypoint = () => {
					const xReached = Math.round(this.position.x) === xMoveTo;
					const yReached = Math.round(this.position.y) === yMoveTo;

					return xReached && yReached;
				};

				if (reachedWaypoint()) {
					this.waypointIndex++
					this.loseHP(1)
				}
			}
			else {
				this.destroy()
			};
		};

		this.render = function () {
			if (this.radius > 0) {
				ctx.beginPath();
				ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.strokeStyle = this.stroke;
				ctx.stroke();
			}
		};
		return this;
	}
}


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

const gloops = [];
const towers = [];

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
	radius: 15,
	fillColor: "black",
	strokeColor: "yellow",
	waypointIndex: 0,
	speed: 1,
	gloopsIndex: gloops.length,
	hp: 10,
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
	attackRadius: 125,
};

const loop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (towers.length === 0) {
		const configSummon = {
			configTower,
			totalTowers: 1,
			xOffset: 0,
		}
		summonTowers(configSummon)
	}

	if (gloops.length === 0) {
		const configSummon = {
			configGloop,
			totalGloops: 1,
			xOffset: 45,
		}
		summonGloops(configSummon)
	}
	requestAnimationFrame(loop)
	
	gloops.forEach((shape) => {
		shape.update();
	});

	towers.forEach((shape) => {
		shape.update();
	});
};

loop();



