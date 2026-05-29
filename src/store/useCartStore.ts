import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Importa os middlewares de persistência
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  getNumber: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

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

      getNumber: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);
      }
    }),
    {
      name: '@venstock:cart_storage-1.0.1', // Nome da chave que será salva no dispositivo (única)
      storage: createJSONStorage(() => AsyncStorage) // Define que o AsyncStorage cuidará de salvar e ler os dados
    }
  )
);
