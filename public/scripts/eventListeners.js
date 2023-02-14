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
			if (ui.superPowers[superpower.type].evalAvailable()) {
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
							player.attackingWithSuperPowerType = playerSuperPower.type;
						}
					}
				}
			}
		});

		if (ui.playerStatus.buttonNextWaveBg.evalAvailable()) {
			const targetId = ui.playerStatus.buttonNextWaveBg.drawing.image.id;
			const matchedElements = uiElements.filter(
				(uiElement) => uiElement.id === targetId
			);
			const targetElement =
				matchedElements.length > 0 ? matchedElements[0] : null;
			if (targetElement) {
				if (isIntersectingRect(mousePosition, targetElement)) {
					callNextWave("player");
				}
			}
		}

		if (ui.splashScreen.playButton.evalAvailable()) {
			const targetId = ui.splashScreen.playButton.drawing.image.id;
			const matchedElements = uiElements.filter(
				(uiElement) => uiElement.id === targetId
			);
			const targetElement =
				matchedElements.length > 0 ? matchedElements[0] : null;
			if (targetElement) {
				if (isIntersectingRect(mousePosition, targetElement)) {
					game.setStatus("active");
				}
			}
		}

		if (ui.gameOverScreen.playAgainButton.evalAvailable()) {
			const targetId = ui.gameOverScreen.playAgainButton.drawing.image.id;
			const matchedElements = uiElements.filter(
				(uiElement) => uiElement.id === targetId
			);
			const targetElement =
				matchedElements.length > 0 ? matchedElements[0] : null;
			if (targetElement) {
				if (isIntersectingRect(mousePosition, targetElement)) {
					game.setStatus("initial");
				}
			}
		}

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

		// Tower location click handlers
		for (const location of locations) {
			if (location.towerId === null) {
				if (isIntersectingRect(mousePosition, location)) {
					const configDrawing = location.towerTypes[0].uiButtonBuildConfig;
					location.configBuildButton(configDrawing);
				}
			}
		}

		// Build button click handlers
		const buildButtons = [
			ui.towers.buttonBuildMeteor,
			ui.towers.buttonBuildQuake,
		];

		for (const button of buildButtons) {
			if (button.evalAvailable()) {
				const configDrawing = button.drawing.image;
				const targetId = configDrawing.id;
				const targetElement = uiElements.find(
					(uiElement) => uiElement.id === targetId
				);

				if (targetElement) {
					if (isIntersectingRect(mousePosition, targetElement)) {
						const location = targetElement.parent;
						const towerType = location.towerTypes.find(
							(towerType) => towerType.type === location.towerType
						);
						const tower = { ...configTower, ...towerType };
						const purchaseCompleted = player.purchaseTower(tower, gemStash);
						if (purchaseCompleted) {
							const newTower = player.buildTower(tower, location);
							configDrawing.active = false;
						}
						break;
					}
				}
			}
		}
	});
};
