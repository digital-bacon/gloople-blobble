class GemStash {
	constructor() {
		return {
			total: INITIAL_GOLD_STASH_TOTAL,
			setTotal(amount) {
				if (amount < 0) {
					return (this.total = 0);
				}
				this.total = this.convertToWhole(amount);
			},
			deposit(amount) {
				this.total += this.convertToWhole(amount);
			},
			withdraw(amount) {
				if (this.total - amount <= 0) {
					return false;
				}
				this.total -= this.convertToWhole(amount);
				return true;
			},
			convertToWhole(amount) {
				return Math.floor(amount);
			},
		};
	}
}
