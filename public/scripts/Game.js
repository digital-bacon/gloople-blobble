class Game {
	constructor() {
		return {
			timestampStart: null,
			status: INITIAL_GAME_STATUS || "",
			setStatus(status) {
				const match = gameStatusTypes.filter((gameType) => gameType === status);
				if (match.length === 0) {
					console.log(status, "is not a valid game status😡😡😡");
					return;
				}
				this.status = status;
				if (this.status === "gameover") {
					circles = [];
					gloops = [];
					towers.forEach((tower) => (tower.target = null));
					player.hp = 0;
				}
				if (this.status === "active") {
					this.timestampStart = getNowAsMilliseconds();
					this.reset();
				}
			},

			reset() {
				configWave.currentWave = INITIAL_WAVE;
				configWave.nextWave = INITIAL_WAVE + 1;
				gemStash.setTotal(INITIAL_GOLD_STASH_TOTAL);
				player.hp = INITIAL_PLAYER_HP;
				gloops = [];
				locations = [];
				projectiles = [];
				towers = [];
				staticObjects = [];
				superPowers = [];
			},
		};
	}
}
