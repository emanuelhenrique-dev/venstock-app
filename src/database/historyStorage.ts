import { HistoryProps } from '@/components/HistoryCard';

export const pixTransactions: HistoryProps[] = [
  {
    id: 'PX8821934',
    type: 'pix',
    value: 82.9,
    userName: 'Emanuel Silva',
    status: 'Completed',
    date: 'Hoje às 14:35'
  },
  {
    id: 'PX9901235',
    type: 'pix',
    value: 120.0,
    userName: 'Antonia Selma',
    status: 'Pending',
    date: 'Hoje às 15:10'
  },
  {
    id: 'PX7710293',
    type: 'pix',
    value: 45.5,
    userName: 'Lucas Oliveira',
    status: 'Completed',
    date: 'Hoje às 09:20'
  },

  {
    id: 'PX77102129',
    type: 'pix',
    value: 45.5,
    userName: 'Lucas Oliveira',
    status: 'Completed',
    date: 'Hoje às 09:20'
  },

  {
    id: 'PX7710295',
    type: 'pix',
    value: 45.5,
    userName: 'Lucas Oliveira',
    status: 'Completed',
    date: 'Hoje às 09:20'
  }
];

export const generalHistory: HistoryProps[] = [
  {
    id: '100255',
    type: 'general',
    category: 'sale', // Nova propriedade para controle interno
    description: 'Dinheiro',
    itemsCount: 36,
    userName: 'Vendedor 01',
    status: 'Completed',
    date: 'Hoje às 10:15',
    value: 262.9,
    items: [
      { name: 'Saco de Gelo (cubo)', quantity: 10, price: 15.0 },
      { name: 'Picolé de Fruta', quantity: 20, price: 3.5 },
      { name: 'Picolé Especial', quantity: 6, price: 7.15 }
    ]
  },
  {
    id: '100256',
    type: 'general',
    category: 'withdrawal',
    description: 'Avaria',
    itemsCount: 3,
    userName: 'Vendedor 02',
    status: 'Completed',
    date: 'Hoje às 08:35',
    details: 'Embalagem rasgada', // Detalhes específicos da retirada
    items: [
      { name: 'Picolé de Morango', quantity: 2 },
      { name: 'Picolé de Fruta', quantity: 1 }
    ]
  }
];
