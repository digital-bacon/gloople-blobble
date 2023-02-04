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
		const gloop = { ...configGloop }
		// if (i % 2 === 0) {
		// 	gloop.hp = 10
		// 	//console.log(gloop)
		// }
		newGloops.push(gloop)
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
	const { configTower, towerLocations } = configSummon
	const newTowers = []
	for (let i = 0; i < towerLocations.length; i++) {
		const tower = { ...configTower }
		tower.x = towerLocations[i].x;
		tower.y = towerLocations[i].y;
		newTowers.push(tower)
	};
	newTowers.forEach(tower => {
		
		summonTower(tower)
	});
}

const summonProjectile = (configProjectile) => {
	const newProjectile = new Projectile(configProjectile)
	projectiles.push(newProjectile);
}

const summonProjectiles = (configSummon) => {
	const { configProjectile } = configSummon
	const newProjectiles = []
	// for (let i = 0; i < projectileLocations.length; i++) {
	// 	const projectile = { ...configProjectile }
	newProjectiles.push(configProjectile)
	// };
	newProjectiles.forEach(projectile => {
		
		summonProjectile(projectile)
	});
}

class Tower {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + configObject.width / 2,
				y: configObject.y + configObject.height / 2,
			},
		};
		this.width = configObject.width;
		this.height = configObject.height;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.towersIndex = configObject.towersIndex;
		this.attackRadius = configObject.attackRadius;
		this.attacksMultiple = configObject.attacksMultiple;
		this.showRange = configObject.showRange;

		this.visualizeRange = function () {
			const configRange = {
				ctx,
				x: this.position.center.x,
				y: this.position.center.y,
				radius: this.attackRadius / 2,
				fillColor: "rgba(255,0,0,0.25)",
				strokeColor: "red",
	
			};
			const range = new RangeVisual(configRange);
			range.render();
		}

		this.detectGloop = function () {
			if (gloops.length === 0) {
				return false
			}
			return true
		};

		this.destroy = function () {
			towers.splice(this.towersIndex, 1);
		};

		this.attack = function (gloop) {
				gloop.loseHP(1);
		}

		this.canAttack = function (gloop) {
			const xGloop = gloop.position.x;
			const yGloop = gloop.position.y;
			const xDelta = Math.abs(this.position.center.x - xGloop);
			const yDelta = Math.abs(this.position.center.y - yGloop);

			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta) - gloop.radius;

			if (distance <= this.attackRadius / 2) {
				return true;
			}
			return false;
		}

		this.update = function () {
			if (this.showRange) this.visualizeRange()
			if (gloops.length > 0) {
				if (this.attacksMultiple) {
					gloops.forEach((gloop) => {
						if(this.canAttack(gloop)) this.attack(gloop)
					})
				} else {
					for (const gloop of gloops) {
						if(this.canAttack(gloop)) {
							this.attack(gloop)
							break; 
						}
					}
				}
				
			};
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
		this.hp = configObject.hp;
		this.isUnderAttack = false;
		this.destroyMe = false;

		this.destroy = function () {
			this.destroyMe = true
		}

		this.loseHP = function (total) {
			this.hp -= total;
			this.isUnderAttack = true;
		};

		this.underAttack = function () {
			if (this.isUnderAttack) {
				return this.color = "red";
			}
			return this.color = "black";
		};

		this.update = function () {
			this.underAttack();
			this.isUnderAttack = false;
			if (this.hp <= 0) {
				this.destroy()
				return
			};
			
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

class RangeVisual {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;

		this.update = function () {
			this.render()
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
class Projectile {
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
		this.destroyMe = false;

		this.destroy = function () {
			this.destroyMe = true
		}

		this.update = function () {
			this.render()
			// if (this.waypointIndex < waypoints.length) {
			// 	let xMoveTo = waypoints[this.waypointIndex].x;
			// 	let yMoveTo = waypoints[this.waypointIndex].y;
			// 	let xDelta = xMoveTo - this.position.x;
			// 	let yDelta = yMoveTo - this.position.y;
			// 	const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
			// 	const moves = Math.floor(distance / this.speed);
			// 	let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
			// 	let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
			// 	this.position.x += xTravelDistance;
			// 	this.position.y += yTravelDistance;
			// 	this.render();

			// 	const reachedWaypoint = () => {
			// 		const xReached = Math.round(this.position.x) === xMoveTo;
			// 		const yReached = Math.round(this.position.y) === yMoveTo;

			// 		return xReached && yReached;
			// 	};

			// 	if (reachedWaypoint()) {
			// 		this.waypointIndex++
			// 	}
			// }
			// else {
			// 	this.destroy()
			// };
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

const towerLocations = [
	{ x: 135, y: 135 },
	{ x: 410, y: 210 }
];

let gloops = [];
const towers = [];
let projectiles = [];

const configGloop = {
	ctx,
	x: waypoints[0].x,
	y: waypoints[0].y,
	radius: 15,
	fillColor: "black",
	strokeColor: "yellow",
	waypointIndex: 0,
	speed: 2,
	hp: 300,
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
	attacksMultiple: false,
	showRange: true,
};

const configProjectile = {
	ctx,
	x: 10,
	y: 10,
	radius: 10,
	fillColor: "pink",
	strokeColor: "blue",
	speed: 1,
};

const loop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (towers.length === 0) {
		const configSummon = {
			configTower,
			towerLocations,
		}
		summonTowers(configSummon)
	}

	if (projectiles.length === 0) {
		const configSummon = {
			configProjectile,
		}
		summonProjectiles(configSummon)
	}

	if (gloops.length === 0) {
		const configSummon = {
			configGloop,
			totalGloops: 6,
			xOffset: 45,
		}
		summonGloops(configSummon)
	}
	requestAnimationFrame(loop)

	gloops.forEach((shape) => {
		shape.update();
	});
	
	const survivingGloops = gloops.filter(gloop => gloop.destroyMe === false)
	gloops = [...survivingGloops]
	//console.log(survivingGloops)

	towers.forEach((shape) => {
		shape.update();
	});

	projectiles.forEach((shape) => {
		shape.update();
	});

};

loop();



