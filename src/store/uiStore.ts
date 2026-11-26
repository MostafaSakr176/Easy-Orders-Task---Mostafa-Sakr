import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToastMessage {
  id: number;
  text: string;
}

interface SessionUser {
  name: string;
  email: string;
}

interface UiState {
  cartOpen: boolean;
  checkout: boolean;
  searchOpen: boolean;
  signInOpen: boolean;
  installOpen: boolean;
  wishlistOpen: boolean;
  compareOpen: boolean;
  currency: string;
  language: string;
  user: SessionUser | null;
  toast: ToastMessage | null;
  openCart: () => void;
  closeCart: () => void;
  setCheckout: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  setSignInOpen: (value: boolean) => void;
  setInstallOpen: (value: boolean) => void;
  setWishlistOpen: (value: boolean) => void;
  setCompareOpen: (value: boolean) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  setUser: (user: SessionUser | null) => void;
  pushToast: (text: string) => void;
  dismissToast: () => void;
}

let toastSeq = 0;

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      cartOpen: false,
      checkout: false,
      searchOpen: false,
      signInOpen: false,
      installOpen: false,
      wishlistOpen: false,
      compareOpen: false,
      currency: "USD",
      language: "English",
      user: null,
      toast: null,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false, checkout: false }),
      setCheckout: (checkout) => set({ checkout, cartOpen: true }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setSignInOpen: (signInOpen) => set({ signInOpen }),
      setInstallOpen: (installOpen) => set({ installOpen }),
      setWishlistOpen: (wishlistOpen) => set({ wishlistOpen }),
      setCompareOpen: (compareOpen) => set({ compareOpen }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setUser: (user) => set({ user, signInOpen: false }),
      pushToast: (text) => {
        toastSeq += 1;
        const id = toastSeq;
        set({ toast: { id, text } });
        window.setTimeout(() => {
          set((state) => (state.toast?.id === id ? { toast: null } : {}));
        }, 2800);
      },
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: "easy-orders-ui",
      partialize: (state) => ({
        currency: state.currency,
        language: state.language,
        user: state.user,
      }),
    },
  ),
);
