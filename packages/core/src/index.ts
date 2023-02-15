async function LoadImage(url: string = ""): Promise<Uint8Array> {
	const res = await fetch(url);
	console.log("img", res);
	const buffer = await res.arrayBuffer();
	return new Uint8Array(buffer);
}

figma.showUI(__html__, {
	height: 400,
	width: 600
});

if (figma.editorType === "figma") {
	figma.ui.onmessage = async(msg) => {
		if (msg.type === "insert") {
			const rectNode: RectangleNode = figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "RECTANGLE"
				? figma.currentPage.selection[0]
				: figma.createRectangle();
			const byte = await LoadImage(msg.url);
			const image = figma.createImage(byte);
			rectNode.name = "Image";
			rectNode.resize(msg.width, msg.height);
			rectNode.fills = [{
				imageHash: image.hash,
				scaleMode: "FILL",
				scalingFactor: 0.5,
				type: "IMAGE"
			}];
			figma.currentPage.appendChild(rectNode); // 将新建数据插入到画布中
			figma.currentPage.selection = [rectNode]; // 选中位置插入新建数据
			figma.viewport.scrollAndZoomIntoView([rectNode]); // 滚动缩放视野到刚插入的插入新建数据中
		}
		figma.closePlugin(); // 确保完成后关闭插件，否则插件将继续运行，这会在屏幕底部显示取消按钮
	};
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
}