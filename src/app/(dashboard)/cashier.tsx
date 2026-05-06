import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QRCode from 'react-native-qrcode-svg';
import { MaterialIcons } from '@expo/vector-icons';

import { List } from '@/components/List';
import { HistoryCard } from '@/components/HistoryCard';
import { generalHistory, pixTransactions } from '@/database/historyStorage';
import { useState } from 'react';
import { transactionCategoryType } from './cart';
import { ButtonToggle } from '@/components/ButtonToggle';

export default function Cashier() {
  const [activeTab, setActiveTab] = useState<'pix' | 'history'>('pix');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<transactionCategoryType[]>(['sale']);

  // 2. Função para alternar os filtros do histórico geral
  const toggleFilter = (filter: transactionCategoryType) => {
    setFilters((prev) => {
      // Se o filtro já existe, remove (a menos que seja o último, para não ficar vazio)
      if (prev.includes(filter)) {
        return prev.length > 1 ? prev.filter((f) => f !== filter) : prev;
      }
      // Se não existe, adiciona
      return [...prev, filter];
    });
    // Reseta o card expandido ao mudar o filtro evita bugs visuais
    setExpandedId(null);
  };

  const filteredHistory = generalHistory.filter((item) => {
    // Se item.category for undefined, o includes retornará false
    return item.category ? filters.includes(item.category) : false;
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 24
      }}
      edges={['top', 'bottom']}
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

      <View style={{ flex: 1, marginTop: 20 }}>
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
            <View style={{ flex: 1, marginTop: 12 }}>
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
                  Últimas
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
              <View style={{ flex: 1, marginBottom: 90 }}>
                <List
                  data={pixTransactions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <HistoryCard
                      data={item}
                      // Ao clicar, ativamos o estado para exibir os produtos
                      onPress={() => console.log('teste')}
                    />
                  )}
                  snapToInterval={100}
                  decelerationRate="fast"
                  emptyMessage=""
                  containerStyle={{ flex: 1 }}
                />
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
              data={filteredHistory} // Aquela lista com vendas e retiradas filtrado
              renderItem={({ item }) => (
                <HistoryCard
                  data={{ ...item, type: 'general' }}
                  isOpen={expandedId === item.id}
                  // Ao clicar, o pai decide se abre o novo ou fecha o que já estava aberto
                  onPress={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
