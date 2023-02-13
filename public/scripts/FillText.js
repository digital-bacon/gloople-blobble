class FillText {
	constructor(configObject) {
		this.position = {
			x: configObject.x || 0,
			y: configObject.y || 0,
		};
		this.id = configObject.id || Math.random().toString(36).substr(2);
		this.fillStyle = configObject.fillStyle || "grey";
		this.font = configObject.font || "14px sans-serif";
		this.maxWidth = configObject.maxWidth || null;
		this.text = configObject.text || "";
		this.textAlign = configObject.textAlign || "left";

		this.update = function () {
			this.render();
		};

		this.render = function () {
			ctx.beginPath();
			ctx.font = this.font;
			ctx.fillStyle = this.fillStyle;
			ctx.textAlign = this.textAlign;
			ctx.fillText(this.text, this.position.x, this.position.y, this.maxWidth);
			ctx.closePath();
		};
		return this;
	}
}
