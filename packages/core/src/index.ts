const FetchScript = (url: string = ""): string => `
<script>
	fetch(${url}).then(res => res.arrayBuffer()).then(res => parent.postMessage({
		pluginMessage: {
			data: new Uint8Array(a)
			type: "render"
		}
	}, "*"));
</script>
`;

figma.showUI(__html__, {
	height: 500,
	width: 800
});

if (figma.editorType === "figma") {
	figma.ui.onmessage = async(msg) => {
		console.log(msg.type, msg);
		if (msg.type === "insert") {
			// width, height, url
			figma.showUI(FetchScript(msg.url), { visible: false });
		} else if (msg.type === "render") {
			// data
			const rect: RectangleNode = figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === "RECTANGLE"
				? figma.currentPage.selection[0] // 使用选中的矩形
				: figma.createRectangle(); // 创建矩形
			const image = figma.createImage(msg.data);
			rect.fills = [{
				imageHash: image.hash,
				scaleMode: "FILL",
				type: "IMAGE"
			}];
			figma.currentPage.appendChild(rect); // 将新建数据插入到画布中
			figma.currentPage.selection = [rect]; // 选中位置插入新建数据
			// figma.viewport.scrollAndZoomIntoView([rect]); // 滚动缩放视野到刚插入的插入新建数据中
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