import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    server: {
        cors: false,
        port: 5750,
    },
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
            {
                find: "@assets",
                replacement: fileURLToPath(
                    new URL("./src/assets", import.meta.url)
                ),
            },
        ],
    },
});
