class CanvasImage {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		// this.src = configObject.src;
		this.img = configObject.img;

		this.update = function () {
			this.render();
		};

		this.render = function () {
			// const img = new Image(); 
			this.img.onload = () => {
				ctx.drawImage(this.img, 0, 0);
				ctx.beginPath();
			};
			// img.src = this.src; 
		};
		return this;
	}
}
