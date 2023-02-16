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
		WrapText({ content, ctx, height, lineHeight, width });
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
	height: number
	lineHeight: number
	width: number
}

function WrapText({
	content = "",
	ctx,
	height,
	lineHeight,
	width
}: WrapTextType): void {
	const text = content.split("");
	const line: string[] = [""];
	for (let n = 0; n < text.length; n++) {
		const index = line.length - 1; // 当前行
		line[index] += text[n]; // 累加单个文本
		const lineWidth = ctx.measureText(line[index]).width;
		lineWidth >= width && line.push("");
	}
	const len = line.length;
	const half = len / 2;
	const hx = width / 2;
	const hy = height / 2;
	line.forEach((v, i) => {
		const offset = i < half ? -1 * (half - i) : (i - half);
		// console.log(i, "offset", offset);
		const y = hy + offset * lineHeight;
		ctx.fillText(v, hx, y);
	});
}

export {
	DownloadImg,
	WrapText
};