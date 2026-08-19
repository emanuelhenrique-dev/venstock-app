// Altere o import principal para o caminho /legacy:
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { CategoryResponse } from '@/database/useCategoryDatabase';
import { ProductResponse } from '@/database/useProductDatabase';
import {
  TransactionResponse,
  TransactionItemResponse
} from '@/database/useTransactionDatabase';

export type ExportTransactionItem = TransactionItemResponse & {
  transaction_id?: number;
};

export interface ExportData {
  version: string;
  exportDate: string;
  categories: CategoryResponse[];
  products: ProductResponse[];
  transactions?: TransactionResponse[];
  transaction_items?: ExportTransactionItem[];
  includeTransactions: boolean;
}

export class ImportExportService {
  private static get EXPORT_DIR(): string {
    return `${FileSystem.documentDirectory}venstock_exports/`;
  }

  static async ensureExportDir() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.EXPORT_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.EXPORT_DIR, {
          intermediates: true
        });
      }
    } catch (error) {
      console.error('Erro ao criar diretório:', error);
    }
  }

  static async exportData(
    categories: CategoryResponse[],
    products: ProductResponse[],
    transactions?: TransactionResponse[],
    transaction_items?: ExportTransactionItem[],
    includeTransactions: boolean = false
  ): Promise<{ filePath: string; data: ExportData }> {
    await this.ensureExportDir();

    const exportData: ExportData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      categories,
      products,
      includeTransactions,
      ...(includeTransactions && {
        transactions: transactions || [],
        transaction_items: transaction_items || []
      })
    };

    const timestamp = Date.now();
    const fileName = `venstock_export_${timestamp}.json`;
    const filePath = `${this.EXPORT_DIR}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(exportData, null, 2),
        { encoding: 'utf8' }
      );
      return { filePath, data: exportData };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw new Error('Falha ao exportar dados');
    }
  }

  static async shareExport(filePath: string) {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Compartilhamento indisponível neste dispositivo.');
      }
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/json',
        dialogTitle: 'Compartilhar Backup Venstock'
      });
    } catch (error) {
      console.error('Erro ao compartilhar arquivo:', error);
      throw new Error('Falha ao compartilhar arquivo');
    }
  }

  static async listExports(): Promise<
    { filePath: string; fileName: string; data: ExportData }[]
  > {
    try {
      await this.ensureExportDir();
      const files = await FileSystem.readDirectoryAsync(this.EXPORT_DIR);

      const exports: {
        filePath: string;
        fileName: string;
        data: ExportData;
      }[] = [];

      for (const fileName of files) {
        if (fileName.endsWith('.json')) {
          const filePath = `${this.EXPORT_DIR}${fileName}`;
          try {
            const content = await FileSystem.readAsStringAsync(filePath, {
              encoding: 'utf8'
            });
            const data = JSON.parse(content) as ExportData;
            exports.push({ filePath, fileName, data });
          } catch (e) {
            console.warn(`Falha ao ler ${fileName}:`, e);
          }
        }
      }

      exports.sort((a, b) => {
        const dateA = new Date(a.data.exportDate).getTime();
        const dateB = new Date(b.data.exportDate).getTime();
        return dateB - dateA;
      });

      return exports;
    } catch (error) {
      console.error('Erro ao listar exports:', error);
      return [];
    }
  }

  static async deleteExport(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw new Error('Falha ao deletar arquivo');
    }
  }

  static validateImportFile(data: any): { valid: boolean; error?: string } {
    if (!data || !data.version || !Array.isArray(data.categories)) {
      return {
        valid: false,
        error: 'Formato de arquivo inválido: faltam categorias'
      };
    }

    if (!Array.isArray(data.products)) {
      return {
        valid: false,
        error: 'Formato de arquivo inválido: faltam produtos'
      };
    }

    if (data.includeTransactions === true) {
      if (
        data.transactions !== undefined &&
        !Array.isArray(data.transactions)
      ) {
        return {
          valid: false,
          error: 'Formato de arquivo inválido: transações em formato incorreto'
        };
      }

      if (
        data.transaction_items !== undefined &&
        !Array.isArray(data.transaction_items)
      ) {
        return {
          valid: false,
          error:
            'Formato de arquivo inválido: itens de transação em formato incorreto'
        };
      }
    }

    return { valid: true };
  }

  static formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
