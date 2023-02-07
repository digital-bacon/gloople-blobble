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
