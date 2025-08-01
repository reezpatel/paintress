import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Shell } from "./scene/shell/shell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initDB } from "react-indexed-db-hook";
import { DBConfig } from "./lib/db/db-config";
import { AuthProvider } from "./providers/auth-provider";
import { SettingScene } from "./scene/setting/setting-scene";
import { Editor } from "./components/editor/editor";

const queryClient = new QueryClient();

initDB(DBConfig);

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Shell>
        <Editor />
      </Shell>
    ),
  },
  {
    path: "/settings",
    element: (
      <Shell>
        <SettingScene />
      </Shell>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
