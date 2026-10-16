import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IUser } from "../../types/user";

interface IUserProps {
  user: IUser;
  setUser(user: IUser): void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  clearUser: () => void;
}

const userInformation: StateCreator<
  IUserProps,
  [["zustand/persist", unknown]]
> = (set) => ({
  user: {
    access_token: "",

    user: {
      id: "",
      email: "",
      full_name: "",
      role: "",
      is_active: false,
    },
  },
  setUser: (user: IUser) => {
    set({ user });
  },
  clearUser: () => {
    set({
      user: {
        access_token: "",
        user: {
          id: "",
          email: "",
          full_name: "",
          role: "",
          is_active: false,
        },
      },
    });
  },
  hasHydrated: false,
  setHasHydrated: (state: boolean) => {
    set({ hasHydrated: state });
  },
});

export const userStore = create<IUserProps>()(
  persist(userInformation, {
    name: "agro-control-user",
    storage: createJSONStorage(() => sessionStorage),
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
  }),
);
