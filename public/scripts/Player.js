class Player {
	constructor() {
		this.loadSuperPower = function (target) {
			const img = new Image();
			img.src = "static/projectile_magic_tower.png";
			const configProjectile = {
				ctx,
				target,
				img,
				width: 32,
				height: 32,
				x: this.position.center.x,
				y: this.position.center.y,
				radius: this.projectileSize / 2,
				fillColor: "pink",
				strokeColor: "blue",
				speed: 2,
				tower: this,
			};
			const projectile = new Projectile(configProjectile);
			return projectile;
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
