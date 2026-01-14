import React from "react";

import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import "./index.css";
import "./i18n";
import { lightTheme } from "./theme";
import { EditView } from "containers";

const router = createHashRouter([
  {
    path: "/",
    Component: EditView,
  },
]);

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);

  root.render(
    <React.StrictMode>
      <ConfigProvider
        theme={{
          ...lightTheme,
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </React.StrictMode>,
  );
}
