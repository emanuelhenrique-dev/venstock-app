import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import QRCode from 'react-native-qrcode-svg';
import { MaterialIcons } from '@expo/vector-icons';

import { List } from '@/components/List';
import { HistoryCard } from '@/components/HistoryCard';
import { generalHistory, pixTransactions } from '@/database/historyStorage';
import { useCallback, useState } from 'react';
import { transactionType } from './cart';
import { ButtonToggle } from '@/components/ButtonToggle';
import { useTransactionDatabase } from '@/database/useTransactionDatabase';
import { useFocusEffect } from 'expo-router';

export default function Cashier() {
  const [activeTab, setActiveTab] = useState<'pix' | 'history'>('pix');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<transactionType[]>(['sale']);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const transactionDatabase = useTransactionDatabase();

  const insets = useSafeAreaInsets();

  // Função para carregar os dados de transações
  async function loadHistory() {
    try {
      setIsFetching(true);
      const data = await transactionDatabase.getTransactions();

      const historyData = data.map((item) => ({
        id: item.id,
        type: item.type,
        value: item.total,
        fee: item.fee,
        category: item.category,
        userName: item.user_name,
        date: item.date,
        description: item.description,
        items: item.items.map((prod) => ({
          id: prod.id,
          name: prod.name,
          quantity: prod.quantity,
          price: prod.price
        }))
      }));

      setTransactions(historyData);
    } catch (error) {
      console.log('Erro ao carregar os dados do histórico:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar o histórico do banco de dados.'
      );
    } finally {
      setIsFetching(false);
    }
  }

  // Função para alternar os filtros do histórico geral
  const toggleFilter = (filter: transactionType) => {
    setFilters((prev) => {
      // Se o filtro já existe, remove (a menos que seja o último, para não ficar vazio)
      if (prev.includes(filter)) {
        return prev.length > 1 ? prev.filter((f) => f !== filter) : prev;
      }
      // Se não existe, adiciona
      return [...prev, filter];
    });
    // Reseta o card expandido ao mudar o filtro
    setExpandedId(null);
  };

  const filteredHistory = transactions.filter((item) => {
    // Se item.type for undefined, o includes retornará false
    return item.type ? filters.includes(item.type) : false;
  });

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 24
      }}
      edges={['top']}
    >
      <StatusBar barStyle="dark-content" />
      <PageHeader
        title1="Meu"
        title2="Caixa"
        subtitle="Confira os pagamentos via Pix e Históricos geral."
        gradient={[colors.green[400], colors.green[500]]}
      />

      {/* SELETOR DE ABAS */}
      <View
        style={{
          flexDirection: 'row',
          padding: 4,
          marginTop: 20
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab('pix')}
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor:
              activeTab === 'pix' ? colors.green[500] : colors.gray[400]
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.medium,

              color: activeTab === 'pix' ? colors.green[500] : colors.gray[400]
            }}
          >
            Meu Pix
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor:
              activeTab === 'history' ? colors.green[500] : colors.gray[400]
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.medium,
              color:
                activeTab === 'history' ? colors.green[500] : colors.gray[400]
            }}
          >
            Histórico Geral
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 8 }}>
        {activeTab === 'pix' ? (
          <View style={{ flex: 1, gap: 20 }}>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View
                style={{
                  backgroundColor: colors.white,
                  padding: 12,
                  borderRadius: 6,
                  // Se quiser aquela sombra suave:
                  elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8
                }}
              >
                <QRCode
                  value="00020126360014BR.GOV.BCB.PIX0114+55869996524335204000053039865802BR5925Antonia Selma dos Anjos F6009SAO PAULO62140510yuTWrb89oi6304B508"
                  size={180}
                  color={colors.black}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontFamily: fontFamily.regular,
                  color: colors.gray[500],
                  marginTop: 16,
                  includeFontPadding: false
                }}
              >
                Escaneie o QR Code acima para receber o pagamento via Pix ou
                copie o código abaixo:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.gray[150],
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.green[500],
                  alignItems: 'center',
                  marginTop: 12
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    color: colors.black,
                    fontSize: 14,
                    fontFamily: fontFamily.regular,
                    includeFontPadding: false
                  }}
                >
                  00020101021226850014br.gov.bcb.pix...
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    /* Lógica de copiar */
                  }}
                >
                  <MaterialIcons
                    name="content-copy"
                    size={20}
                    color={colors.green[500]}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 15,
                    fontFamily: fontFamily.regular,
                    includeFontPadding: false
                  }}
                >
                  Últimas{' '}
                  <Text
                    style={{
                      color: colors.green[500]
                    }}
                  >
                    Transações Pix
                  </Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    /* Lógica para atualizar */
                  }}
                >
                  <MaterialIcons
                    name="cached"
                    size={24}
                    color={colors.green[500]}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                {/* <List
                  data={pixTransactions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <HistoryCard
                      isPix
                      data={item}
                      // Ao clicar, ativamos o estado para exibir os produtos
                      onPress={() => console.log('teste')}
                    />
                  )}
                  snapToInterval={100}
                  decelerationRate="fast"
                  emptyMessage=""
                  containerStyle={{ flex: 1 }}
                /> */}
              </View>
            </View>
          </View>
        ) : (
          /* VISÃO DO HISTÓRICO GERAL */
          <View style={{ flex: 1 }}>
            {/* SELETOR Do filtro */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.gray[150],
                borderRadius: 12,
                padding: 4,
                gap: 5,
                marginBottom: 8
              }}
            >
              {/* FILTRO VENDAS */}
              <ButtonToggle
                text="Vendas"
                type="sale"
                icon="shopping-bag"
                filters={filters}
                onPress={() => toggleFilter('sale')}
              />
              {/* FILTRO RETIRADAS */}
              <ButtonToggle
                text="Retiradas"
                type="withdrawal"
                icon="inventory"
                filters={filters}
                onPress={() => toggleFilter('withdrawal')}
              />
            </View>
            <List
              data={filteredHistory} // lista com vendas e retiradas filtrado
              renderItem={({ item }) => (
                <HistoryCard
                  data={item}
                  isOpen={expandedId === item.id}
                  // Ao clicar, o pai decide se abre o novo ou fecha o que já estava aberto
                  onPress={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  onDeleteSuccess={loadHistory}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 120
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
