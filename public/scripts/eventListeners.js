const startEventListeners = () => {
	gameCanvas.addEventListener("click", (event) => {
		const mousePosition = getMousePosition(event);

		if (player.searchingForTarget) {
			const targetSuperPower = {
				position: {
					x: mousePosition.x,
					y: mousePosition.y,
				},
			};
			player.doAttack(targetSuperPower);
		}

		player.superPowers.forEach((superpower) => {
			if (ui.buttons[`superpower-${superpower.type}`].evalAvailable()) {
				const uiElementMatches = uiElements.filter(
					(uiElement) => uiElement.id === `superpower-${superpower.type}`
				);
				const uiElement = uiElementMatches[0] ? uiElementMatches[0] : null;
				if (uiElement) {
					if (isIntersectingRect(mousePosition, uiElement)) {
						player.searchingForTarget = true;
						const superPowerPlayerMatches = player.superPowers.filter(
							(superPower) => superPower.type === superpower.type
						);
						const playerSuperPower = superPowerPlayerMatches[0]
							? superPowerPlayerMatches[0]
							: null;
						if (playerSuperPower) {
							playerSuperPower.uiButton = uiElement;
							player.attackingWithSuperPowerType = playerSuperPower.type;
						}
					}
				}
			}
		});

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
					callNextWave();
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
				const upgradeButton = tower.button.length > 0 ? tower.button[0] : null;
				if (upgradeButton) {
					if (isIntersectingRect(mousePosition, upgradeButton)) {
						wasTowerClicked = true;
						const purchaseCompleted = player.purchaseTowerUpgrade(tower);
						if (purchaseCompleted) {
							clearTowerButtons();
						}
						break;
					}
				}
				if (isIntersectingRect(mousePosition, tower)) {
					wasTowerClicked = true;
					const activeId = ui.buttons.towerUpgrade.activeId;
					const buttonIsActive = activeId !== null;
					if (buttonIsActive && activeId === tower.id) {
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

		let wasBuildLocationClicked = false;
		if (ui.buttons.towerBuild.evalAvailable()) {
			for (const location of locations) {
				if (location.towerId === null) {
					const buildButton =
						location.button.length > 0 ? location.button[0] : null;
					if (buildButton) {
						if (isIntersectingRect(mousePosition, buildButton)) {
							// const towerType = location.towerTypes[0];
							const towerType = location.towerTypes.filter(
								(towerType) => towerType.type === location.towerType
							);
							const tower = { ...configTower, ...towerType[0] };
							if (goldStash.total >= tower.purchaseCost) {
								goldStash.withdraw(tower.purchaseCost);
								tower.x = location.position.x + location.xTowerOffset;
								tower.y =
									location.position.y - location.height + location.yTowerOffset;
								const newTower = summonTower(tower);
								location.towerId = newTower.id;
								clearBuildButtons();
								break;
							}
						}
					}
					if (isIntersectingRect(mousePosition, location)) {
						wasBuildLocationClicked = true;
						const activeId = ui.buttons.towerBuild.activeId;
						const buttonIsActive = activeId !== null;
						if (buttonIsActive && activeId === location.id) {
							// const purchaseCompleted = player.purchaseTowerUpgrade(tower);
							break;
						} else {
							locations.map((location) => {
								if (location.id === activeId) {
									location.button = [];
								}
							});
						}
						location.towerCost = configTower.purchaseCost;
						location.drawBuildButton();
						ui.buttons.towerBuild.activeId = location.id;
					}
				}
			}
		}
		if (!wasBuildLocationClicked) clearBuildButtons();
	});
};
