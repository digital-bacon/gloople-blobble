const colorFromHexString = (hexadecimalString) =>
	"#" + hexadecimalString.slice(0, 6).toUpperCase();

const convertMillisecondsToSeconds = (milliseconds) => milliseconds / 1000;

const generateDrawing = (drawingType, config) => {
	switch (drawingType) {
		case "Circle":
			return new Circle(config);
		case "Image":
			return new CanvasImage(config);
		case "FillText":
			return new FillText(config);
		case "Rect":
			return new Rect(config);
		case "RoundRect":
			return new RoundRect(config);
		default:
			break;
	}
};

const generateUIImage = (imageConfig, img) => {
	img.src = imageConfig.src;
	imageConfig.img = img;
	let newUIElement = new CanvasImage(imageConfig);
	return newUIElement;
};

const getCanvasProperties = (gameCanvas) => {
	return {
		width: gameCanvas.width,
		height: gameCanvas.height,
		center: {
			x: gameCanvas.width / 2,
			y: gameCanvas.height / 2,
		},
	};
};

const getGameStatusTypes = () => ["initial", "active", "gameover"];

const getMousePosition = (event) => {
	const x = event.clientX - xOffset;
	const y = event.clientY - yOffset;
	return { x, y };
};

const getNowAsMilliseconds = () => Date.now();

const getScreenCenter = () => {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
};

const getTowerLocations = (locationSize) => {
	const locations = [
		{ type: "meteor", x: 278, y: 547, yTowerOffset: -18 },
		{ type: "meteor", x: 408, y: 332, yTowerOffset: -7 },
		{ type: "quake", x: 566, y: 547, yTowerOffset: -18 },
		{ type: "meteor", x: 887, y: 387, yTowerOffset: 0 },
	];
	const xOffset = locationSize.width / 2;
	const yOffset = locationSize.height;
	locations.map((location) => {
		location.x = location.x - xOffset;
		location.y = location.y - yOffset;
	});
	return locations;
};

const getWayPoints = () => {
	return [
		{ x: -49, y: 403 },
		{ x: 747, y: 403 },
		{ x: 790, y: 445 },
		{ x: 825, y: 460 },
		{ x: 935, y: 464 },
		{ x: 973, y: 458 },
		{ x: 995, y: 449 },
		{ x: 1028, y: 417 },
		{ x: 1047, y: 354 },
		{ x: 1059, y: 303 },
		{ x: 1085, y: 270 },
		{ x: 1106, y: 249 },
		{ x: 1139, y: 242 },
		{ x: 1189, y: 237 },
		{ x: 1339, y: 234 },
	];
};

const isIntersectingCircle = (mousePoint, circle) => {
	return (
		Math.sqrt(
			(mousePoint.x - circle.position.x) ** 2 +
				(mousePoint.y - circle.position.y) ** 2
		) < circle.radius
	);
};

const isIntersectingRect = (mousePoint, rect) => {
	const left = rect.position.x;
	const right = rect.position.x + rect.width;

	const top = rect.position.y;
	const bottom = rect.position.y + rect.height;

	const xClicked = mousePoint.x >= left && mousePoint.x <= right;

	const yClicked = mousePoint.y >= top && mousePoint.y <= bottom;

	return xClicked && yClicked;
};

const randomColor = () => colorFromHexString(randomHex());

const randomFromArray = (array) =>
	array[Math.floor(Math.random() * array.length)];

const randomHex = () => (Math.random() * 0xfffff * 1000000).toString(16);

const render = (objects) => objects.forEach((object) => object.render());

const update = (objects) => objects.forEach((object) => object.update());
