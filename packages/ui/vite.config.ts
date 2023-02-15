import { join } from "path";
import { defineConfig } from "vite";
import ReactPlugin from "@vitejs/plugin-react";
import { viteSingleFile as ViteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		outDir: join(__dirname, "dist")
	},
	plugins: [
		ReactPlugin(),
		ViteSingleFile()
	],
	root: join(__dirname, "src")
});