const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const canvas = {
	width: gameCanvas.width,
	height: gameCanvas.height,
};

const randomHex = () => (Math.random() * 0xfffff * 1000000).toString(16);

const colorFromHexString = (hexadecimalString) => {
	return "#" + hexadecimalString.slice(0, 6).toUpperCase();
};

const randomColor = () => colorFromHexString(randomHex());

class Circle {
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

		this.update = function () {
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
				this.render(this);

				const reachedWaypoint = () => {
					const xReached = Math.round(this.position.x) === xMoveTo;
					const yReached = Math.round(this.position.y) === yMoveTo;
					return xReached && yReached;
				};

				if (reachedWaypoint()) this.waypointIndex++;
			}
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
	{ x: 50, y: 21 },
	{ x: 125, y: 52 },
	{ x: 325, y: 102 },
	{ x: 225, y: 75 },
];

const arrShapes = [];

const configCircle1 = {
	ctx,
	x: 150,
	y: 150,
	radius: 50,
	fillColor: "red",
	strokeColor: "blue",
	waypointIndex: 0,
	speed: 1,
};

arrShapes.push(new Circle(configCircle1));

const configCircle2 = {
	ctx,
	x: 250,
	y: 250,
	radius: 25,
	fillColor: randomColor(),
	strokeColor: randomColor(),
	waypointIndex: 0,
	speed: 1,
};

arrShapes.push(new Circle(configCircle2));

const loop = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	arrShapes.forEach((shape) => {
		if (canvas.width > shape.position.x + shape.radius) {
			shape.update();
		}
	});
	requestAnimationFrame(loop);
};

loop();
