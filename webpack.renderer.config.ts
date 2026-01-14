import type { Configuration } from "webpack";
import path from "path";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

// CSS rules with PostCSS support
rules.push({
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [
    { loader: "style-loader" },
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
      },
    },
    { loader: "postcss-loader" },
  ],
});

// CSS Modules with PostCSS support
rules.push({
  test: /\.module\.css$/,
  use: [
    { loader: "style-loader" },
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: "[name]__[local]--[hash:base64:5]",
        },
        importLoaders: 1,
      },
    },
    { loader: "postcss-loader" },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      i18n: path.resolve(__dirname, "src/render/i18n"),
      components: path.resolve(__dirname, "src/render/components"),
      containers: path.resolve(__dirname, "src/render/containers"),
      extensions: path.resolve(__dirname, "src/render/extensions"),
    },
  },
};
