import { Chart } from '@/components/Chart';
import { PageHeader } from '@/components/PageHeader';

import { colors, fontFamily } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import { getStartDateForPeriod } from '@/utils/getStartDateForPeriod';
import { useTransactionDatabase } from '@/database/useTransactionDatabase';
import { Loading } from '@/components/Loading';
import { HistoryProps } from '@/components/HistoryCard';

export type PeriodType =
  | '7days'
  | '14days'
  | '30days'
  | '2months'
  | '6months'
  | '1year'
  | 'all';

interface PeriodOption {
  key: PeriodType;
  label: string;
}

export default function Statistics() {
  const { width } = useWindowDimensions();

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>({
    key: '30days',
    label: '30 dias'
  });

  // Estados para os dados reais da tela
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [withdrawalsCount, setWithdrawalsCount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const transactionDatabase = useTransactionDatabase();

  const PERIODS: PeriodOption[] = [
    { key: '7days', label: '7 dias' },
    { key: '14days', label: '14 dias' },
    { key: '30days', label: '30 dias' },
    { key: '2months', label: '2 meses' },
    { key: '6months', label: '6 meses' },
    { key: '1year', label: '1 ano' },
    { key: 'all', label: 'Tudo' }
  ];

  const getSubtitleText = () => {
    if (selectedPeriod.key === 'all') {
      return 'Analise o desempenho do seu negócio de todo o período.';
    }
    if (selectedPeriod.key === '1year') {
      return 'Analise o desempenho do seu negócio no último ano.';
    }
    return `Analise o desempenho do seu negócio nos últimos ${selectedPeriod.label}.`;
  };

  function processTransactionsData(
    transactions: HistoryProps[],
    periodKey: PeriodType
  ) {
    const startDate = getStartDateForPeriod(periodKey);

    const filtered = transactions.filter((tx) => {
      if (!startDate) return true;
      return new Date(tx.date) >= startDate;
    });

    let revenue = 0;
    let sales = 0;
    let withdrawals = 0;

    const groupedData: Record<
      string,
      { value: number; quantity: number; rawDate: Date }
    > = {};

    filtered.forEach((tx) => {
      const txDate = new Date(tx.date);

      const label =
        periodKey === '1year' || periodKey === '6months'
          ? txDate.toLocaleDateString('pt-BR', { month: 'short' })
          : txDate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit'
            });

      const totalQty =
        tx.items?.reduce((acc, current) => acc + current.quantity, 0) || 0;

      if (tx.type === 'sale') {
        sales += totalQty;
        revenue += tx.value || 0;

        if (!groupedData[label]) {
          // Guardamos também o objeto Date puro (rawDate) para conseguir ordenar depois
          groupedData[label] = { value: 0, quantity: 0, rawDate: txDate };
        }

        groupedData[label].value += tx.value || 0;
        groupedData[label].quantity += totalQty;
      } else if (tx.type === 'withdrawal') {
        withdrawals += totalQty;
      }
    });

    // 🌟 MAPEAR E ORDENAR CRONOLOGICAMENTE (Do mais antigo para o mais recente)
    const chartData = Object.entries(groupedData)
      .map(([label, data]) => ({
        label,
        value: data.value,
        quantity: data.quantity,
        rawDate: data.rawDate // passa o Date puro temporariamente
      }))
      // Ordena garantindo que a data mais nova (ex: 08/07) fique por último no array
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      // Remove o rawDate para limpar o objeto final enviado ao gráfico
      .map(({ rawDate, ...rest }) => rest);

    return { revenue, sales, withdrawals, chartData };
  }

  async function loadStatisticsData() {
    try {
      const data = await transactionDatabase.getTransactions();

      const historyData: HistoryProps[] = data.map((item) => ({
        id: item.id,
        type: item.type,
        value: item.total, // joga o total para a chave 'value'
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

      console.log('Dados brutos do banco de dados:', historyData);

      // 🌟 Passa a lista limpa diretamente para a função externa de cálculo
      const { revenue, sales, withdrawals, chartData } =
        processTransactionsData(historyData, selectedPeriod.key);

      console.log('Dados processados:', {
        revenue,
        sales,
        withdrawals,
        chartData
      });

      setTotalRevenue(revenue);
      setSalesCount(sales);
      setWithdrawalsCount(withdrawals);
      setChartData(chartData);
    } catch (error) {
      console.log('Erro ao carregar os dados de estatísticas:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do painel.');
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    loadStatisticsData();
  }, [selectedPeriod.key]);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,

          paddingTop: 22
        }}
        edges={['bottom']}
      >
        <View>
          <PageHeader
            title1="Minhas"
            title2="Estatísticas"
            subtitle={getSubtitleText()}
            gradient={[colors.green[400], colors.green[500]]}
            back
            style={{ paddingHorizontal: 24, paddingBottom: 16 }}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              gap: 8,
              height: 40,
              alignItems: 'center'
            }}
          >
            {PERIODS.map((period) => {
              const isActive = selectedPeriod.key === period.key;

              return (
                <TouchableOpacity
                  key={period.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPeriod(period)}
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 14, // Formato pílula
                    backgroundColor: isActive ? colors.green[500] : '#F3F4F6', // Troca a cor de fundo reativamente
                    borderWidth: 1,
                    borderColor: isActive ? colors.green[500] : '#E5E7EB'
                  }}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color={isActive ? colors.white : colors.gray[200]}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: isActive
                        ? fontFamily.bold
                        : fontFamily.medium,
                      color: isActive ? colors.white : '#4B5563', // Texto branco se ativo, cinza se inativo
                      includeFontPadding: false
                    }}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {isFetching ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -80
            }}
          >
            <Loading height={400} width={400} />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              marginTop: 10,
              gap: 10,
              paddingHorizontal: 24
            }}
          >
            {/* CARDS DE RESUMO FINANCEIRO */}
            <View style={{ marginTop: 16, gap: 8 }}>
              {/* CARD MASTER: FATURAMENTO */}
              <View
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: fontFamily.medium,
                    color: '#6B7280'
                  }}
                >
                  Faturamento Estimado
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: fontFamily.bold,
                    color: '#111827',
                    marginTop: 4,
                    includeFontPadding: false
                  }}
                >
                  R$ {totalRevenue.toFixed(2).replace('.', ',')}
                </Text>
              </View>

              {/* FILA COM VENDAS E RETIRADAS LADO A LADO */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* CARD: VENDAS */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F9FAFB',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#E5E7EB'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fontFamily.medium,
                      color: '#6B7280'
                    }}
                  >
                    Vendas Realizadas
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fontFamily.bold,
                      color: colors.green[500], // Combinando com a identidade verde da tela
                      marginTop: 4,
                      includeFontPadding: false
                    }}
                  >
                    {salesCount} un.
                  </Text>
                </View>

                {/* CARD: RETIRADAS */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#F9FAFB',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#E5E7EB'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: fontFamily.medium,
                      color: '#6B7280'
                    }}
                  >
                    Retiradas / Ajustes
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fontFamily.bold,
                      color: colors.blue[500], // Vermelho para chamar atenção para saídas que não geraram caixa
                      marginTop: 4,
                      includeFontPadding: false
                    }}
                  >
                    {withdrawalsCount} un.
                  </Text>
                </View>
              </View>
            </View>
            <Chart data={chartData} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
