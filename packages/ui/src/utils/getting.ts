const DATA_REGEXP = {
	color: /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i,
	content: /^.{1,100}$/,
	size: /^[1-9]\d*$/
};

const LINE_HEIGHTS = [
	{ id: 1, val: "1" },
	{ id: 1.2, val: "1.2" },
	{ id: 1.5, val: "1.5" }
];

export {
	DATA_REGEXP,
	LINE_HEIGHTS
};