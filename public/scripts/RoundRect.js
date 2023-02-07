class RoundRect {
	constructor(configObject) {
		this.position = {
			x: configObject.x || 0,
			y: configObject.y || 0,
		};
		this.width = configObject.width || 0;
		this.height = configObject.height || 0;
		this.radii = configObject.radii || 0;
		this.strokeStyle = configObject.strokeStyle || "rgba(0, 0, 0, 0)";
		this.fillStyle = configObject.fillStyle || "rgba(0, 0, 0, 0)";

		this.update = function () {
			this.render();
		};

		this.render = function () {
			ctx.strokeStyle = this.strokeStyle;
			ctx.fillStyle = this.fillStyle;
			ctx.stroke();
			ctx.fill();
			ctx.roundRect(this.position.x, this.position.y, this.width, this.height, this.radii);
		};
		return this;
	}
}
