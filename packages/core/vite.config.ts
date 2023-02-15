import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			fileName: format => `index.${format}.js`,
			name: "FigmaPlaceimg"
		}
	},
	plugins: []
});