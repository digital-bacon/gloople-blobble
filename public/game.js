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
		this.waypoint = { x: configObject.xMoveTo, y: configObject.yMoveTo };
		this.speed = configObject.speed;

		this.update = function () {
			let xMoveTo = this.waypoint.x;
			let yMoveTo = this.waypoint.y;
			let xDelta = xMoveTo - this.position.x;
			let yDelta = yMoveTo - this.position.y;
			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
			const moves = Math.floor(distance / this.speed);
			let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
			let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
			this.position.x += xTravelDistance;
			this.position.y += yTravelDistance;
			this.render(this);
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

const arrShapes = [];

const configCircle1 = {
	ctx,
	x: 50,
	y: 50,
	radius: 50,
	fillColor: "red",
	strokeColor: "blue",
	xMoveTo: 301,
	yMoveTo: 50,
	speed: 6,
};

arrShapes.push(new Circle(configCircle1));

const configCircle2 = {
	ctx,
	x: 250,
	y: 250,
	radius: 25,
	fillColor: randomColor(),
	strokeColor: randomColor(),
	xMoveTo: 500,
	yMoveTo: 0,
	speed: 3,
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
