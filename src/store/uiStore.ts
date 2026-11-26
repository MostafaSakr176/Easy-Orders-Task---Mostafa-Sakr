import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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
    immer((set) => ({
      cartOpen: false,
      checkout: false,
      searchOpen: false,
      signInOpen: false,
      installOpen: false,
      wishlistOpen: false,
      compareOpen: false,
      currency: "EGP",
      language: "English",
      user: null,
      toast: null,
      openCart: () =>
        set((state) => {
          state.cartOpen = true;
        }),
      closeCart: () =>
        set((state) => {
          state.cartOpen = false;
          state.checkout = false;
        }),
      setCheckout: (checkout) =>
        set((state) => {
          state.checkout = checkout;
          state.cartOpen = true;
        }),
      setSearchOpen: (searchOpen) =>
        set((state) => {
          state.searchOpen = searchOpen;
        }),
      setSignInOpen: (signInOpen) =>
        set((state) => {
          state.signInOpen = signInOpen;
        }),
      setInstallOpen: (installOpen) =>
        set((state) => {
          state.installOpen = installOpen;
        }),
      setWishlistOpen: (wishlistOpen) =>
        set((state) => {
          state.wishlistOpen = wishlistOpen;
        }),
      setCompareOpen: (compareOpen) =>
        set((state) => {
          state.compareOpen = compareOpen;
        }),
      setCurrency: (currency) =>
        set((state) => {
          state.currency = currency;
        }),
      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.signInOpen = false;
        }),
      pushToast: (text) => {
        toastSeq += 1;
        const id = toastSeq;
        set((state) => {
          state.toast = { id, text };
        });
        window.setTimeout(() => {
          set((state) => {
            if (state.toast?.id === id) state.toast = null;
          });
        }, 2800);
      },
      dismissToast: () =>
        set((state) => {
          state.toast = null;
        }),
    })),
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
