const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

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
	fillColor: randomColor(),
	strokeColor: randomColor(),
};

arrShapes.push(new Circle(configCircle2));

arrShapes.forEach((shape) => shape.render());

console.log(arrShapes[0]);
arrShapes[1].render();
arrShapes[0].color = randomColor();
arrShapes[0].render();
arrShapes[0].position.x = 275;
ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
arrShapes[0].render();
arrShapes[1].render();
