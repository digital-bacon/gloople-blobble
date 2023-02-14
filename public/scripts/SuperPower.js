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
				x: configObject.x,
				y: configObject.y,
			},
			damageArea: {
				x: configObject.x,
				y: configObject.y + configObject.height / 2 - configObject.hitbox / 2,
			},
		};
		this.radius = configObject.radius;
		this.color = configObject.fillColor;
		this.stroke = configObject.strokeColor;
		this.speed = configObject.speed || 20;
		this.destroyMe = false;
		this.target = configObject.target;
		this.targetReached = false;
		this.width = configObject.width;
		this.height = configObject.height;
		this.img = configObject.img;
		this.attackDamage = configObject.attackDamage;
		this.attackWidth = configObject.attackWidth;
		this.attacksMultiple = true;
		this.lastAttackTimestamp = null;
		this.attackSpeedInMilliseconds =
			configObject.attackSpeedInMilliseconds || 0;
		this.spritesheetReverse = configObject.spritesheetReverse || false;
		this.shift = 0;
		this.frameWidth = configObject.width;
		this.frameHeight = configObject.height;
		this.totalFrames = configObject.totalFrames || 20;
		this.currentFrame = 0;
		this.xCropImgStart = 0;
		this.yCropImgStart = 0;
		this.animationSpeedInMilliseconds =
			configObject.animationSpeedInMilliseconds || 29;
		this.createdTimestamp = getNowAsMilliseconds();
		this.lastAnimateTimestamp = getNowAsMilliseconds();
		this.durationInMilliseconds = configObject.durationInMilliseconds || 5000;
		this.cooldownInMilliseconds = configObject.cooldownInMilliseconds || 60000;
		this.hitbox = configObject.hitbox;

		this.animationOffCooldown = function () {
			return this.timestampCanAnimateAfter() <= getNowAsMilliseconds();
		};

		this.attackOffCooldown = function () {
			return this.timestampCanAttackAfter() <= getNowAsMilliseconds();
		};

		this.calculateAttackDamage = function () {
			// const total = Math.floor(
			// 	this.attackDamage +
			// 		this.attackDamage * (this.level * this.multiplier.attackDamage)
			// );
			const total = this.attackDamage;
			return total;
		};

		this.calculateAttackRadius = function () {
			// const total = Math.floor(
			// 	this.attackRadius + this.level * this.multiplier.attackRadius
			// );
			const total = this.hitbox;
			return total;
		};

		this.canReachTarget = function (gloop) {
			const xGloopCenter = gloop.position.center.x;
			const yGloopCenter = gloop.position.center.y;
			const xDelta = Math.abs(this.position.damageArea.x - xGloopCenter);
			const yDelta = Math.abs(this.position.damageArea.y - yGloopCenter);

			const distance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

			if (distance <= this.calculateAttackRadius()) {
				return true;
			}
			return false;
		};

		this.damage = function (gloop) {
			gloop.loseHP(this.calculateAttackDamage());
		};

		this.destroy = function () {
			this.destroyMe = true;
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

		this.isDurationExpired = function () {
			return this.timestampSuperPowerEndAfter() <= getNowAsMilliseconds();
		};

		this.superPowerOffCooldown = function () {
			return this.timestampCanCallAfter() <= getNowAsMilliseconds();
		};

		this.timestampCanCallAfter = function () {
			return this.createdTimestamp + this.cooldownInMilliseconds;
		};

		this.timestampCanAnimateAfter = function () {
			return this.lastAnimateTimestamp + this.animationSpeedInMilliseconds;
		};

		this.timestampCanAttackAfter = function () {
			return this.lastAttackTimestamp + this.attackSpeedInMilliseconds;
		};

		this.timestampSuperPowerEndAfter = function () {
			return this.createdTimestamp + this.durationInMilliseconds;
		};

		this.update = function () {
			if (this.isDurationExpired()) {
				this.destroy();
				return;
			}
			let xMoveTo = this.target.position.x;
			let yMoveTo = this.target.position.y;
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
			this.position.damageArea.x += xTravelDistance;
			this.position.damageArea.y += yTravelDistance;
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
				const reachedTarget = distance - this.hitbox <= this.hitbox;
				return reachedTarget;
			};

			if (reachedTarget()) {
				const didAttack = this.doAttack();

				if (didAttack) {
					this.lastAttackTimestamp = getNowAsMilliseconds();
				}
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
