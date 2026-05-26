import { create } from "zustand";

export const useAuthStore = create((set) => ({
  customer: null,
  accessToken: null,
  isBootstrapped: false,
  setSession: (session) =>
    set({
      customer: session.customer,
      accessToken: session.accessToken,
      isBootstrapped: true
    }),
  setCustomer: (customer) => set({ customer }),
  clearSession: () =>
    set({
      customer: null,
      accessToken: null,
      isBootstrapped: true
    }),
  setBootstrapped: () => set({ isBootstrapped: true })
}));
