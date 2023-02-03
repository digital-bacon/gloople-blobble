const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

class Circle {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;

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
};

arrShapes.push(new Circle(configCircle1));

const configCircle2 = {
	ctx,
	x: 150,
	y: 250,
	radius: 100,
	fillColor: "pink",
	strokeColor: "blue",
};

arrShapes.push(new Circle(configCircle2));

arrShapes.forEach((shape) => shape.render());
