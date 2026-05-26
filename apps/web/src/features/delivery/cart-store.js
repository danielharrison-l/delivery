import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    const current = get().items.find((cartItem) => cartItem.menuItemId === item.menuItemId);

    if (current) {
      set({
        items: get().items.map((cartItem) =>
          cartItem.menuItemId === item.menuItemId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      });
      return;
    }

    set({ items: [...get().items, item] });
  },
  updateQuantity: (menuItemId, quantity) =>
    set({
      items: get().items
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    }),
  removeItem: (menuItemId) => set({ items: get().items.filter((item) => item.menuItemId !== menuItemId) }),
  clearCart: () => set({ items: [] })
}));
