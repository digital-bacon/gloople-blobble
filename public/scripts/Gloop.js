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
				x: configObject.x - this.offset.x + this.offset.x,
				y: configObject.y - this.offset.y + this.offset.y,
			},
		};
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;
		this.speedMultiplier = configObject.speedMultiplier || 1;
		this.speed = configObject.speed * this.speedMultiplier;
		this.hp = configObject.hp;
		this.gold = configObject.gold;
		this.wave = configObject.wave;
		this.waypointIndex = configObject.waypointIndex;
		this.isUnderAttack = false;
		this.destroyMe = false;
		this.spritesheetReverse = configObject.spritesheetReverse || false;
		this.shift = 0;
		this.frameWidth = configObject.width;
		this.frameHeight = configObject.height;
		this.totalFrames = configObject.totalFrames || 20;
		this.currentFrame = 0;
		this.xCropImgStart = 0;
		this.yCropImgStart = 0;
		this.animationSpeedInMilliseconds =
			configObject.animationSpeedInMilliseconds || 80;
		this.lastAnimateTimestamp = getNowAsMilliseconds();
		this.immobile = configObject.immobile;
		this.targettable = configObject.targettable;

		this.animationOffCooldown = function () {
			return this.timestampCanAnimateAfter() <= getNowAsMilliseconds();
		};

		this.timestampCanAnimateAfter = function () {
			return this.lastAnimateTimestamp + this.animationSpeedInMilliseconds;
		};

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
				if (!this.immobile) {
					this.position.x += xTravelDistance;
					this.position.y += yTravelDistance;
					this.position.center.x += xTravelDistance;
					this.position.center.y += yTravelDistance;
				}

				let didAnimate = false;
				if (this.animationOffCooldown()) {
					didAnimate = true;
					if (!this.spritesheetReverse) {
						this.shift++;
						if (this.shift >= this.totalFrames) {
							this.shift = 0;
						}
					} else {
						this.shift--;
						if (this.shift <= 0) {
							this.shift = this.totalFrames;
						}
					}
				}

				this.render();

				if (didAnimate) {
					this.lastAnimateTimestamp = getNowAsMilliseconds();
					if (!this.spritesheetReverse) {
						this.shift++;
					} else {
						this.shift--;
					}
				}

				this.xCropImgStart = this.frameWidth * this.shift;

				const reachedWaypoint = () => {
					const xReached = Math.round(this.position.x) === Math.round(xMoveTo);
					const yReached = Math.round(this.position.y) === Math.round(yMoveTo);

					return xReached && yReached;
				};

				if (!this.immobile && reachedWaypoint()) {
					this.waypointIndex++;
				}
			} else {
				this.destroy();
				player.loseHP(1);
			}
		};

		this.render = function () {
			ctx.beginPath();
			const widthCrop = this.frameWidth;
			const heightCrop = this.frameHeight;
			const xCanvasPosition = this.position.x;
			const yCanvasPosition = this.position.y;
			const widthDraw = widthCrop;
			const heightDraw = heightCrop;
			ctx.drawImage(
				this.img,
				this.xCropImgStart,
				this.yCropImgStart,
				widthCrop,
				heightCrop,
				xCanvasPosition,
				yCanvasPosition,
				widthDraw,
				heightDraw
			);
			ctx.closePath();
		};
		return this;
	}
}
