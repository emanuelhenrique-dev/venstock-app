import { CartSummary } from '@/components/CartSummary';
import { CategoryCard } from '@/components/CategoryCard';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { List } from '@/components/List';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/database/storage';
import { colors, fontFamily } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart() {
  const [transactionType, setTransactionType] = useState<'sale' | 'withdrawal'>(
    'sale'
  );

  const [saleMethod, setSaleMethod] = useState('money');
  const [withdrawalMethod, setWithdrawalMethod] = useState('avaria');
  const [description, setDescription] = useState('');

  // Lógica para decidir qual método e qual função de alteração enviar
  const currentMethod =
    transactionType === 'sale' ? saleMethod : withdrawalMethod;
  const currentChangeMethod =
    transactionType === 'sale' ? setSaleMethod : setWithdrawalMethod;

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
        title1="Minhas"
        title2={transactionType === 'sale' ? 'Vendas' : 'Saídas'}
        subtitle={
          transactionType === 'sale'
            ? 'Confira os itens antes de realizar a venda.'
            : 'Confira os itens antes de finalizar a saída.'
        }
        gradient={
          transactionType === 'sale'
            ? [colors.green[400], colors.green[500]]
            : [colors.blue[400], colors.blue[500]]
        }
      />
      <KeyboardWrapper scrollView={false}>
        <View style={{ flex: 1, marginTop: 20, gap: 20 }}>
          <List
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                data={item}
                variant={transactionType}
                leftAction={{
                  icon: 'delete',
                  onOpen: () => console.log(item.id)
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4 // Espaçamento entre os elementos
                  }}
                >
                  <MaterialIcons
                    name={transactionType === 'sale' ? 'sell' : 'inventory'}
                    size={16}
                    color={
                      transactionType === 'sale'
                        ? colors.green[400]
                        : colors.blue[400]
                    }
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        transactionType === 'sale'
                          ? colors.green[500]
                          : colors.blue[500],
                      fontFamily: fontFamily.regular,
                      includeFontPadding: false
                    }}
                  >
                    {transactionType === 'sale' ? 'R$ 12,60 x 7' : '70 - 7'}
                  </Text>

                  <MaterialIcons
                    name="arrow-forward"
                    size={14}
                    color={
                      transactionType === 'sale'
                        ? colors.green[500]
                        : colors.blue[500]
                    }
                    style={{ marginBottom: -1 }} // Ajuste fino se a fonte ainda "puxar" para baixo
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        transactionType === 'sale'
                          ? colors.green[500]
                          : colors.blue[500],
                      fontFamily: fontFamily.bold,
                      includeFontPadding: false
                    }}
                  >
                    {transactionType === 'sale' ? 'R$ 88,20' : '63 em estoque'}
                  </Text>
                </View>
              </ProductCard>
            )}
            containerStyle={{ flex: 1 }}
            snapToInterval={100}
          />
          <CartSummary
            type={transactionType}
            onChangeType={setTransactionType}
            method={currentMethod}
            onChangeMethod={currentChangeMethod}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </KeyboardWrapper>
    </SafeAreaView>
  );
}
