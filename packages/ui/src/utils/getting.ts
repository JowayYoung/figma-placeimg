const DATA_REGEXP = {
	color: /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i,
	content: /^.{1,100}$/,
	size: /^[1-9]\d*$/
};

export {
	DATA_REGEXP
};