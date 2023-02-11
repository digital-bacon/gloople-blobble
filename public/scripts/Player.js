class Player {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + configObject.width / 2,
				y: configObject.y + configObject.height / 2 + configObject.height / 4,
			},
		};

		this.hp = configObject.hp || 1,

		this.getHP = function () {
			return this.hp;
		};

		this.setHP = function (value) {
			this.hp = value;

		};

		this.loadSuperPower = function (target) {
			const img = new Image();
			img.src = "static/spritesheet_superpower_rain.png";
			const configSuperPower = {
				ctx,
				target,
				img,
				width: 253,
				height: 256,
				totalFrames: 39,
				animationSpeedInMilliseconds: 100,
				x: canvas.width,
				y: 0,
				player: this,
			};

			const superPower = new SuperPower(configSuperPower);
			return superPower;
		};

		// this.setHP = function (amount) {
		// 	if (amount < 0) {
		// 		return (this.hp = 0);
		// 	}
		// 	this.hp = this.convertToWhole(amount);
		// };

		this.gainHP = function (amount) {
			this.hp += this.convertToWhole(amount);
		};

		this.playerIsAlive = function () {
			return this.hp > 0;
		}

		this.loseHP = function (amount) {
			this.hp -= this.convertToWhole(amount);
			if (!this.playerIsAlive()) {
				game.setStatus("gameover")
			}
		};

		this.convertToWhole = function (amount) {
			return Math.floor(amount);
		};

		this.purchaseTowerUpgrade = function (tower) {
			const purchaseSuccessful = goldStash.withdraw(
				tower.calculateUpgradeCost()
			);
			if (purchaseSuccessful) {
				tower.upgrade();
			}
			return purchaseSuccessful;
		};

		return this;
	}
}
