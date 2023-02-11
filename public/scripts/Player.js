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
		this.superPowers = {
			powers: ["acidrain"],
			"acidrain": {
				src: "static/spritesheet_superpower_rain.png",
				width: 253,
				height: 256,
				totalFrames: 39,
				animationSpeedInMilliseconds: 100,
				x: canvas.width,
				y: 0,
				canCallAfterTimeStamp: getNowAsMilliseconds(),
			},
		}
		this.sayNextMouseClick =false;
		this.hp = configObject.hp || 1,

		this.superPowerOffCooldown = function (superPowerType) {
			const canUseAfter = this.superPowers[superPowerType].canCallAfterTimeStamp;
			const offCooldown = canUseAfter <= getNowAsMilliseconds()
			return offCooldown;
		};

		this.attack = function (target, superPowerType) {
			if (this.superPowerOffCooldown(superPowerType)) {
				this.fireAtTarget(target, superPowerType)
			}
		};

		this.convertToWhole = function (amount) {
			return Math.floor(amount);
		};

		this.fireAtTarget = function (target, superPowerType) {
			const superPower = this.loadSuperPower(target, superPowerType);
			target.position.x -= superPower.offset.x;
			target.position.y -= superPower.height - superPower.width / 8;
			superPowers.push(superPower);
			this.superPowers[superPowerType].canCallAfterTimeStamp = superPower.timestampCanCallAfter();
		};

		this.gainHP = function (amount) {
			this.hp += this.convertToWhole(amount);
		};

		this.getHP = function () {
			return this.hp;
		};

		this.loadSuperPower = function (target, superPowerType) {
			const img = new Image();
			img.src = this.superPowers[superPowerType].src;
			const configSuperPower = {
				...this.superPowers[superPowerType],
				ctx,
				target,
				img,
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
