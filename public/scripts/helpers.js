const update = (objects) => objects.forEach((object) => object.update());

const render = (objects) => objects.forEach((object) => object.render());

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

const randomHex = () => (Math.random() * 0xfffff * 1000000).toString(16);

const colorFromHexString = (hexadecimalString) => {
	return "#" + hexadecimalString.slice(0, 6).toUpperCase();
};

const getMousePosition = (event) => {
	const x = event.clientX - xOffset;
	const y = event.clientY;
	return { x, y };
};

const randomColor = () => colorFromHexString(randomHex());

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

const getScreenCenter = () => {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
};

const getGameStatusTypes = () => {
	return ["initial", "active", "gameover"];
};

const getTowerLocations = () => {
	return [
		{ towerID: null, id: 1, x: 40, y: 162 },
		{ towerID: null, id: 2, x: 125, y: 125 },
		{ towerID: null, id: 3, x: 163, y: 125 },
		{ towerID: null, id: 4, x: 243, y: 202 },
		{ towerID: null, id: 5, x: 284, y: 202 },
		{ towerID: null, id: 6, x: 325, y: 202 },
		{ towerID: null, id: 7, x: 410, y: 202 },
	];
};

const getWayPoints = () => {
	return [
		{ x: 0, y: 217 },
		{ x: 98, y: 217 },
		{ x: 98, y: 97 },
		{ x: 224, y: 97 },
		{ x: 224, y: 254 },
		{ x: 381, y: 254 },
		{ x: 381, y: 181 },
		{ x: 667, y: 181 },
	];
};
