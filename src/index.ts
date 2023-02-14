if (figma.editorType === "figma") {
	figma.showUI(__html__); // __html__对应ui.html
	// 在页面中调用parent.postMessage将触发该回调，回调传递给已发布消息的pluginMessage属性。
	figma.ui.onmessage = msg => {
		if (msg.type === "create-shapes") {
			const nodes: SceneNode[] = [];
			for (let i = 0; i < msg.count; i++) {
				const rect = figma.createRectangle();
				rect.x = i * 150;
				rect.fills = [{
					color: { b: 0, g: 0.5, r: 1 },
					type: "SOLID"
				}];
				figma.currentPage.appendChild(rect);
				nodes.push(rect);
			}
			figma.currentPage.selection = nodes;
			figma.viewport.scrollAndZoomIntoView(nodes);
		}
		// 确保完成后关闭插件，否则插件将继续运行，这会在屏幕底部显示取消按钮
		figma.closePlugin();
	};
} else {
	figma.showUI(__html__);
	figma.ui.onmessage = msg => {
		if (msg.type === "create-shapes") {
			const numberOfShapes = msg.count;
			const nodes: SceneNode[] = [];
			for (let i = 0; i < numberOfShapes; i++) {
				const shape = figma.createShapeWithText();
				// shapeType: SQUARE | ELLIPSE | ROUNDED_RECTANGLE | DIAMOND | TRIANGLE_UP | TRIANGLE_DOWN | PARALLELOGRAM_RIGHT | PARALLELOGRAM_LEFT
				shape.shapeType = "ROUNDED_RECTANGLE";
				shape.x = i * (shape.width as number + 200);
				shape.fills = [{
					color: { b: 0, g: 0.5, r: 1 },
					type: "SOLID"
				}];
				figma.currentPage.appendChild(shape);
				nodes.push(shape);
			}
			for (let i = 0; i < (numberOfShapes - 1); i++) {
				const connector = figma.createConnector();
				connector.strokeWeight = 8;
				connector.connectorStart = {
					endpointNodeId: nodes[i].id,
					magnet: "AUTO"
				};
				connector.connectorEnd = {
					endpointNodeId: nodes[i + 1].id,
					magnet: "AUTO"
				};
			}
			figma.currentPage.selection = nodes;
			figma.viewport.scrollAndZoomIntoView(nodes);
		}
		figma.closePlugin();
	};
}