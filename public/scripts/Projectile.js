class Projectile {
	constructor(configObject) {
		this.offset = {
			x: configObject.width / 2,
			y: configObject.height / 2,
		};
		this.position = {
			x: configObject.x - this.offset.x,
			y: configObject.y - this.offset.y,
			center: {
				x: configObject.x - this.offset.x + this.offset.x,
				y: configObject.y - this.offset.y + this.offset.y,
			},
		};
		this.speed = configObject.speed;
		this.destroyMe = false;
		this.target = configObject.target;
		this.targetReached = false;
		this.tower = configObject.tower;
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;

		this.destroy = function () {
			this.destroyMe = true;
		};
		this.update = function () {
			let xMoveTo = this.target.position.center.x;
			let yMoveTo = this.target.position.center.y;
			let xDelta = xMoveTo - this.position.center.x;
			let yDelta = yMoveTo - this.position.center.y;
			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
			const moves = Math.floor(distance / this.speed);
			let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
			let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
			this.position.x += xTravelDistance;
			this.position.y += yTravelDistance;
			this.position.center.x += xTravelDistance;
			this.position.center.y += yTravelDistance;
			this.render();

			const reachedTarget = () => {
				const hitbox = (this.target.height + this.target.width) / 4;
				const reachedTarget = distance <= hitbox;
				return reachedTarget;
			};

			if (reachedTarget()) {
				this.target.loseHP(this.tower.calculateAttackDamage());
				this.tower.target = null;
				this.destroy();
			}
		};

		this.render = function () {
			ctx.beginPath();
			ctx.drawImage(
				this.img,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			);
			ctx.closePath();
		};
		return this;
	}
}
