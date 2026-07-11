const size = {
	fill: UDim2.fromScale(1.0, 1.0),
	half: { y: UDim2.fromScale(1, 0.5), all: UDim2.fromScale(0.5, 0.5), x: UDim2.fromScale(0.5, 1) },
	none: { all: UDim2.fromScale(0.0, 0.0), x: UDim2.fromScale(0.0, 1.0), y: UDim2.fromScale(1.0, 0.0) },
	double: { x: UDim2.fromScale(2, 1), all: UDim2.fromScale(2, 2), y: UDim2.fromScale(1, 2) },
	test: UDim2.fromOffset(100, 100),
};

const anchor = {
	left: { top: Vector2.zero, center: new Vector2(0.0, 0.5), bottom: Vector2.yAxis },
	center: { top: new Vector2(0.5, 0.0), center: new Vector2(0.5, 0.5), bottom: new Vector2(0.5, 1.0) },
	right: { top: Vector2.xAxis, center: new Vector2(1.0, 0.5), bottom: Vector2.one },
};

const position = {
	left: { top: UDim2.fromScale(0.0, 0.0), center: UDim2.fromScale(0.0, 0.5), bottom: UDim2.fromScale(0.0, 1.0) },
	center: { top: UDim2.fromScale(0.5, 0.0), center: UDim2.fromScale(0.5, 0.5), bottom: UDim2.fromScale(0.5, 1.0) },
	right: { top: UDim2.fromScale(1.0, 0.0), center: UDim2.fromScale(1.0, 0.5), bottom: UDim2.fromScale(1.0, 1.0) },
};

const transform = { size, anchor, position };

export { anchor, position, size, transform };
