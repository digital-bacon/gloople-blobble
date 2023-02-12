class CanvasImage {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.id = configObject.id || Math.random().toString(36).substr(2);
		this.img = configObject.img;
		this.width = configObject.width;
		this.height = configObject.height;

		this.update = function () {
			this.render();
		};

		this.render = function () {
			ctx.drawImage(
				this.img,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			);
			ctx.beginPath();
		};
		return this;
	}
}
