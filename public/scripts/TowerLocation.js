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
		this.button = configObject.button || [];
		this.id = configObject.id;
		this.width = configObject.width;
		this.height = configObject.height;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.towerCost = configObject.towerCost || 0;
		
		this.drawBuildButton = function () {
			const canAffordUpgrade = goldStash.total >= this.towerCost;
			const configButton = {
				...ui.buttons.towerBuild.drawing.shape,
				x: this.position.center.x - ui.buttons.towerBuild.drawing.shape.width / 2,
				y: this.position.center.y - ui.buttons.towerBuild.drawing.shape.height / 2,
			}

			if (canAffordUpgrade) {
				configButton.fillStyle = "#f06449"
			}
			const button = new RoundRect(configButton);
			this.button.push(button)
			button.render();
			const configFont = {
				...ui.buttons.towerBuild.drawing.text.font,
			}

			const configText = {
				...ui.buttons.towerBuild.drawing.text,
				x: this.position.center.x,
				y: this.position.center.y + configFont.size / 3,
				font: `${configFont.weight} ${configFont.size}px ${configFont.family}`,
				fillStyle: "white",
				text: `Build Tower 💰 ${this.towerCost}`,
			}

			const text = new FillText(configText);
			this.button.push(text)
			text.render();

		};

		this.update = function () {
			this.render();
			if (this.button.length > 0) this.drawBuildButton();
		};

		this.render = function () {
			if (this.width > 0 && this.height > 0) {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.strokeStyle = this.stroke;
				ctx.rect(this.position.x, this.position.y, this.width, this.height);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		};
		return this;
	}
}
