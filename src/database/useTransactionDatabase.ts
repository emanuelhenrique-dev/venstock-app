import { useSQLiteContext } from 'expo-sqlite';

export type Transaction = {
  name: string;
  color: string;
  imageUrl?: string;
};

export type TransactionResponse = {
  id: number;
  name: string;
  qtdEstoque: number;
  qtdVendidos: number;
  imageUrl?: string | null;
  color: string;
  created_at: string;
};

export function useTransactionDatabase() {
  const database = useSQLiteContext();

  return {};
}
