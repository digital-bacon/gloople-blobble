class FillText {
	constructor(configObject) {
		this.position = {
			x: configObject.x || 0,
			y: configObject.y || 0,
		};
		this.fillStyle = configObject.fillStyle || "grey";
		this.font = configObject.font || "14px sans-serif";
		this.maxWidth = configObject.maxWidth || null;
		this.text = configObject.text || "";
		this.textAlign = configObject.textAlign || "left";

		this.update = function () {
			this.render()
		};

		this.render = function () {
			ctx.font = this.font;
			ctx.fillStyle = this.fillStyle;
			ctx.fillText(this.text, this.position.x, this.position.y);
		};
		return this;
	}
}