import { useCallback } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  lastChecked: number;
  setIsAuthenticated: (value: boolean) => void;
  setLastChecked: (time: number) => void;
}

// Create persistent store
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      lastChecked: 0,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setLastChecked: (time) => set({ lastChecked: time }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useAuthStatus() {
  const { isAuthenticated, lastChecked, setIsAuthenticated, setLastChecked } =
    useAuthStore();

  const checkAuthStatus = useCallback(
    async (force = false) => {
      const now = Date.now();
      const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

      // Return cached auth status if within interval
      if (!force && isAuthenticated && now - lastChecked < CHECK_INTERVAL) {
        return isAuthenticated;
      }

      try {
        const response = await fetch("/api/auth/google/check");
        const data = await response.json();

        setIsAuthenticated(data.isAuthenticated);
        setLastChecked(now);

        return data.isAuthenticated;
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setLastChecked(now);
        return false;
      }
    },
    [isAuthenticated, lastChecked, setIsAuthenticated, setLastChecked]
  );

  return { isAuthenticated, checkAuthStatus };
}
