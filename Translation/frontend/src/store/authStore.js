import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // Initial state
      isLoggedIn: false,
      userid: null,

      // Function to log in the user
      setLogIn: (user) =>
        set(() => ({
          isLoggedIn: true,
          userid: user,
        })),

      // Function to log out the user
      setLogOut: () =>
        set(() => ({
          isLoggedIn: false,
          userid: null,
        })),
    }),
    {
      name: "auth-storage", // Key name in localStorage
      getStorage: () => localStorage, // Use localStorage to persist the data
    }
  )
);

export default useAuthStore;
