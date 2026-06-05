import { useSQLiteContext } from 'expo-sqlite';

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

export function useTransactionDatabase() {
  const database = useSQLiteContext();

  async function CreateTransaction(data: CreateTransactionDTO) {
    // withTransactionAsync para garantir que se QUALQUER query falhar,
    // o SQLite desfaz tudo (Rollback) e não quebra o histórico.
    await database.withTransactionAsync(async () => {
      // Trata a regra de negócio
      const isSale = data.type === 'sale';
      const finalFee = isSale ? data.fee : 0.0;
      const finalTotal = data.total + data.fee;
      const userName = 'Admin'; //temporário

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

  return { CreateTransaction };
}
