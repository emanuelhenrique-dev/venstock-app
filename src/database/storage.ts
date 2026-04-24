// filepath: src/database/categories.ts
// Mocks das  categorias
export const categories = [
  {
    id: '1',
    name: 'Gelados',
    qtdEstoque: 180,
    qtdVendidos: 64,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '2',
    name: 'Bebidas',
    qtdEstoque: 245,
    qtdVendidos: 84,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '3',
    name: 'Carnes & Espetinhos',
    qtdEstoque: 60,
    qtdVendidos: 15,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '4',
    name: 'Outros',
    qtdEstoque: 42,
    qtdVendidos: 8,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '5',
    name: 'Extra',
    qtdEstoque: 22,
    qtdVendidos: 9,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  }
];

// Mock dos produtos (como no seu Index anterior)
export const products = [
  {
    id: '1',
    name: 'Picolé de Fruta',
    price: 12.6,
    qtdEstoque: 70,
    qtdVendidos: 30,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '2',
    name: 'Picolé de Leite',
    price: 15.0,
    qtdEstoque: 25,
    qtdVendidos: 15,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '3',
    name: 'Saco de Gelo (Cubo)',
    price: 8.5,
    qtdEstoque: 45,
    qtdVendidos: 12,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '4',
    name: 'Geladinho de chocolate',
    price: 2.0,
    qtdEstoque: 30,
    qtdVendidos: 8,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '5',
    name: 'Sorvete Napolitano',
    price: 22.0,
    qtdEstoque: 12,
    qtdVendidos: 4,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '6',
    name: 'Sorvete Natal',
    price: 22.0,
    qtdEstoque: 12,
    qtdVendidos: 4,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '7',
    name: 'Sorvete chocotone',
    price: 22.0,
    qtdEstoque: 12,
    qtdVendidos: 4,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  },
  {
    id: '8',
    name: 'Sorvete Morango',
    price: 22.0,
    qtdEstoque: 12,
    qtdVendidos: 4,
    imageUrl: 'url-aqui',
    color: 'color-aqui'
  }
];

// Mock dos produtos do cart
export const cart = [
  {
    id: '1',
    productId: '1',
    quantity: 7
  },
  {
    id: '2',
    productId: '2',
    quantity: 4
  },
  {
    id: '3',
    productId: '2',
    quantity: 2
  },
  {
    id: '4',
    productId: '5',
    quantity: 4
  },
  {
    id: '5',
    productId: '4',
    quantity: 6
  }
];
