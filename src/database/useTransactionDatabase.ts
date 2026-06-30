import { useSQLiteContext } from 'expo-sqlite';

import { useAuth } from '@/hooks/useAuth';

export type SummaryPeriod =
  | '24h'
  | '7days'
  | '30days'
  | '6months'
  | '1year'
  | 'all';

export type TransactionItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type CreateTransactionDTO = {
  type: 'sale' | 'withdrawal';
  category: 'money' | 'pix' | 'avaria' | 'vencimento' | 'consumo';
  description?: string;
  fee: number;
  total: number; //total sem fee
  items: TransactionItem[];
};

export type TransactionResponse = {
  id: number;
  type: 'sale' | 'withdrawal';
  category: 'money' | 'pix' | 'avaria' | 'vencimento' | 'consumo';
  description: string | null;
  fee_value: number;
  total_value: number;
  created_at: string;
  user_name: string;
};

export type TransactionItemResponse = {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

// Interface para o retorno do Summary de Vendas
export interface SalesSummaryResponse {
  totalItemsSold: number;
  totalRevenue: number;
}

export function useTransactionDatabase() {
  const database = useSQLiteContext();

  const { user } = useAuth();

  async function CreateTransaction(data: CreateTransactionDTO) {
    // withTransactionAsync para garantir que se QUALQUER query falhar,
    // o SQLite desfaz tudo (Rollback) e não quebra o histórico.
    await database.withTransactionAsync(async () => {
      // Trata a regra de negócio
      const isSale = data.type === 'sale';
      const finalFee = isSale ? data.fee : 0.0;
      const finalTotal = data.total + data.fee;

      const userName = user?.name || 'Admin';

      const statement = await database.prepareAsync(
        `INSERT INTO transactions (type, category, description, fee_value, total_value, user_name)
          VALUES (?, ?, ?, ?, ?, ?)`
      );

      try {
        const transactionResult = await statement.executeAsync([
          data.type,
          data.category,
          data.description || null,
          finalFee,
          finalTotal,
          userName
        ]);

        // Recupera o ID gerado automaticamente para esta transação
        const newTransactionId = transactionResult.lastInsertRowId;

        // Parte responsável para salvar o histórico e  dar as baixas no banco de dados do estoque
        // Percorre cada item do carrinho
        for (const item of data.items) {
          // 1. Salva a transação do item individualmente na tabela transaction_items
          await database.runAsync(
            `INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price)
              VALUES (?, ?, ?, ?, ?)`,
            [newTransactionId, item.id, item.name, item.quantity, item.price]
          );

          // Atualiza o estoque do produto na tabela 'products'
          await database.runAsync(
            `
            UPDATE products
             SET quantity = quantity - ?
             WHERE id = ?
            `,
            [item.quantity, item.id]
          );
        }
      } catch (error) {
        throw error;
      } finally {
        await statement.finalizeAsync();
      }
    });
  }

  async function getTransactions() {
    try {
      // Busca todas as transações ordenadas pela mais recente
      const transactions = await database.getAllSync<TransactionResponse>(
        `SELECT * FROM transactions ORDER BY created_at DESC`
      );

      const fullHistory = [];

      // Para cada transação, busca os itens vinculados a ela
      for (const transaction of transactions) {
        const items = await database.getAllAsync<TransactionItemResponse>(
          `SELECT * FROM transaction_items 
           WHERE transaction_id = ?`,
          [transaction.id]
        );

        // Formata o objeto para usar no HistoryCard
        fullHistory.push({
          id: String(transaction.id),
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          fee: transaction.fee_value,
          total: transaction.total_value,
          date: transaction.created_at,
          user_name: transaction.user_name,
          items: items.map((item) => ({
            id: String(item.product_id),
            historyItemId: String(item.id),
            name: item.product_name,
            quantity: item.quantity,
            price: item.price
          }))
        });
      }

      return fullHistory;
    } catch (error) {
      console.log('Erro ao buscar histórico do banco:', error);
      throw error;
    }
  }

  async function deleteTransaction(
    transactionId: number,
    items: Array<{ id: string; quantity: number }>,
    shouldRestoreStock: boolean
  ) {
    await database.withTransactionAsync(async () => {
      //  Se o usuário confirmou que quer devolver, atualiza o estoque
      if (shouldRestoreStock) {
        for (const item of items) {
          // console.log(
          //   `ESTORNANDO -> Produto ID Real: ${item.id} | Qtd: ${item.quantity}`
          // );

          await database.runAsync(
            `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
            [Number(item.quantity), Number(item.id)] // Agora o item.id vai vir preenchido perfeitamente!
          );
        }
      }

      //  Deleta a transação do histórico de forma definitiva
      await database.runAsync(`DELETE FROM transactions WHERE id = ?`, [
        transactionId
      ]);
    });
  }

  // BUSCA O RESUMO DE PRODUTOS VENDIDOS POR PERÍODO
  async function getSalesSummaryByPeriod(
    period: SummaryPeriod
  ): Promise<SalesSummaryResponse> {
    let timeModifier = '';

    switch (period) {
      case '24h':
        timeModifier = '-1 day';
        break;
      case '7days':
        timeModifier = '-7 days';
        break;
      case '30days':
        timeModifier = '-30 days';
        break;
      case '6months':
        timeModifier = '-6 months';
        break;
      case '1year':
        timeModifier = '-1 year';
        break;
      case 'all':
      default:
        timeModifier = 'all';
        break;
    }

    // Se for 'all', não aplicamos filtro de data nenhum
    if (timeModifier === 'all') {
      const queryAll = `
      SELECT 
        COALESCE(SUM(ti.quantity), 0) as totalItemsSold,
        COALESCE(SUM(ti.quantity * ti.price), 0) as totalRevenue
      FROM transaction_items ti
      INNER JOIN transactions t ON t.id = ti.transaction_id
      WHERE t.type = 'sale'
    `;
      const result =
        await database.getFirstAsync<SalesSummaryResponse>(queryAll);
      return result || { totalItemsSold: 0, totalRevenue: 0 };
    }

    const queryWithFilter = `
    SELECT 
      COALESCE(SUM(ti.quantity), 0) as totalItemsSold,
      COALESCE(SUM(ti.quantity * ti.price), 0) as totalRevenue
    FROM transaction_items ti
    INNER JOIN transactions t ON t.id = ti.transaction_id
    WHERE t.type = 'sale' 
    AND datetime(t.created_at) >= datetime('now', ?)
  `;

    const result = await database.getFirstAsync<SalesSummaryResponse>(
      queryWithFilter,
      [timeModifier]
    );
    return result || { totalItemsSold: 0, totalRevenue: 0 };
  }

  return {
    CreateTransaction,
    getTransactions,
    deleteTransaction,
    getSalesSummaryByPeriod
  };
}
