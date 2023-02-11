class Player {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x,
				y: configObject.y,
			},
		};

		this.hp = configObject.hp || 1,

		this.convertToWhole = function (amount) {
			return Math.floor(amount);
		};

		this.fireAtTarget = function (target) {
			const superPower = this.loadSuperPower(target);
			superPowers.push(superPower);
		};

		this.gainHP = function (amount) {
			this.hp += this.convertToWhole(amount);
		};

		this.getHP = function () {
			return this.hp;
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

		this.loseHP = function (amount) {
			this.hp -= this.convertToWhole(amount);
			if (!this.playerIsAlive()) {
				game.setStatus("gameover")
			}
		};

		this.playerIsAlive = function () {
			return this.hp > 0;
		}

		this.purchaseTowerUpgrade = function (tower) {
			const purchaseSuccessful = goldStash.withdraw(
				tower.calculateUpgradeCost()
			);
			if (purchaseSuccessful) {
				tower.upgrade();
			}
			return purchaseSuccessful;
		};

		this.setHP = function (value) {
			this.hp = value;

		};

		return this;
	}
}
