import { CartSummary } from '@/components/CartSummary';
import { CategoryCard } from '@/components/CategoryCard';
import { EmptyComponent } from '@/components/EmptyComponent';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { List } from '@/components/List';
import { Loading } from '@/components/Loading';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardProps } from '@/components/ProductsListOverlay';
import { products as allProducts } from '@/database/storage';
import { useCartStore } from '@/store/useCartStore';
import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface CartItemDetailed {
  cartId: string;
  quantity: number;
  product: ProductCardProps;
}

export default function Cart() {
  const [transactionType, setTransactionType] = useState<'sale' | 'withdrawal'>(
    'sale'
  );

  const [saleMethod, setSaleMethod] = useState('money');
  const [withdrawalMethod, setWithdrawalMethod] = useState('avaria');
  const [description, setDescription] = useState('');

  const [isFetching, setIsFetching] = useState(true);
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal(allProducts);

  // Lógica para decidir qual método e qual função de alteração enviar
  const currentMethod =
    transactionType === 'sale' ? saleMethod : withdrawalMethod;
  const currentChangeMethod =
    transactionType === 'sale' ? setSaleMethod : setWithdrawalMethod;

  // Fazemos o merge com os detalhes dos produtos
  const cartWithDetails = useMemo(() => {
    return items
      .map((cartItem) => {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        if (!product) return null;

        return {
          cartId: cartItem.id,
          quantity: cartItem.quantity,
          product: product
        } as CartItemDetailed;
      })
      .filter((item): item is CartItemDetailed => item !== null);
  }, [items]); // Só recalcula se os itens do carrinho mudarem

  async function RemoveProduct(id: string) {
    try {
      Alert.alert(
        'Remover do carrinho',
        'Realmente deseja remover esse produto do seu carrinho?',
        [
          {
            text: 'não',
            style: 'cancel',
            onPress: () => {
              console.warn('Cancelando Remover produto', id);
            }
          },
          {
            text: 'sim',
            style: 'destructive',
            onPress: () => {
              console.warn('editar produto', id);
              removeItem(id);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o Produto');
      console.log(error);
    }
  }

  async function loadResources() {
    try {
      setIsFetching(true);
      // Simulando delay de leitura de banco de dados
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar o carrinho');
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

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
          {!isFetching ? (
            <List
              data={cartWithDetails}
              keyExtractor={(item) => item.cartId}
              ListEmptyComponent={
                <EmptyComponent
                  text="Seu carrinho está vazio"
                  subtext="Adicione produtos ao seu carrinho"
                  icon={
                    transactionType === 'withdrawal'
                      ? 'archive-arrow-down-outline'
                      : 'cart-outline'
                  }
                  color={
                    transactionType === 'withdrawal'
                      ? colors.blue[500]
                      : colors.green[500]
                  }
                />
              }
              renderItem={({ item }) => (
                <ProductCard
                  data={item.product}
                  quantity={item.quantity}
                  onChangeQuantity={(val) => updateQuantity(item.cartId, val)}
                  variant={transactionType}
                  leftAction={{
                    icon: 'delete',
                    onOpen: () => RemoveProduct(item.cartId)
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
                      {transactionType === 'sale'
                        ? `${numberToCurrency(item.product.price)} x ${item.quantity}`
                        : `${item.product.qtdEstoque} - ${item.quantity}`}
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
                      {transactionType === 'sale'
                        ? `${numberToCurrency(item.product.price * item.quantity)}`
                        : `${item.product.qtdEstoque - item.quantity} em estoque`}
                    </Text>
                  </View>
                </ProductCard>
              )}
              containerStyle={{ flex: 1 }}
              snapToInterval={100}
            />
          ) : (
            <Loading width={300} height={300} />
          )}

          <CartSummary
            type={transactionType}
            onChangeType={setTransactionType}
            method={currentMethod}
            onChangeMethod={currentChangeMethod}
            value={description}
            onChangeText={setDescription}
            total={total}
          />
        </View>
      </KeyboardWrapper>
    </SafeAreaView>
  );
}
