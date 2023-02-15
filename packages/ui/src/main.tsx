import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";

import App from "./index";

const theme = {
	token: {
		colorPrimary: "#09f"
	}
};

const container = document.getElementById("root");
container && createRoot(container).render((
	<ConfigProvider theme={theme}>
		<App />
	</ConfigProvider>
));