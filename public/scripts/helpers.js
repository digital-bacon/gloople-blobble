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
		{ x: 135, y: 135 },
		{ x: 275, y: 150 },
		{ x: 410, y: 210 },
	];
};

const getWayPoints = () => {
	return [
		{ x: 0, y: 217 },
		{ x: 95, y: 215 },
		{ x: 98, y: 97 },
		{ x: 224, y: 103 },
		{ x: 219, y: 254 },
		{ x: 381, y: 254 },
		{ x: 382, y: 181 },
		{ x: 667, y: 176 },
	];
};
