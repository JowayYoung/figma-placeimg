import { Aios } from "@yangzw/bruce-us/dist/web";

interface DownloadImgReturnType {
	message: string
	status: string
}

interface DownloadImgType {
	u8a: Uint8Array | null
	url: string
}

async function DownloadImg(): Promise<DownloadImgType> {
	const [err, res] = await Aios<DownloadImgReturnType>({ url: "https://dog.ceo/api/breeds/image/random" });
	const url = !err && res.status === "success" ? res.message : "";
	const data = await fetch(url);
	const buffer = await data.arrayBuffer();
	const u8a = new Uint8Array(buffer);
	return { u8a, url };
}

interface RenderImgType {
	bgColor?: string
	color?: string
	content?: string
	fontSize?: number
	fontWeight?: "normal" | "bold"
	height?: number
	lineHeight?: number
	width?: number
}

function RenderImg({
	bgColor = "#f66",
	color = "#fff",
	content = "",
	fontSize = 10,
	fontWeight = "normal",
	height = 200,
	lineHeight = 10,
	width = 200
}: RenderImgType): Uint8Array {
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
		ctx.font = `normal ${fontWeight === "bold" ? "bold" : ""} ${fontSize}px PingFang SC, Microsoft YaHei, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		WrapText({ content, ctx, fontSize, height, lineHeight, width });
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
	fontSize: number
	height: number
	lineHeight: number
	width: number
}

function WrapText({
	content = "",
	ctx,
	fontSize,
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
		lineWidth + 20 >= width && n < text.length - 2 && line.push("");
	}
	const len = line.length;
	const half = len / 2;
	const hx = width / 2;
	const hy = height / 2;
	const textOffset = (lineHeight - fontSize) / 2;
	const error = 0.5 / (lineHeight / fontSize);
	line.forEach((v, i) => {
		const offset = i < half ? -1 * (half - i) : (i - half);
		const y = hy + (offset + error) * lineHeight + textOffset;
		ctx.fillText(v, hx, y);
	});
}

export {
	type DownloadImgType,
	DownloadImg,
	RenderImg,
	WrapText
};