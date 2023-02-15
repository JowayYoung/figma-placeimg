import NodeFetch from "node-fetch";

async function DownloadImg(url: string = ""): Promise<Uint8Array> {
	const res = await NodeFetch(url);
	const blob = await res.blob();
	const arrayBuffer = await blob.arrayBuffer();
	const u8a = new Uint8Array(arrayBuffer);
	return u8a;
}

figma.showUI(__html__, {
	height: 500,
	width: 800
});

figma.ui.on("message", async(msg) => {
	console.log(msg.type, msg); // url、width、height
	if (msg.type !== "insert") return;
	const rect: RectangleNode = figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "RECTANGLE"
		? figma.currentPage.selection[0] // 使用选中的矩形
		: figma.createRectangle(); // 创建矩形
	const data = await DownloadImg(msg.url);
	const image = figma.createImage(data);
	rect.resize(msg.width, msg.height);
	rect.fills = [{
		imageHash: image.hash,
		scaleMode: "FILL",
		scalingFactor: 1,
		type: "IMAGE"
	}];
	figma.currentPage.appendChild(rect); // 将新建数据插入到画布中
	figma.currentPage.selection = [rect]; // 选中位置插入新建数据
	figma.viewport.scrollAndZoomIntoView([rect]); // 滚动缩放视野到刚插入的插入新建数据中
	figma.closePlugin();
});

figma.on("selectionchange", () => {
	if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "RECTANGLE") {
		const rectNode = figma.currentPage.selection[0];
		figma.ui.postMessage({
			height: rectNode.height,
			type: "update",
			width: rectNode.width
		});
	}
});

// const FetchScript = (url: string = "", width: number = 0, height: number = 0): string => `
// <script>
// 	fetch(${url}).then(res => res.arrayBuffer()).then(res => parent.postMessage({
// 		pluginMessage: {
// 			height: ${height},
// 			data: new Uint8Array(res)
// 			type: "insert",
// 			width: ${width}
// 		}
// 	}, "*"));
// </script>
// `;

// figma.ui.on("message", msg => {
// 	console.log(msg.type, msg); // url、width、height
// 	if (msg.type !== "render") return;
// 	const code = FetchScript(msg.url, msg.width, msg.height);
// 	console.log("fetch code", code);
// 	figma.showUI(code, { visible: false });
// 	figma.closePlugin(); // 确保完成后关闭插件，否则插件将继续运行，这会在屏幕底部显示取消按钮
// });