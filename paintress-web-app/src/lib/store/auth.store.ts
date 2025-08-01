import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import storage from "./indexed-db-storage";

type AuthStore = {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  isOffline: boolean;
  forceShowAuth: boolean;
  setIsOffline: (isOffline: boolean) => void;
  setForceShowAuth: (forceShowAuth: boolean) => void;
};

export const authStore = create<AuthStore>()(
  persist<AuthStore>(
    (set) => ({
      isOffline: false,
      isAuthenticated: false,
      token: null,
      forceShowAuth: false,
      setIsOffline: (isOffline) => {
        set({ isOffline });
      },
      setForceShowAuth: (forceShowAuth) => {
        set({ forceShowAuth });
      },
      setToken: (token) => {
        if (token) {
          set({ isAuthenticated: true, token });
        } else {
          set({ isAuthenticated: false, token: null });
        }
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => storage),
    }
  )
);
