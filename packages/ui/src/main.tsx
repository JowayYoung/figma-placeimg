import React from "react";
import { createRoot } from "react-dom/client";

import App from "./index";

const container = document.getElementById("root");
container && createRoot(container).render(<App />);