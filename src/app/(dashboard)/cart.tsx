import { CartSummary } from '@/components/CartSummary';
import { CategoryCard } from '@/components/CategoryCard';
import { EmptyComponent } from '@/components/EmptyComponent';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { List } from '@/components/List';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { products as allProducts } from '@/database/storage';
import { useCartStore } from '@/store/useCartStore';
import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProductsCart = {
  cartId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    qtdEstoque: number;
    qtdVendidos: number;
    imageUrl: string;
    color: string;
  };
};

export default function Cart() {
  const [transactionType, setTransactionType] = useState<'sale' | 'withdrawal'>(
    'sale'
  );

  const [saleMethod, setSaleMethod] = useState('money');
  const [withdrawalMethod, setWithdrawalMethod] = useState('avaria');
  const [description, setDescription] = useState('');

  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal(allProducts);

  // Lógica para decidir qual método e qual função de alteração enviar
  const currentMethod =
    transactionType === 'sale' ? saleMethod : withdrawalMethod;
  const currentChangeMethod =
    transactionType === 'sale' ? setSaleMethod : setWithdrawalMethod;

  // Fazemos o merge com os detalhes dos produtos
  const cartWithDetails: ProductsCart = items.map((cartItem) => {
    const product = allProducts.find((p) => p.id === cartItem.productId);

    return {
      cartId: cartItem.id, // ID da entrada no carrinho
      quantity: cartItem.quantity,
      product: product // O objeto do produto inteiro aqui dentro
    };
  });

  async function RemoveProduct(id: string) {
    try {
      Alert.alert(
        'Remover',
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
            data={cartWithDetails}
            keyExtractor={(item) => item.cartId}
            ListEmptyComponent={
              <EmptyComponent
                text="Seu carrinho está vazio"
                subtext="Nenhum item encontrado no seu carrinho"
                icon="cart-outline"
                color={
                  transactionType === 'withdrawal'
                    ? colors.blue[500]
                    : colors.green[500]
                }
              />
            }
            renderItem={({ item }) =>
              item.product ? (
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
              ) : null
            }
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
            total={total}
          />
        </View>
      </KeyboardWrapper>
    </SafeAreaView>
  );
}
