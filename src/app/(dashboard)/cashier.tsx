import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { List } from '@/components/List';
import { HistoryCard, HistoryProps } from '@/components/HistoryCard';

import { useCallback, useState } from 'react';
import { transactionType } from './cart';
import { ButtonToggle } from '@/components/ButtonToggle';
import { useTransactionDatabase } from '@/database/useTransactionDatabase';
import { useFocusEffect } from 'expo-router';

import { EmptyComponent } from '@/components/EmptyComponent';
import { fetchGatewayPaymentsExtract } from '@/utils/fetchGatewayPaymentsExtract';
import ManualPixGenerator from '@/components/ManualPixGenerator';

// Verificação dinâmica baseada no Gateway
const GATEWAY_TOKEN = process.env.EXPO_PUBLIC_MERCADO_PAGO_TOKEN || '';
const hasToken = GATEWAY_TOKEN.trim().length > 0;

export default function Cashier() {
  const [activeTab, setActiveTab] = useState<'pix' | 'history'>('history');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<transactionType[]>(['sale']);

  const [transactions, setTransactions] = useState<HistoryProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  //estados dedicados exclusivamente para gerenciar o Pix
  const [pixTransactions, setPixTransactions] = useState<any[]>([]);
  const [isFetchingPix, setIsFetchingPix] = useState(false);
  const [pixError, setPixError] = useState(false);

  const transactionDatabase = useTransactionDatabase();
  const insets = useSafeAreaInsets();

  // Função para carregar os dados de transações
  async function loadHistory() {
    try {
      setIsFetching(true);
      const data = await transactionDatabase.getTransactions();

      const historyData: HistoryProps[] = data.map((item) => ({
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

  // Função segura para buscar os dados do Mercado Pago
  async function loadPixHistory() {
    try {
      setIsFetchingPix(true);
      setPixError(false); // 🟢 Reseta o erro antes de tentar buscar

      const apiResults = await fetchGatewayPaymentsExtract();

      console.log(
        '--- DADOS CRUS DO GATEWAY ---',
        JSON.stringify(apiResults.slice(0, 2), null, 2)
      );

      // Se a API retornar vazio por erro interno do utilitário (ex: token inválido/expirado)
      // você pode opcionalmente disparar o erro aqui, mas vamos tratar o catch do Axios:
      const formattedPix = apiResults.map((payment: any) => ({
        id: String(payment.id),
        type: 'sale',
        value: payment.transaction_amount,
        category: 'Pix',
        status: payment.status,
        userName:
          payment.payer?.first_name || payment.payer?.email || 'Cliente Pix',
        date: payment.date_created,
        description: `Ref: ${payment.id} | ${payment.status_detail} | Comprador: ${payment.payer?.email || 'N/A'}`,
        items: []
      }));

      setPixTransactions(formattedPix);
    } catch (error) {
      console.log('Erro ao carregar o extrato Pix:', error);
      setPixError(true); // Ativa o estado de erro se a requisição falhar
    } finally {
      setIsFetchingPix(false);
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

      //  Só busca na API externa se de fato houver um token configurado
      if (hasToken) {
        loadPixHistory();
      } else {
        setPixTransactions([]);
      }
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
            <ManualPixGenerator />
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
                {hasToken && (
                  <TouchableOpacity onPress={loadPixHistory}>
                    <MaterialIcons
                      name="cached"
                      size={24}
                      color={colors.green[500]}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: 60 }}>
                {isFetchingPix ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.green[500]}
                    style={{ marginTop: 20 }}
                  />
                ) : (
                  <List
                    data={pixTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <HistoryCard
                        isPix
                        data={item}
                        isOpen={expandedId === item.id}
                        onPress={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                        onDeleteSuccess={() => {}}
                      />
                    )}
                    snapToInterval={100}
                    decelerationRate="fast"
                    ListEmptyComponent={
                      <EmptyComponent
                        text={
                          !hasToken
                            ? 'Integração Desabilitada'
                            : pixError
                              ? 'Erro de Conexão'
                              : 'Nenhum Pix recente'
                        }
                        subtext={
                          !hasToken
                            ? 'A sincronização automática de pagamentos não está ativa nesta versão.'
                            : pixError
                              ? 'Não foi possível atualizar o extrato digital. Verifique sua internet ou tente novamente.'
                              : 'Nenhum pagamento digital recente foi identificado para este caixa.'
                        }
                        icon={
                          !hasToken
                            ? 'api-off'
                            : pixError
                              ? 'wifi-off'
                              : 'currency-usd-off'
                        }
                        size={50}
                        color={pixError ? colors.gray[400] : colors.green[400]}
                      />
                    }
                    containerStyle={{ flex: 1 }}
                    contentContainerStyle={{
                      paddingBottom: insets.bottom + 20
                    }}
                  />
                )}
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
              ListEmptyComponent={
                <EmptyComponent
                  text={
                    filters.includes('withdrawal')
                      ? 'Nenhuma Retirada registrada'
                      : 'Nenhuma Venda registrada'
                  }
                  subtext={
                    filters.includes('withdrawal')
                      ? 'As retiradas do estoque aparecerão aqui.'
                      : 'As vendas efetuadas aparecerão aqui.'
                  }
                  icon={
                    filters.includes('withdrawal')
                      ? 'archive-arrow-down-outline'
                      : 'receipt-text-outline'
                  }
                  color={
                    filters.includes('withdrawal')
                      ? colors.blue[500]
                      : colors.green[500]
                  }
                />
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
