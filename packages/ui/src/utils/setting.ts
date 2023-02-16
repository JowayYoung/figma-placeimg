interface RectType {
	bgColor?: string
	color?: string
	content?: string
	fontSize?: number
	height?: number
	lineHeight?: number
	width?: number
}

function DownloadImg({
	bgColor = "#f66",
	color = "#fff",
	content = "",
	fontSize = 10,
	height = 200,
	lineHeight = 10,
	width = 200
}: RectType): Uint8Array {
	const img = document.getElementById("placeimg-img");
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
	if (ctx) {
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, width, height);
		ctx.fill();
	}
	if (ctx && content && height >= 10) {
		ctx.font = `${fontSize}px sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		WrapText({
			content,
			ctx,
			lineHeight,
			maxWidth: width,
			x: width / 2,
			y: height / 2
		});
	}
	const base64 = canvas.toDataURL();
	img?.setAttribute("src", base64);
	const arr = base64.split(",");
	const str = atob(arr[1]);
	let len = str.length;
	const u8arr = new Uint8Array(len);
	while (len--) { u8arr[len] = str.charCodeAt(len); }
	return u8arr;
}

interface WrapTextType {
	content: string
	ctx: CanvasRenderingContext2D
	lineHeight: number
	maxWidth: number
	x: number
	y: number
}

function WrapText({
	content = "",
	ctx,
	lineHeight,
	maxWidth,
	x = 0,
	y = 0
}: WrapTextType): void {
	const textArr = content.split("");
	let line = "";
	for (let n = 0; n < textArr.length; n++) {
		const testLine = line + textArr[n];
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			ctx.fillText(line, x, y);
			line = textArr[n];
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, y);
}

export {
	DownloadImg,
	WrapText
};