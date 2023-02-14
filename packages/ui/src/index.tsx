import React from "react";
import { Button } from "@douyinfe/semi-ui";

import "./assets/css/reset.css";
import "./index.scss";

export default function App(): JSX.Element {
	return (
		<div className="main-page">
			<Button>主要按钮</Button>
			<Button type="secondary">次要按钮</Button>
			<Button type="tertiary">第三按钮</Button>
			<Button type="warning">警告按钮</Button>
			<Button type="danger">危险按钮</Button>
		</div>
	);
}