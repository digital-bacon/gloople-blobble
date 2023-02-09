class Gloop {
	constructor(configObject) {
		this.offset = {
			x: configObject.width / 2,
			y: configObject.height / 2,
		};
		this.position = {
			x: configObject.x - this.offset.x,
			y: configObject.y - this.offset.y,
			center: {
				x: configObject.x + this.offset.x,
				y: configObject.y + this.offset.y,
			},
		};
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.speed = configObject.speed;
		this.hp = configObject.hp;
		this.gold = configObject.gold;
		this.wave = configObject.wave;
		this.waypointIndex = configObject.waypointIndex;
		this.isUnderAttack = false;
		this.destroyMe = false;

		this.destroy = function () {
			this.destroyMe = true;
		};

		this.loseHP = function (total) {
			this.hp -= total;
			this.isUnderAttack = true;
		};

		this.underAttack = function () {
			if (this.isUnderAttack) {
				return (this.color = "red");
			}
			return (this.color = "black");
		};

		this.update = function () {
			this.underAttack();
			this.isUnderAttack = false;
			if (this.hp <= 0) {
				goldStash.deposit(this.gold);
				this.destroy();
				return;
			}

			if (this.waypointIndex < waypoints.length) {
				let xMoveTo = waypoints[this.waypointIndex].x - this.offset.x;
				let yMoveTo = waypoints[this.waypointIndex].y - this.offset.y;
				let xDelta = xMoveTo - this.position.x;
				let yDelta = yMoveTo - this.position.y;
				const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
				const moves = Math.floor(distance / this.speed);
				let xTravelDistance = (xMoveTo - this.position.x) / moves || 0;
				let yTravelDistance = (yMoveTo - this.position.y) / moves || 0;
				this.position.x += xTravelDistance;
				this.position.y += yTravelDistance;
				this.render();

				const reachedWaypoint = () => {
					const xReached = Math.round(this.position.x) === xMoveTo;
					const yReached = Math.round(this.position.y) === yMoveTo;

					return xReached && yReached;
				};

				if (reachedWaypoint()) {
					this.waypointIndex++;
				}
			} else {
				this.destroy();
				player.loseHP(1);
			}
		};

		this.render = function () {
			ctx.drawImage(
				this.img,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			);
			ctx.beginPath();
		};
		return this;
	}
}
