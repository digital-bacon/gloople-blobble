class Projectile {
	constructor(configObject) {
		this.offset = {
			x: configObject.width / 2,
			y: configObject.height / 2,
		};
		this.position = {
			x: configObject.x,
			y: configObject.y,
			center: {
				x: configObject.x + this.offset.x,
				y: configObject.y + this.offset.y,
			},
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
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
			let xMoveTo = this.target.position.x - this.offset.x;
			let yMoveTo = this.target.position.y - this.offset.y;
			let xDelta = xMoveTo - this.position.x;
			let yDelta = yMoveTo - this.position.y;
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
				const distanceToTarget = distance - this.target.width / 2;
				const reachedTarget = distanceToTarget <= this.target.width / 2;
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
			ctx.strokeRect(
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
