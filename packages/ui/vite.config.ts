import { join } from "path";
import { defineConfig } from "vite";
import ReactPlugin from "@vitejs/plugin-react";
import { viteSingleFile as ViteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	plugins: [
		ReactPlugin(),
		ViteSingleFile()
	],
	root: join(__dirname, "src")
});