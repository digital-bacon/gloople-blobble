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
		this.superPowers = [
			{
				type: "acidRain",
				src: "static/spritesheet_superpower_rain.png",
				width: 253,
				height: 256,
				totalFrames: 39,
				animationSpeedInMilliseconds: 100,
				x: canvas.width,
				y: 0,
				canCallAfterTimeStamp: getNowAsMilliseconds(),
				uiButton: null,
				pendingTarget: false,
				attackWidth: 253 - 100,
				attackDamage: 10,
				hitbox: 126,
			},
			{
				type: "fireBall",
				src: "static/spritesheet_superpower_fireball.png",
				width: 109,
				height: 256,
				totalFrames: 19,
				animationSpeedInMilliseconds: 100,
				x: canvas.width,
				y: 0,
				canCallAfterTimeStamp: getNowAsMilliseconds(),
				uiButton: null,
				pendingTarget: false,
				attackWidth: 109,
				attackDamage: 10,
				hitbox: 126,
			},
			{
				type: "stones",
				src: "static/spritesheet_superpower_stones.png",
				width: 194,
				height: 512,
				totalFrames: 18,
				animationSpeedInMilliseconds: 100,
				x: canvas.width,
				y: 0,
				canCallAfterTimeStamp: getNowAsMilliseconds(),
				uiButton: null,
				pendingTarget: false,
				attackWidth: 200,
				attackDamage: 10,
				hitbox: 126,
			},
		];
		this.attackingWithSuperPowerType = null;
		this.searchingForTarget = false;
		this.hp = configObject.hp || 1;

		this.doAttack = function (target) {
			const matchedSuperPower = this.superPowers.filter(
				(superPower) => superPower.type === this.attackingWithSuperPowerType
			);
			const superPower = matchedSuperPower[0];
			this.attack(target, superPower);
			this.searchingForTarget = false;
			const uiImageConfig =
				ui.superPowers[superPower.type].drawing.image;
			uiImageConfig.onCooldown.active = true;
			const timeOut = superPower.canCallAfterTimeStamp - getNowAsMilliseconds();
			setTimeout(() => {
				uiImageConfig.onCooldown.active = false;
			}, timeOut);
		};

		this.superPowerOffCooldown = function (superPower) {
			const canUseAfter = superPower.canCallAfterTimeStamp;
			const offCooldown = canUseAfter <= getNowAsMilliseconds();
			return offCooldown;
		};

		this.attack = function (target, superPower) {
			if (this.superPowerOffCooldown(superPower)) {
				this.fireAtTarget(target, superPower);
			}
		};

		this.convertToWhole = function (amount) {
			return Math.floor(amount);
		};

		this.fireAtTarget = function (target, superPower) {
			const newSuperPower = this.loadSuperPower(target, superPower);
			target.position.x -= newSuperPower.offset.x;
			target.position.y -= newSuperPower.height - newSuperPower.width / 8;
			superPowers.push(newSuperPower);
			superPower.canCallAfterTimeStamp = newSuperPower.timestampCanCallAfter();
		};

		this.gainHP = function (amount) {
			this.hp += this.convertToWhole(amount);
		};

		this.getHP = function () {
			return this.hp;
		};

		this.loadSuperPower = function (target, superPower) {
			const img = new Image();
			img.src = superPower.src;
			const configSuperPower = {
				...superPower,
				ctx,
				target,
				img,
				player: this,
			};

			const newSuperPower = new SuperPower(configSuperPower);
			return newSuperPower;
		};

		this.loseHP = function (amount) {
			this.hp -= this.convertToWhole(amount);
			if (!this.playerIsAlive()) {
				game.setStatus("gameover");
			}
		};

		this.playerIsAlive = function () {
			return this.hp > 0;
		};

		this.purchaseTowerUpgrade = function (tower) {
			const purchaseSuccessful = gemStash.withdraw(
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
