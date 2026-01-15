import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./index.css";
import "./i18n";
import { lightTheme } from "./theme";
import { EditView } from "./containers";

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
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />
        </DndProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
