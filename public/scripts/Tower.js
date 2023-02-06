class Tower {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + configObject.width / 2,
				y: configObject.y + configObject.height / 2,
			},
		};
		this.width = configObject.width;
		this.height = configObject.height;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.towersIndex = configObject.towersIndex;
		this.attackRadius = configObject.attackRadius;
		this.attacksMultiple = configObject.attacksMultiple;
		this.showRange = configObject.showRange;
		this.projectileSize = configObject.projectileSize;
		this.target = null;

		this.createProjectile = function (target) {
			const configProjectile = {
				ctx,
				target,
				x: this.position.center.x,
				y: this.position.center.y,
				radius: this.projectileSize / 2,
				fillColor: "pink",
				strokeColor: "blue",
				speed: 2,
				tower: this,
			};
			const projectile = new Projectile(configProjectile);
			projectiles.push(projectile);
		};

		this.visualizeRange = function () {
			const configRange = {
				ctx,
				x: this.position.center.x,
				y: this.position.center.y,
				radius: this.attackRadius,
				fillColor: "rgba(255,0,0,0.25)",
				strokeColor: "red",
			};

			const range = new RangeVisual(configRange);
			range.render();
		};

		this.detectGloop = function () {
			if (gloops.length === 0) {
				return false;
			}
			return true;
		};

		this.destroy = function () {
			towers.splice(this.towersIndex, 1);
		};

		this.attack = function (gloop) {
			gloop.loseHP(1);
		};

		this.canAttack = function (gloop) {
			const xGloop = gloop.position.x;
			const yGloop = gloop.position.y;
			const xDelta = Math.abs(this.position.center.x - xGloop);
			const yDelta = Math.abs(this.position.center.y - yGloop);

			const distance =
				Math.sqrt(xDelta * xDelta + yDelta * yDelta) - gloop.radius;

			if (distance <= this.attackRadius) {
				return true;
			}
			return false;
		};

		this.update = function () {
			if (this.showRange) this.visualizeRange();
			if (gloops.length > 0) {
				if (this.attacksMultiple) {
					gloops.forEach((gloop) => {
						if (this.canAttack(gloop)) this.attack(gloop);
					});
				} else {
					for (const gloop of gloops) {
						if (this.canAttack(gloop)) {
							if (this.target === null) {
								this.target = gloop;
								this.createProjectile(this.target);
							}
							break;
						}
					}
				}
			}
			this.render();
		};

		this.render = function () {
			if (this.width > 0 && this.height > 0) {
				ctx.beginPath();
				ctx.rect(this.position.x, this.position.y, this.width, this.height);
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.strokeStyle = this.stroke;
				ctx.stroke();
				ctx.closePath();
			}
		};
		return this;
	}
}
