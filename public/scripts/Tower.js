class Tower {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + configObject.width / 2,
				y: configObject.y + configObject.height / 2 + configObject.height / 4,
			},
		};
		this.projectile = {
			position: {
				x: this.position.center.x,
				y: this.position.center.y - 50,
			},
			src: "static/projectile_meteor_tower.png",
			width: 32,
			height: 32,
			speed: 6,
		};
		this.id = configObject.id || Math.random().toString(36).substr(2);
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;
		this.button = configObject.button || [];
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.towersIndex = configObject.towersIndex;
		this.attackDamage = configObject.attackDamage || 1;
		this.lastAttackTimestamp = null;
		this.attackRadius = configObject.attackRadius;
		this.attackSpeedInMilliseconds =
			configObject.attackSpeedInMilliseconds || 0;
		this.attacksMultiple = configObject.attacksMultiple;
		this.projectileSize = configObject.projectileSize;
		this.purchaseCost = configObject.purchaseCost || 1;
		this.showRange = configObject.showRange;
		this.level = configObject.level || 1;
		this.target = null;
		this.upgradeCost = configObject.upgradeCost || 1;
		this.multiplier = {
			attackRadius: configObject?.multiplier?.attackRadius || 10,
			attackDamage: configObject?.multiplier?.attackDamage || 0.25,
			upgradeCost: configObject?.multiplier?.upgradeCost || 0.5,
		};
		this.type = configObject.type || "unspecified";

		this.attackOffCooldown = function () {
			return this.timestampCanAttackAfter() <= getNowAsMilliseconds();
		};

		this.calculateAttackRadius = function () {
			const total = Math.floor(
				this.attackRadius + this.level * this.multiplier.attackRadius
			);
			return total;
		};

		this.calculateAttackDamage = function () {
			const total = Math.floor(
				this.attackDamage +
					this.attackDamage * (this.level * this.multiplier.attackDamage)
			);
			return total;
		};

		this.calculateUpgradeCost = function () {
			const total = Math.floor(
				this.upgradeCost +
					this.upgradeCost * (this.level * this.multiplier.upgradeCost)
			);
			return total;
		};

		this.canReachTarget = function (gloop) {
			const xGloop = gloop.position.center.x;
			const yGloop = gloop.position.center.y;
			const xDelta = Math.abs(this.position.center.x - xGloop);
			const yDelta = Math.abs(this.position.center.y - yGloop);

			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
			// const distance =
			// 	Math.sqrt(xDelta * xDelta + yDelta * yDelta) - gloop.radius;

			if (distance <= this.calculateAttackRadius()) {
				return true;
			}
			return false;
		};

		this.damage = function (gloop) {
			gloop.loseHP(this.calculateAttackDamage());
		};

		this.destroy = function () {
			towers.splice(this.towersIndex, 1);
		};

		this.drawUpgradeButton = function () {
			const canAffordUpgrade = gemStash.total >= this.calculateUpgradeCost();
			const configButton = {
				...ui.buttons.towerUpgrade.drawing.shape,
				x:
					this.position.center.x -
					ui.buttons.towerUpgrade.drawing.shape.width / 2,
				y:
					this.position.center.y -
					ui.buttons.towerUpgrade.drawing.shape.height / 2,
			};

			if (canAffordUpgrade) {
				configButton.fillStyle = "#10970a";
			}
			const button = new RoundRect(configButton);
			this.button.push(button);
			button.render();
			const configFont = {
				...ui.buttons.towerUpgrade.drawing.text.font,
			};

			const configText = {
				...ui.buttons.towerUpgrade.drawing.text,
				x: this.position.center.x,
				y: this.position.center.y + configFont.size / 3,
				font: `${configFont.weight} ${configFont.size}px ${configFont.family}`,
				fillStyle: "white",
				text: `LVL ${this.level + 1} 💎${this.calculateUpgradeCost()}`,
			};

			const text = new FillText(configText);
			this.button.push(text);
			text.render();
		};

		this.fireAtTarget = function (target) {
			const projectile = this.loadProjectile(target);
			projectiles.push(projectile);
		};

		this.getTarget = function () {
			if (this.target && this.canReachTarget(this.target)) {
				return this.target;
			}
			return this.findNextTarget();
		};

		this.findNextTarget = function () {
			for (const gloop of gloops) {
				if (this.canReachTarget(gloop) && gloop.targettable) {
					return gloop;
				}
			}
			return null;
		};

		this.loadProjectile = function (target) {
			const img = new Image();
			img.src = this.projectile.src;
			const configProjectile = {
				ctx,
				target,
				img,
				x: this.projectile.position.x,
				y: this.projectile.position.y,
				width: this.projectile.width,
				height: this.projectile.height,
				speed: this.projectile.speed,
				tower: this,
			};
			const projectile = new Projectile(configProjectile);
			return projectile;
		};

		this.timestampCanAttackAfter = function () {
			return this.lastAttackTimestamp + this.attackSpeedInMilliseconds;
		};

		this.doAttack = function () {
			let didAttack = false;
			if (this.attackOffCooldown()) {
				if (this.attacksMultiple) {
					didAttack = this.doAttackSplash();
				} else {
					didAttack = this.doAttackSingle();
				}
			}
			return didAttack;
		};

		this.doAttackSplash = function () {
			let didAttack = false;
			gloops.forEach((gloop) => {
				if (this.canReachTarget(gloop)) {
					this.damage(gloop);
					didAttack = true;
				}
			});
			return didAttack;
		};

		this.doAttackSingle = function () {
			let didAttack = false;
			this.target = this.getTarget();
			if (this.target) {
				this.fireAtTarget(this.target);
				didAttack = true;
			}
			return didAttack;
		};

		this.update = function () {
			const didAttack = this.doAttack();

			if (didAttack) {
				this.lastAttackTimestamp = getNowAsMilliseconds();
			}

			if (this.showRange) this.visualizeRange();

			this.render();
			if (this.button.length > 0) this.drawUpgradeButton();
		};

		this.upgrade = function () {
			this.level++;
		};

		this.visualizeRange = function () {
			const configRange = {
				ctx,
				x: this.position.center.x,
				y: this.position.center.y,
				radius: this.calculateAttackRadius(),
				fillColor: "rgba(255,0,0,0.25)",
				strokeColor: "transparent",
			};

			const range = new RangeVisual(configRange);
			range.render();
		};

		this.render = function () {
			if (this.width > 0 && this.height > 0) {
				ctx.beginPath();
				ctx.drawImage(
					this.img,
					this.position.x,
					this.position.y,
					this.width,
					this.height
				);
				ctx.closePath();
			}
		};
		return this;
	}
}
