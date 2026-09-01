import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Switch
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Feather } from '@expo/vector-icons';
import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';

import {
  ImportExportService,
  ExportData
} from '@/services/import-export.service';
import { useCategoryDatabase } from '@/database/useCategoryDatabase';
import { useProductDatabase } from '@/database/useProductDatabase';
import { useTransactionDatabase } from '@/database/useTransactionDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImportExportScreen() {
  const [loading, setLoading] = useState(false);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [exportsList, setExportsList] = useState<
    { filePath: string; fileName: string; data: ExportData }[]
  >([]);

  const categoryDb = useCategoryDatabase();
  const productDb = useProductDatabase();
  const transactionDb = useTransactionDatabase();

  const loadExportsList = useCallback(async () => {
    try {
      const list = await ImportExportService.listExports();
      setExportsList(list || []);
    } catch (error) {
      console.error('Erro ao carregar lista de backups:', error);
    }
  }, []);

  useEffect(() => {
    loadExportsList();
  }, [loadExportsList]);

  const handleExport = async () => {
    setLoading(true);
    try {
      const categories = await categoryDb.getAll();
      const products = await productDb.getAll();

      let transactions: any[] = [];
      if (includeTransactions) {
        transactions = await transactionDb.getTransactions();
      }

      const { filePath } = await ImportExportService.exportData(
        categories,
        products,
        transactions,
        [],
        includeTransactions
      );

      Alert.alert('Sucesso', 'Backup criado com sucesso!', [
        { text: 'OK' },
        {
          text: 'Compartilhar',
          onPress: () => ImportExportService.shareExport(filePath)
        }
      ]);

      await loadExportsList();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Falha ao gerar o arquivo de backup.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    const existingProducts = await productDb.getAll();
    for (const prod of existingProducts) {
      if (prod.id && typeof productDb.removeProduct === 'function') {
        await productDb.removeProduct(prod.id);
      }
    }

    const existingCategories = await categoryDb.getAll();
    for (const cat of existingCategories) {
      if (cat.id && typeof categoryDb.removeCategory === 'function') {
        await categoryDb.removeCategory(cat.id);
      }
    }
  };

  const performImport = async (
    data: ExportData,
    shouldImportTransactions: boolean
  ) => {
    setLoading(true);
    try {
      await clearDatabase();

      const categoryIdMap = new Map<number, number>();

      if (data.categories && Array.isArray(data.categories)) {
        for (const cat of data.categories as any[]) {
          const createdCategory = await categoryDb.create({
            name: cat.name,
            color: cat.color,
            imageUrl: ''
          });

          const newId =
            createdCategory?.insertId ?? (createdCategory as any)?.id;
          if (cat.id && newId) {
            categoryIdMap.set(Number(cat.id), Number(newId));
          }
        }
      }

      if (data.products && Array.isArray(data.products)) {
        for (const prod of data.products as any[]) {
          const oldCatId = prod.category_id ?? prod.categoryId;
          const newCatId = categoryIdMap.get(Number(oldCatId)) ?? oldCatId;

          await productDb.create({
            name: prod.name,
            price: prod.price,
            qtdEstoque: prod.qtdEstoque ?? prod.quantity ?? 0,
            minEstoque:
              prod.minEstoque ?? prod.min_stock ?? prod.minQuantity ?? 0,
            color: prod.color || '#007AFF',
            category_id: newCatId,
            codBar: prod.codBar ?? prod.barcode ?? '',
            imageUrl: '',
            description: prod.description ?? '',
            identifier: prod.identifier ?? ''
          });
        }
      }

      if (
        shouldImportTransactions &&
        data.includeTransactions &&
        data.transactions &&
        Array.isArray(data.transactions)
      ) {
        //apagar todas transações existentes
        await transactionDb.deleteAllTransactions();

        for (const tx of data.transactions as any[]) {
          if (typeof transactionDb.CreateTransaction === 'function') {
            await transactionDb.CreateTransaction(
              {
                type: tx.type || 'sale',
                category: tx.category || 'money',
                description: tx.description ?? '',
                fee: tx.fee ?? 0,
                total: tx.total ?? tx.amount ?? 0,
                created_at: tx.date || tx.created_at || tx.createdAt || null,
                user_name: tx.user_name || null,
                items: Array.isArray(tx.items)
                  ? tx.items.map((item: any) => ({
                      id: Number(item.id ?? 0),
                      name: item.name ?? '',
                      price: item.price ?? 0,
                      quantity: item.quantity ?? item.qtd ?? 1,
                      isImported: true
                    }))
                  : []
              },
              { isImport: true }
            );
          }
        }
      }

      Alert.alert('Sucesso', 'Dados restaurados com sucesso!');
      await loadExportsList();
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao aplicar dados importados.');
      console.error('Erro na restauração:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: 'utf8'
      });
      const importedData: ExportData = JSON.parse(fileContent);

      const validation = ImportExportService.validateImportFile(importedData);
      if (!validation.valid) {
        throw new Error(validation.error || 'Arquivo inválido');
      }

      Alert.alert(
        'Confirmar Importação',
        `Este arquivo contém:\n• ${importedData.categories?.length || 0} categorias\n• ${
          importedData.products?.length || 0
        } produtos\n${
          importedData.includeTransactions && importedData.transactions
            ? `• ${importedData.transactions.length} transações\n`
            : ''
        }\n⚠️ Ao importar, os dados atuais serão substituídos.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sem histórico',
            onPress: () => performImport(importedData, false)
          },
          {
            text: 'Com histórico',
            onPress: () => performImport(importedData, true)
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Falha ao ler o arquivo selecionado.'
      );
    }
  };

  const handleDeleteExport = (filePath: string, fileName: string) => {
    Alert.alert(
      'Excluir Backup',
      `Deseja realmente apagar o arquivo "${fileName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ImportExportService.deleteExport(filePath);
              await loadExportsList();
            } catch (error: any) {
              Alert.alert('Erro', 'Não foi possível excluir o arquivo.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processando dados...</Text>
        </View>
      )}

      <PageHeader
        title1="Backup e"
        title2="Restauração"
        subtitle="Salve ou restaure os dados do seu catálogo com segurança."
        gradient={[colors.blue[400], colors.blue[500]]}
        back
        style={styles.pageHeader}
      />

      <FlatList
        data={exportsList}
        keyExtractor={(item) => item.filePath}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Exportar Dados</Text>
              <Text style={styles.cardDescription}>
                Gere um arquivo JSON com todas as informações atuais do seu
                catálogo.
              </Text>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  Incluir histórico de vendas
                </Text>
                <Switch
                  value={includeTransactions}
                  onValueChange={setIncludeTransactions}
                  trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleExport}
              >
                <Feather
                  name="download"
                  size={18}
                  color="#FFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.primaryButtonText}>Gerar Novo Backup</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Importar Arquivo Externo</Text>
              <Text style={styles.cardDescription}>
                Selecione um arquivo de backup do seu dispositivo para restaurar
                os dados.
              </Text>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleImport}
              >
                <Feather
                  name="upload"
                  size={18}
                  color="#007AFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>
                  Selecionar Arquivo JSON
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Backups Salvos Localmente</Text>
          </View>
        }
        renderItem={({ item }) => {
          const pCount = item.data?.products?.length || 0;
          const cCount = item.data?.categories?.length || 0;
          const tCount = item.data?.transactions?.length || 0;

          const detailsParts = [
            `${pCount} ${pCount === 1 ? 'produto' : 'produtos'}`,
            `${cCount} ${cCount === 1 ? 'categoria' : 'categorias'}`
          ];

          if (item.data?.includeTransactions || tCount > 0) {
            detailsParts.push(
              `${tCount} ${tCount === 1 ? 'transação' : 'transações'}`
            );
          }

          const summaryText = detailsParts.join(' | ');

          return (
            <View style={styles.backupCard}>
              <View style={styles.backupInfo}>
                <Feather name="file-text" size={24} color="#007AFF" />
                <View style={styles.backupDetails}>
                  <Text style={styles.backupName} numberOfLines={1}>
                    {item.fileName}
                  </Text>
                  <Text style={styles.backupDate}>
                    {ImportExportService.formatDate(item.data?.exportDate)}
                  </Text>
                  <Text style={styles.backupCount}>{summaryText}</Text>
                </View>
              </View>

              <View style={styles.backupActions}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() => ImportExportService.shareExport(item.filePath)}
                >
                  <Feather name="share-2" size={18} color="#007AFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() =>
                    handleDeleteExport(item.filePath, item.fileName)
                  }
                >
                  <Feather name="trash-2" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum backup encontrado no armazenamento local.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 14
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  loadingText: {
    marginTop: 12,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  headerSection: {
    marginBottom: 12
  },
  pageHeader: {
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 16
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#111827',
    marginBottom: 6
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 20
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: fontFamily.regular,
    color: '#4B5563'
  },
  primaryButton: {
    backgroundColor: colors.blue[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fontFamily.semiBold
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.blue[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12
  },
  secondaryButtonText: {
    color: colors.blue[400],
    fontSize: 16,
    fontFamily: fontFamily.semiBold
  },
  buttonIcon: {
    marginRight: 8
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: '#111827',
    marginTop: 8,
    marginBottom: 12
  },
  backupCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  backupDetails: {
    marginLeft: 12,
    flex: 1
  },
  backupName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  backupDate: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2
  },
  backupCount: {
    fontSize: 12,
    color: '#6C6C70',
    marginTop: 2
  },
  backupActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionIcon: {
    padding: 8,
    marginLeft: 4
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 24,
    fontSize: 14
  }
});
