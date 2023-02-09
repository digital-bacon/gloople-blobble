class Projectile {
	constructor(configObject) {
		this.position = {
			x: configObject.x,
			y: configObject.y,
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.speed = configObject.speed;
		this.destroyMe = false;
		this.target = configObject.target;
		this.targetReached = false;
		this.tower = configObject.tower;

		this.destroy = function () {
			this.destroyMe = true;
		};
		this.update = function () {
			let xMoveTo = this.target.position.x + this.target.width / 2;
			let yMoveTo = this.target.position.y + this.target.height / 2;
			let xDelta = xMoveTo - this.position.x;
			let yDelta = yMoveTo - this.position.y;
			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
			const moves = Math.floor(distance / this.speed);
			let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
			let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
			this.position.x += xTravelDistance;
			this.position.y += yTravelDistance;
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
			if (this.radius > 0) {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.strokeStyle = this.stroke;
				ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
			}
		};
		return this;
	}
}
