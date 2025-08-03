import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Shell } from "./scene/shell/shell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./providers/auth-provider";
import { SettingScene } from "./scene/setting/setting-scene";
import { SyncProvider } from "./providers/sync-provider";
import { DialogProvider } from "./providers/dialog-provider";
import { NoteScene } from "./scene/note/note-scene";
import { HomeScene } from "./scene/home/home-scene";

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/settings",
    element: (
      <Shell>
        <SettingScene />
      </Shell>
    ),
  },
  {
    path: "/home",
    element: (
      <Shell>
        <HomeScene />
      </Shell>
    ),
  },
  {
    path: "/:bookId",
    element: (
      <Shell>
        <NoteScene />
      </Shell>
    ),
  },
  {
    path: "/:bookId/:noteId",
    element: (
      <Shell>
        <NoteScene />
      </Shell>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncProvider>
          <DialogProvider>
            <RouterProvider router={routes} />
          </DialogProvider>
        </SyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
