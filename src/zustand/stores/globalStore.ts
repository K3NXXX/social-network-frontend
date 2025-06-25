import { create } from 'zustand';

interface GlobalStore {
  isBurgerOpen: boolean;
  setBurgerOpen: (isOpen: boolean) => void;
  toggleBurger: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isBurgerOpen: false,
  setBurgerOpen: (isOpen) => set({ isBurgerOpen: isOpen }),
  toggleBurger: () =>
    set((state) => ({
      isBurgerOpen: !state.isBurgerOpen,
    })),
}));
