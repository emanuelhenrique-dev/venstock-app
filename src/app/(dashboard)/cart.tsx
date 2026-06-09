import { CartSummary } from '@/components/CartSummary';
import { EmptyComponent } from '@/components/EmptyComponent';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { List } from '@/components/List';
import { Loading } from '@/components/Loading';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardProps } from '@/components/ProductsListOverlay';

import { useProductDatabase } from '@/database/useProductDatabase';
import {
  type TransactionItem,
  useTransactionDatabase
} from '@/database/useTransactionDatabase';

import { useCartStore } from '@/store/useCartStore';

import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type transactionType = 'sale' | 'withdrawal';
export interface CartItemDetailed {
  cartId: string;
  quantity: number;
  product: ProductCardProps;
}

export default function Cart() {
  const [transactionType, setTransactionType] =
    useState<transactionType>('sale');

  const [saleMethod, setSaleMethod] = useState('money');
  const [withdrawalMethod, setWithdrawalMethod] = useState('avaria');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState(0);

  const [isFetching, setIsFetching] = useState(true);
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  const productDatabase = useProductDatabase();
  const transactionDatabase = useTransactionDatabase();
  const [dbProducts, setDbProducts] = useState<ProductCardProps[]>([]); // Novo estado

  // Lógica para decidir qual método e qual função de alteração enviar
  const currentMethod =
    transactionType === 'sale' ? saleMethod : withdrawalMethod;
  const currentChangeMethod =
    transactionType === 'sale' ? setSaleMethod : setWithdrawalMethod;

  // Fazemos o merge com os detalhes dos produtos
  const cartWithDetails = useMemo(() => {
    return items
      .map((cartItem) => {
        const product = dbProducts.find(
          (p) => String(p.id) === String(cartItem.productId)
        );
        if (!product) return null;

        return {
          cartId: cartItem.id,
          quantity: cartItem.quantity,
          product: product
        } as CartItemDetailed;
      })
      .filter((item): item is CartItemDetailed => item !== null); // Remove itens nulos da lista (caso algum produto do carrinho tenha sido deletado do banco) e garante a tipagem correta para o TypeScript
  }, [items, dbProducts]);

  // Preço total dos produtos
  const total = useMemo(() => {
    return cartWithDetails.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [cartWithDetails]);

  // Descobre a lista de IDs de produtos que estão com estoque zerado no carrinho
  const outOfStockProductIds = useMemo(() => {
    return cartWithDetails
      .filter((item) => item.product.qtdEstoque <= 0)
      .map((item) => String(item.product.id));
  }, [cartWithDetails]);

  async function handleFinishOrder() {
    if (cartWithDetails.length === 0) {
      Alert.alert('Aviso', 'Seu carrinho está vazio.');
      return;
    }

    try {
      // Busca os dados mais recentes do banco bem na hora do clique
      const response = await productDatabase.getAll();
      const formattedProducts = response.map((p) => ({
        ...p,
        id: String(p.id)
      })) as unknown as ProductCardProps[];

      // 2. Roda a nossa validação. Se ela retornar 'true', significa que o carrinho mudou
      const cartWasCorrected = validateAndAdjustCartStocks(formattedProducts);

      if (cartWasCorrected) {
        // Para a execução aqui! O usuário já recebeu os Alertas
        // e o carrinho já se autocorrigiu na tela, agora ele precisa clicar em finalizar de novo.
        return;
      }

      const databaseItems: TransactionItem[] = cartWithDetails.map((item) => ({
        id: Number(item.product.id),
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      //  Salva a transação e seus itens e atualiza os estoques
      await transactionDatabase.CreateTransaction({
        type: transactionType,
        category: currentMethod as any,
        description: description.trim() || undefined,
        fee: fee,
        total: total,
        items: databaseItems
      });

      // Se chegou aqui, o estoque está 100% verificado e seguro para prosseguir!
      if (transactionType === 'sale') {
        Alert.alert('Sucesso', 'Venda realizada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Retirada registrada com sucesso!');
      }

      // RESET
      setDescription('');
      setFee(0);
      clearCart();
      await loadResources();
    } catch (error) {
      console.log('Erro ao finalizar pedido:', error);
      Alert.alert('Erro', 'Não foi possível concluir a transação.');
    }
  }

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

  // Função para auditar e corrigir o estoque do carrinho
  function validateAndAdjustCartStocks(formattedProducts: ProductCardProps[]) {
    const currentCartItems = useCartStore.getState().items;
    let hasChanges = false; // 🟢 Controla se alguma alteração foi feita

    currentCartItems.forEach((cartItem) => {
      const dbProduct = formattedProducts.find(
        (p) => String(p.id) === String(cartItem.productId)
      );

      if (dbProduct) {
        //CASO 1: O estoque zerou completamente (Produto esgotado)
        if (dbProduct.qtdEstoque <= 0) {
          removeItem(cartItem.id); // Remove do carrinho automaticamente
          hasChanges = true;

          Alert.alert(
            'Item Removido',
            `O produto "${dbProduct.name}" foi removido do seu carrinho pois não há mais estoque disponível.`
          );
        }
        // CASO 2: O estoque apenas diminuiu (Quantidade maior que o disponível)
        else if (cartItem.quantity > dbProduct.qtdEstoque) {
          updateQuantity(
            cartItem.id,
            dbProduct.qtdEstoque,
            dbProduct.qtdEstoque
          );
          hasChanges = true;

          Alert.alert(
            'Estoque Atualizado',
            `A quantidade de "${dbProduct.name}" foi reajustada para o máximo disponível: ${dbProduct.qtdEstoque}`
          );
        }
      }
    });
    // Retorna true se alterou algo
    return hasChanges;
  }

  async function loadResources() {
    try {
      setIsFetching(true);

      const response = await productDatabase.getAll();

      // Converte o ID do banco para String e força a tipagem para o formato aceito pelos componentes visuais da tela
      const formattedProducts = response.map((p) => ({
        ...p,
        id: String(p.id) // Garante que o ID case com o tipo da Store
      })) as unknown as ProductCardProps[];

      setDbProducts(formattedProducts);

      // validação
      validateAndAdjustCartStocks(formattedProducts);
    } catch (e) {
      console.log('Erro ao carregar banco no carrinho:', e);
      Alert.alert('Erro', 'Não foi possível carregar os produtos do carrinho.');
    } finally {
      setIsFetching(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadResources();
    }, [])
  );

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
                <View>
                  <ProductCard
                    data={item.product}
                    quantity={item.quantity}
                    onChangeQuantity={(val) =>
                      updateQuantity(item.cartId, val, item.product.qtdEstoque)
                    }
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
                          fontSize: 10,
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
                          fontSize: 11,
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
                </View>
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
            fee={fee}
            onChangeFee={setFee}
            onConfirm={handleFinishOrder}
            disabled={isFetching}
          />
        </View>
      </KeyboardWrapper>
    </SafeAreaView>
  );
}
