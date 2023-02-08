const startEventListeners = () => {
	gameCanvas.addEventListener("click", (event) => {
		const mousePosition = getMousePosition(event);
		if (ui.buttons.nextWave.evalAvailable()) {
			circles.forEach((circle) => {
				if (isIntersectingCircle(mousePosition, circle)) {
					const currentWaveGloops = gloops.filter(
						(gloop) => gloop.wave === configWave.currentWave
					);
					const countGloops = currentWaveGloops.length;
					if (countGloops > 0) {
						const totalReward = configWave.earlyBonus * countGloops;
						goldStash.deposit(totalReward);
					}
					nextWave();
				}
			});
		}

		roundRects.forEach((roundRect) => {
			if (isIntersectingRect(mousePosition, roundRect)) {
				if (roundRect.id === "start-game" && ui.buttons.start.evalAvailable()) {
					game.setStatus("active");
				}
				if (
					roundRect.id === "play-again" &&
					ui.buttons.playAgain.evalAvailable()
				) {
					game.setStatus("initial");
				}
			}
		});

		let wasTowerClicked = false;

		if (ui.buttons.towerUpgrade.evalAvailable()) {
			for (const tower of towers) {
				if (isIntersectingRect(mousePosition, tower)) {
					wasTowerClicked = true;
					const activeId = ui.buttons.towerUpgrade.activeId;
					const buttonIsActive = activeId !== null;
					if (buttonIsActive && activeId === tower.id) {
						const purchaseCompleted = player.purchaseTowerUpgrade(tower);
						break;
					} else {
						towers.map((tower) => {
							if (tower.id === activeId) {
								tower.button = [];
							}
						});
					}
					tower.drawUpgradeButton();
					ui.buttons.towerUpgrade.activeId = tower.id;
				}
			}
		}

		if (!wasTowerClicked) clearTowerButtons();
	});
};
