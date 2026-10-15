import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface IUserProps {
  user: {
    token: string;
    setToken: (token: string) => void;
  };
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const userInformation: StateCreator<
  IUserProps,
  [["zustand/persist", unknown]]
> = (set) => ({
  user: {
    token: "",
    setToken: (token: string) => {
      set((state) => ({
        user: {
          ...state.user,
          token,
        },
      }));
    },
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
