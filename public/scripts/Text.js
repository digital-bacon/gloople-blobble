class Text {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;

		this.update = function () {
			this.render()
		};

		this.render = function () {
			ctx.font = "50px serif";
			ctx.fillText("Hello world", 50, 90);
		};
		return this;
	}
}