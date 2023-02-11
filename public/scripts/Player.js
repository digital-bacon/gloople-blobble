class Player {
	constructor() {
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
				x: this.position.center.x,
				y: this.position.center.y,
				player: this,
			};

			const superPower = new SuperPower(configSuperPower);
			return superPower;
		};
		return {
			_hp: INITIAL_PLAYER_HP || 1,
			get hp() {
				return this._hp;
			},
			set hp(value) {
				this._hp = value;
				if (this._hp <= 0) {
					if (game.status !== "gameover") game.setStatus("gameover");
				}
			},
			setHP(amount) {
				if (amount < 0) {
					return (this.hp = 0);
				}
				this.hp = this.convertToWhole(amount);
			},
			gainHP(amount) {
				this.hp += this.convertToWhole(amount);
			},
			loseHP(amount) {
				this.hp -= this.convertToWhole(amount);
			},
			convertToWhole(amount) {
				return Math.floor(amount);
			},
			purchaseTowerUpgrade(tower) {
				const purchaseSuccessful = goldStash.withdraw(
					tower.calculateUpgradeCost()
				);
				if (purchaseSuccessful) {
					tower.upgrade();
				}
				return purchaseSuccessful;
			},
		};
	}
}
