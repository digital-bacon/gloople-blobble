class SuperPower {
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
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.speed = configObject.speed || 1;
		this.destroyMe = false;
		this.target = configObject.target;
		this.targetReached = false;
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;
		this.lastUsedTimestamp = null;
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

		this.animationOffCooldown = function () {
			return this.timestampCanAnimateAfter() <= getNowAsMilliseconds();
		};

		this.timestampCanAnimateAfter = function () {
			return this.lastAnimateTimestamp + this.animationSpeedInMilliseconds;
		};

		this.destroy = function () {
			this.destroyMe = true;
		};

		this.update = function () {
			let xMoveTo = this.target.position.x;
			let yMoveTo = this.target.position.y;
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

			const reachedTarget = () => {
				const hitBox = this.offset.x
				const reachedTarget = distance - hitBox <= hitBox
				return reachedTarget;
			};

			if (reachedTarget()) {
				// this.target.loseHP(this.tower.calculateAttackDamage());
				// this.tower.target = null;
				console.log("reachedTarget")
				this.destroy();
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
