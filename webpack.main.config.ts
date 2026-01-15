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
    pg: "commonjs pg",
    mysql2: "commonjs mysql2",
    mysql: "commonjs mysql",
    sqlite3: "commonjs sqlite3",
    tedious: "commonjs tedious",
    "pg-query-stream": "commonjs pg-query-stream",
    oracledb: "commonjs oracledb",
    "pg-native": "commonjs pg-native",
    mssql: "commonjs mssql",
    mariasql: "commonjs mariasql",
    "strong-oracle": "commonjs strong-oracle",
    oracle: "commonjs oracle",
    "pg-copy-streams": "commonjs pg-copy-streams",
    "mariadb/callback": "commonjs mariadb/callback",
    mariadb: "commonjs mariadb",
    libsql: "commonjs libsql",
  },
};
