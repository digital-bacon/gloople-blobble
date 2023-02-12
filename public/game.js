const INITIAL_EARLY_WAVE_GOLD_BONUS = 100;
const INITIAL_GAME_STATUS = "active";
const INITIAL_GOLD_STASH_TOTAL = 5000;
const INITIAL_PLAYER_HP = 10;
const INITIAL_TOTAL_GLOOPS = 1;
const INITIAL_TOWER_LEVEL = 1;
const INITIAL_WAVE = 0; // set to 0 for production
const TOWER_SIZE = { width: 160, height: 160 };
const TOWER_LOCATION_SIZE = { width: 160, height: 70 };

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const gameStatusTypes = getGameStatusTypes();
const towerLocations = getTowerLocations(TOWER_LOCATION_SIZE);
const waypoints = getWayPoints();
const canvas = getCanvasProperties(gameCanvas);
const screenCenter = getScreenCenter();

const ui = new UserInterface();
const game = new Game();
const goldStash = new GoldStash();

const gloopSubSpecies = [];
let circles = [];
let fillText = [];
let gloops = [];
let images = [];
let locations = [];
let projectiles = [];
let rects = [];
let roundRects = [];
let staticObjects = [];
let superPowers = [];
let towers = [];
let uiElements = [];

const configWave = {
  currentWave: INITIAL_WAVE,
  nextWave: INITIAL_WAVE + 1,
  earlyBonus: {
    default: INITIAL_EARLY_WAVE_GOLD_BONUS,
  },
  gloops: {
    subSpecies: gloopSubSpecies,
    statistics: {
      types: ["gold", "hp", "speed"],
      defaults: {
        gold: 10,
        hp: 50,
        speed: 1,
      },
      multipliers: {
        gold: {
          current: 1,
          initial: 1,
          max: null,
          step: 1.25,
        },
        hp: {
          current: 1,
          initial: 1,
          max: null,
          step: 0.1,
        },
        speed: {
          current: 1,
          initial: 1,
          max: 2.5,
          step: 0.1,
        },
      },
    },
  },
  totalGloopsMultiplier: 0.25,
  _totalGloops: INITIAL_TOTAL_GLOOPS,
  get totalGloops() {
    const total = Math.floor(
      this._totalGloops + (this.currentWave - 1) * this.totalGloopsMultiplier
    );
    return total;
  },
  setGloopMultiplier: function (statisticType) {
    const stat = this.gloops.statistics.multipliers[statisticType];
    if (this.currentWave > 0) {
      stat.current = this.currentWave * stat.step + stat.initial;
    }
    if (stat.max) {
      if (stat.current > stat.max) {
        stat.current = stat.max;
      }
    }
  },
  setGloopMultipliers: function () {
    this.gloops.statistics.types.forEach((statisticType) =>
      this.setGloopMultiplier(statisticType)
    );
  },
  setNextWave: function () {
    this.setGloopMultipliers();
    this.currentWave = this.nextWave;
    this.nextWave++;
  },
};

const configGloop = {
  ctx,
  x: waypoints[0].x,
  y: waypoints[0].y,
  waypointIndex: 0,
  wave: 0,
  immobile: false,
  targettable: true,
  gold: configWave.gloops.statistics.defaults.gold,
  goldMultiplier: configWave.gloops.statistics.multipliers.gold.initial,
  hp: configWave.gloops.statistics.defaults.hp,
  hpMultiplier: configWave.gloops.statistics.multipliers.hp.initial,
  speed: configWave.gloops.statistics.defaults.speed,
  speedMultiplier: configWave.gloops.statistics.multipliers.speed.initial,
};

const imgGloopBob = new Image();
const imgGloopSam = new Image();
const imgGloopSmooch = new Image();
const imgGloopTom = new Image();
const imgIdleFranklin = new Image();
imgGloopBob.src = "static/spritesheet_bob.png";
imgGloopSam.src = "static/spritesheet_sam.png";
imgGloopSmooch.src = "static/spritesheet_smooch.png";
imgGloopTom.src = "static/spritesheet_tom.png";
imgIdleFranklin.src = "static/spritesheet_franklin.png";

const imgTowerMagic = new Image();
const imgTowerSplash = new Image();
imgTowerMagic.src = "static/tower_magic.png";
imgTowerSplash.src = "static/tower_splash.png";

let imageConfig = null;
let newUIElement = null;

const imgUIPlayerStatusBg = new Image();
imageConfig = ui.playerStatus.background.drawing.image;
newUIElement = generateUIImage(imageConfig, imgUIPlayerStatusBg)
uiElements.push(newUIElement); 

const imgButtonNextWaveBg = new Image();
imageConfig = ui.playerStatus.buttonNextWaveBg.drawing.image;
newUIElement = generateUIImage(imageConfig, imgButtonNextWaveBg)
uiElements.push(newUIElement); 

const configGloopFranklin = {
  img: imgIdleFranklin,
  width: 144.165,
  height: 55,
  x: 430,
  y: 600,
  immobile: true,
  targettable: false,
  totalFrames: 50,
  animationSpeedInMilliseconds: 500,
};

const configGloopBob = {
  img: imgGloopBob,
  width: 192,
  height: 70,
  totalFrames: 19,
  animationSpeedInMilliseconds: 250,
  speed: configWave.gloops.statistics.defaults.speed * 2.5,
  hp: configWave.gloops.statistics.defaults.hp * 0.5,
  gold: configWave.gloops.statistics.defaults.gold * 1.25,
};

const configGloopSam = {
  img: imgGloopSam,
  width: 175,
  height: 70,
  spritesheetReverse: true,
};

const configGloopSmooch = {
  img: imgGloopSmooch,
  width: 67,
  height: 70,
  spritesheetReverse: true,
  totalFrames: 18,
};

const configGloopTom = {
  img: imgGloopTom,
  width: 281,
  height: 100,
  spritesheetReverse: true,
  totalFrames: 40,
  animationSpeedInMilliseconds: 150,
  speed: configWave.gloops.statistics.defaults.speed * 0.5,
  hp: configWave.gloops.statistics.defaults.hp * 5,
  gold: configWave.gloops.statistics.defaults.gold * 2.5,
};

gloopSubSpecies.push(configGloopBob);
gloopSubSpecies.push(configGloopSam);
gloopSubSpecies.push(configGloopSmooch);
gloopSubSpecies.push(configGloopTom);

const configPlayer = {
  ctx,
  x: canvas.width,
  y: 0,
  hp: INITIAL_PLAYER_HP,
};

const player = new Player(configPlayer);
const superPowerTypes = player.superPowers;
superPowerTypes.forEach((superPowerType) => {
  const imgReady = new Image();
  const imgCooldown = new Image();
  const imageConfig =
    ui.buttons[`superpower-${superPowerType.type}`].drawing.image;
  imgReady.src = imageConfig.src;
  imgCooldown.src = imageConfig.onCooldown.src;
  imageConfig.img = imgReady;
  imageConfig.onCooldown.img = imgCooldown;
  const buttonSuperPower = new CanvasImage(imageConfig);
  uiElements.push(buttonSuperPower);
});

const configTower = {
  ctx,
  x: 135,
  y: 135,
  towersIndex: towers.length,
  attackRadius: 100,
  attacksMultiple: false,
  showRange: true,
  projectileSize: 10,
  attackDamage: 25,
  attackSpeedInMilliseconds: 1000,
  purchaseCost: 50,
  upgradeCost: 100,
  level: INITIAL_TOWER_LEVEL,
  width: TOWER_SIZE.width,
  height: TOWER_SIZE.height,
};

const configTowerMagic = {
  baseConfig: configTower,
  img: imgTowerMagic,
  type: "magic",
};

const configTowerSplash = {
  baseConfig: configTower,
  img: imgTowerSplash,
  attacksMultiple: true,
  type: "splash",
};

const towerTypes = [];
towerTypes.push(configTowerMagic);
towerTypes.push(configTowerSplash);

const configTowerLocation = {
  ctx,
  towerTypes,
  x: 0,
  y: 0,
  width: TOWER_LOCATION_SIZE.width,
  height: TOWER_LOCATION_SIZE.height,
  fillColor: "transparent",
  strokeColor: "yellow",
};

const xOffset = Math.round(screenCenter.x - canvas.center.x); // because the canvas is centered
const yOffset = 0; // because the canvas is at the top of the page

// Uncomment this block to enable waypoint building in the console.
const trackedArray = [];
document.onclick = (event) => {
  trackedArray.push(getMousePosition(event));
  // console.log(JSON.stringify(trackedArray));
};

const animationLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  populateFillText();
  populateGloops();
  populateRoundRects();
  populateStaticObjects();
  populateTowerLocations();

  if (game.status === "initial") {
    update(roundRects);
    update(fillText);
  }

  if (game.status === "active") {
    update(staticObjects);
    update(superPowers);
    update(locations);
    update(gloops);
    update(towers);
    update(projectiles);
    update(uiElements);
    update(fillText);
  }

  if (game.status === "gameover") {
    render(staticObjects);
    render(towers);
    render(projectiles);
    render(roundRects);
    render(fillText);
  }

  requestAnimationFrame(animationLoop);

  cleanupGloops();
  cleanupTowerLocations();
  cleanupProjectiles();
  cleanupSuperPowers();
};

const callNextWave = () => {
  const currentWaveGloops = gloops.filter(
    (gloop) => gloop.wave === configWave.currentWave
  );
  const countGloops = currentWaveGloops.length;
  if (countGloops > 0) {
    const totalReward = configWave.earlyBonus.default * countGloops;
    goldStash.deposit(totalReward);
  }

  configWave.setNextWave();

  const configSummon = {
    totalGloops: configWave.totalGloops,
    xOffset: 40,
    wave: configWave.currentWave,
  };
  summonGloops(configSummon);
};

const cleanupGloops = () => {
  const survivingGloops = gloops.filter((gloop) => gloop.destroyMe === false);
  gloops = [...survivingGloops];
};

const cleanupTowerLocations = () => {
  const survivingLocations = locations.filter(
    (location) => location.destroyMe === false
  );
  locations = [...survivingLocations];
};

const cleanupProjectiles = () => {
  const activeProjectiles = projectiles.filter(
    (projectile) => projectile.destroyMe === false
  );
  projectiles = [...activeProjectiles];
};

const cleanupSuperPowers = () => {
  const activeSuperPowers = superPowers.filter(
    (superPower) => superPower.destroyMe === false
  );
  superPowers = [...activeSuperPowers];
};

const generateTowerLocation = (configLocation) => {
  const newLocation = new TowerLocation(configLocation);
  locations.push(newLocation);
};

const generateTowerLocations = (configGenerate) => {
  const { configTowerLocation, configTowerTypes, towerLocations } =
    configGenerate;
  const newLocations = [];
  for (let i = 0; i < towerLocations.length; i++) {
    const location = { ...configTowerLocation };
    location.towerTypes = configTowerTypes;
    location.x = towerLocations[i].x;
    location.y = towerLocations[i].y;
    location.type = towerLocations[i].type; //tower type
    location.xTowerOffset = towerLocations[i].xTowerOffset;
    location.yTowerOffset = towerLocations[i].yTowerOffset;
    newLocations.push(location);
  }
  newLocations.forEach((location) => {
    generateTowerLocation(location);
  });
};

const clearBuildButtons = () => {
  locations.forEach((location) => {
    location.button = [];
    ui.buttons.towerBuild.activeId = null;
  });
};

const clearTowerButtons = () => {
  towers.forEach((tower) => {
    tower.button = [];
    ui.buttons.towerUpgrade.activeId = null;
  });
};

const isWaveClear = (waveNumber) => {
  const matched = gloops.filter((gloop) => gloop.wave === waveNumber);
  return matched.length === 0;
};

const populateFillText = () => {
  const elements = [
    ui.messages.goldStash,
    ui.messages.playerHP,
    ui.buttons.start,
    ui.messages.gameOver,
    ui.buttons.playAgain,
    ui.playerStatus.buttonNextWaveText,
  ];

  fillText = [];
  if (fillText.length === 0) {
    elements.forEach((element) => {
      if (element.evalAvailable()) {
        const config = element.drawing.text;
        const drawing = generateDrawing("FillText", config);
        fillText.push(drawing);
      }
    });
  }
};

const populateRoundRects = () => {
  const elements = [ui.buttons.start, ui.buttons.playAgain];
  roundRects = [];
  if (roundRects.length === 0) {
    elements.forEach((element) => {
      if (element.evalAvailable()) {
        const config = element.drawing.shape;
        const drawing = generateDrawing("RoundRect", config);
        roundRects.push(drawing);
      }
    });
  }
};

const populateTowers = (configTowerType) => {
  if (towers.length === 0) {
    const initialTowers = towerLocations.filter(
      (location) => location.id === 2
    );
    const configSummon = {
      configTower,
      configTowerType,
      towerLocations: initialTowers,
    };
    summonTowers(configSummon);
  }
};

const populateTowerLocations = () => {
  if (locations.length === 0) {
    const initialLocations = towerLocations;
    const configGenerate = {
      configTowerLocation,
      configTower,
      configTowerTypes: towerTypes,
      towerLocations: initialLocations,
    };
    generateTowerLocations(configGenerate);
  }
};

const populateStaticObjects = () => {
  if (staticObjects.length === 0) {
    const configGenerate = {
      ...configGloop,
      ...configGloopFranklin,
    };
    const newGloop = new Gloop(configGenerate);
    staticObjects.push(newGloop);
  }
};

const populateGloops = () => {
  if (gloops.length === 0 || isWaveClear(configWave.currentWave)) {
    callNextWave();
  }
};

const summonGloop = (configGloop) => {
  const newGloop = new Gloop(configGloop);
  gloops.push(newGloop);
};

const summonGloops = (configSummon) => {
  const { totalGloops, xOffset, wave } = configSummon;
  const newGloops = [];
  for (let i = 0; i < totalGloops; i++) {
    const configSubSpecies = randomFromArray(configWave.gloops.subSpecies);
    const gloop = { ...configGloop, ...configSubSpecies };
    gloop.wave = wave;
    if (gloop.wave > 1) {
      gloop.speed *= configWave.gloops.statistics.multipliers.speed.current;
      gloop.hp *= configWave.gloops.statistics.multipliers.hp.current;
      gloop.gold *= configWave.gloops.statistics.multipliers.gold.current;
    }
    newGloops.push(gloop);
  }
  let totalOffset = 0;
  newGloops.forEach((gloop) => {
    gloop.x = gloop.x - totalOffset;
    summonGloop(gloop);
    totalOffset += xOffset;
  });
};

const summonTower = (configTower) => {
  const newTower = new Tower(configTower);
  towers.push(newTower);
  return newTower;
};

animationLoop();
startEventListeners();
