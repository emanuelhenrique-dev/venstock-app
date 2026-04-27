import { create } from 'zustand';
import { cart as cartMock } from '@/database/storage';

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
};

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  getTotal: (products: any[]) => number;
  getNumber: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: cartMock,

  addItem: (newItem) =>
    set((state) => {
      //Verifica se o produto (pelo productId) já está no carrinho
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        //Se já existe, mapeia o array aumentando a quantidade
        return {
          items: state.items.map((item) =>
            item.productId === newItem.productId
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        };
      }
      //Se é um produto novo, adiciona normalmente ao final
      return {
        items: [...state.items, newItem]
      };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    })),

  getTotal: (allProduct) => {
    const { items } = get();
    return items.reduce((acc, item) => {
      const product = allProduct.find((p) => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  },

  getNumber: () => {
    const { items } = get();
    return items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }
}));
