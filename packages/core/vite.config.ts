import { resolve } from "path";
// import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// const __filename = fileURLToPath(import.meta.url); // eslint-disable-line
// const __dirname = dirname(__filename); // eslint-disable-line

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			fileName: format => `core.${format}.js`,
			name: "core"
		}
	},
	plugins: []
});