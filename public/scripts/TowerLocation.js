class TowerLocation {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + configObject.width / 2,
				y: configObject.y + configObject.height / 2,
			},
		};
		this.id = configObject.id || Math.random().toString(36).substr(2);
		this.imageConfig = configObject.imageConfig;
		this.xTowerOffset = configObject.xTowerOffset || 0;
		this.yTowerOffset = configObject.yTowerOffset || 0;
		this.button = configObject.button || [];
		this.width = configObject.width;
		this.height = configObject.height;
		this.towerCost = configObject.towerCost || 0;
		this.destroyMe = false;
		this.towerId = configObject.towerId || null;
		this.towerTypes = configObject.towerTypes || [];
		this.towerType = configObject.type || "unspecified";

		// this.drawBuildButton = function () {
		// 	const canAffordUpgrade = gemStash.total >= this.towerCost;
		// 	if (this.button.length > 0) {
		// 		const button = this.button[0];
		// 		const text = this.button[1];
		// 		button.render();
		// 		text.render();
		// 	} else {
		// 		const configButton = {
		// 			...ui.buttons.towerBuild.drawing.shape,
		// 			x:
		// 				this.position.center.x -
		// 				ui.buttons.towerBuild.drawing.shape.width / 2,
		// 			y:
		// 				this.position.center.y -
		// 				ui.buttons.towerBuild.drawing.shape.height / 2,
		// 		};

		// 		if (canAffordUpgrade) {
		// 			configButton.fillStyle = "#f06449";
		// 		}
		// 		const button = new RoundRect(configButton);
		// 		this.button.push(button);
		// 		button.render();
		// 		const configFont = {
		// 			...ui.buttons.towerBuild.drawing.text.font,
		// 		};

		// 		const configText = {
		// 			...ui.buttons.towerBuild.drawing.text,
		// 			x: this.position.center.x,
		// 			y: this.position.center.y + configFont.size / 3,
		// 			font: `${configFont.weight} ${configFont.size}px ${configFont.family}`,
		// 			fillStyle: "white",
		// 			text: `Build Tower 💰 ${this.towerCost}`,
		// 		};

		// 		const text = new FillText(configText);
		// 		this.button.push(text);
		// 		text.render();
		// 	}
		// };

		this.configBuildButton = function (baseConfig) {
			if (baseConfig.evalAvailable()) {
				const configDrawing = baseConfig.drawing.image;
				configDrawing.active = true;
				configDrawing.parent = this;
				configDrawing.x = this.position.center.x - configDrawing.width / 2;
				configDrawing.y = this.position.center.y - configDrawing.height / 2;
				return configDrawing;
			}
			return null;
		};

		this.update = function () {
			if (!this.towerId) {
				this.render();
			}
			if (this.button.length > 0) this.drawBuildButton();
		};

		this.render = function () {
			const xPosition = this.position.center.x - this.imageConfig.width / 2;
			const yPosition = this.position.center.y - this.imageConfig.height / 2;
			ctx.beginPath();
			ctx.drawImage(
				this.imageConfig.img,
				xPosition,
				yPosition,
				this.imageConfig.width,
				this.imageConfig.height
			);
			ctx.closePath();
		};
		return this;
	}
}
