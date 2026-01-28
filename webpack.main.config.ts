import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      db: path.resolve(__dirname, "src/db/"),
    },
  },
  externals: {
    "better-sqlite3": "commonjs2 better-sqlite3",
    "ffmpeg-static": "commonjs2 ffmpeg-static",
  },
};
