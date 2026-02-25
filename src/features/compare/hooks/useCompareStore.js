import { create } from "zustand";

const useCompareStore = create((set, get) => ({
    items: [],

    addToCompare: (product) => {
        const items = get().items;
        // Check if product is already in compare
        if (items.some((item) => item.id === product.id)) {
            return; // Do nothing if duplicate
        }
        // Add product, maintain max 2 items with FIFO
        const newItems = [...items, product];
        if (newItems.length > 2) {
            newItems.shift(); // Remove oldest (first)
        }
        set({ items: newItems });
    },

    removeFromCompare: (productId) => {
        set({
            items: get().items.filter((item) => item.id !== productId),
        });
    },

    isInCompare: (productId) => {
        return get().items.some((item) => item.id === productId);
    },

    clearCompare: () => set({ items: [] }),

    setProductA: (product) => {
        const items = get().items;
        const newItems = [...items];
        newItems[0] = product;
        set({ items: newItems.filter(item => item).slice(0, 2) });
    },

    setProductB: (product) => {
        const items = get().items;
        const newItems = [...items];
        newItems[1] = product;
        set({ items: newItems.filter(item => item).slice(0, 2) });
    },
}));

export default useCompareStore;