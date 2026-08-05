import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ProductResponse,
  useProductDatabase
} from '@/database/useProductDatabase';
import { Loading } from '@/components/Loading';
import { CustomImage } from '@/components/CustomImage';
import { MaterialIcons } from '@expo/vector-icons';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '@/store/useCartStore';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const { items, addItem, updateQuantity, removeItem, clearCart } =
    useCartStore();

  // Busca o item atual no carrinho
  const cartItem = items.find((item) => item.productId === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const productDatabase = useProductDatabase();

  function handleEditProduct() {
    if (!product) return;

    const categoryNameEncoded = encodeURIComponent(product.category_name ?? '');

    router.navigate(
      `/new-product/?id=${product.id}&categoryId=${product.category_id}&categoryName=${categoryNameEncoded}`
    );
  }

  function handleAdd() {
    if (!product) return;

    if (cartItem) {
      if (quantity < product.qtdEstoque) {
        updateQuantity(cartItem.id, quantity + 1, product.qtdEstoque);
      }
    } else {
      addItem({
        id: String(product.id),
        productId: String(product.id),
        quantity: 1
      });
    }
  }

  function handleRemove() {
    if (!product || !cartItem) return;

    if (quantity > 1) {
      updateQuantity(cartItem.id, quantity - 1, product.qtdEstoque);
    } else {
      removeItem(cartItem.id);
    }
  }

  async function fetchProductDetails(
    productId: number
  ): Promise<ProductResponse | null> {
    try {
      console.log(await productDatabase.show(productId));
      return await productDatabase.show(productId);
    } catch (error) {
      console.log(`Erro ao buscar o produto com ID ${productId}:`, error);
      return null;
    }
  }

  async function fetchData() {
    if (!id) {
      Alert.alert('Erro', 'Identificador do produto não encontrado.');
      router.back();
      return;
    }

    try {
      setLoading(true);
      const data = await fetchProductDetails(Number(id));

      setProduct(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados da tela.');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id])
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
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
            title1="Detalhes do"
            title2="Produto"
            subtitle={product?.name || 'Informações do item'}
            gradient={[colors.green[400], colors.green[500]]}
            back
            button={{
              icon: 'edit',
              onPress: () => {
                handleEditProduct();
              }
            }}
            style={{ paddingHorizontal: 24, paddingBottom: 16 }}
          />
        </View>

        {loading ? (
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
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ position: 'relative' }}>
                <CustomImage
                  image={product?.imageUrl || null}
                  size={200}
                  color={product?.color || colors.green[500]}
                  variant="product"
                />

                <TouchableOpacity
                  onPress={() =>
                    console.log('Cliquei na em adicionar produto no estoque')
                  }
                  activeOpacity={0.8}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: product
                      ? product.color
                      : colors.green[500],
                    width: 61,
                    height: 61,
                    borderRadius: 170,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <MaterialIcons
                    name="add"
                    size={32}
                    color={
                      product?.color?.toLowerCase() !== '#ffffff'
                        ? colors.white
                        : colors.black
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1, position: 'relative' }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 100,
                  gap: 10,
                  paddingTop: 16
                }}
              >
                {/* Nome do Produto */}
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: 16,
                      color: colors.black
                    }}
                  >
                    Nome do Produto :
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 16,
                      color: colors.black
                    }}
                  >
                    {product?.name || 'Desconhecido'}
                  </Text>
                </View>

                {/* Categoria */}
                <View style={{ gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: 16,
                      color: colors.black
                    }}
                  >
                    Categoria :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10
                    }}
                  >
                    {/* Ícone/Imagem da Categoria */}
                    <CustomImage
                      image={product?.category_image || null}
                      size={30}
                      color={product?.category_color ?? colors.green[500]}
                      variant="category"
                    />
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 16,
                        color: colors.black,
                        includeFontPadding: false
                      }}
                    >
                      {product?.category_name || 'Sem Categoria'}
                    </Text>
                  </View>
                </View>

                {/* Descrição */}
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: 16,
                      color: colors.black
                    }}
                  >
                    Descrição :
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 16,
                      color: colors.black,
                      lineHeight: 22
                    }}
                  >
                    {product?.description || 'Nenhuma descrição informada.'}
                  </Text>
                </View>

                {/* Código do Produto / identificador extra */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Código do Produto (Lado Esquerdo - 50%) */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      Codigo do Produto :
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      {product?.codBar || 'Nenhum Registrado'}
                    </Text>
                  </View>

                  {/* Identificador Extra (Lado Direito - 50%) */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      Identificador extra :
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      {product?.identifier ?? 'Nenhum'}
                    </Text>
                  </View>
                </View>

                {/* Grid de Estoques (Divididos 50/50) */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Estoque Atual (Lado Esquerdo - 50%) */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      Estoque atual :
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      {product?.qtdEstoque ?? 0} un
                    </Text>
                  </View>

                  {/* Estoque Mínimo (Lado Direito - 50%) */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      Estoque mínimo :
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 16,
                        color: colors.black
                      }}
                    >
                      {product?.minEstoque ?? 0} un
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* BARRA INFERIOR FIXA (ABSOLUTE) */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: colors.white,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: colors.gray[200]
                }}
              >
                {/* Preço Unitário e Total */}
                <View style={{ gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 14,
                      color: colors.gray[600]
                    }}
                  >
                    Valor:
                  </Text>

                  <Text style={{ fontSize: 18 }}>
                    {/* Preço Unitário (Sempre em Preto) */}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        color: colors.black
                      }}
                    >
                      {product?.price
                        ? numberToCurrency(product.price)
                        : 'R$ 0,00'}
                    </Text>{' '}
                    {/* Exibe a seta e o Preço Total se a quantidade for maior que 1 */}
                    {product?.price && quantity > 0 && (
                      <>
                        <MaterialIcons
                          name="arrow-forward"
                          size={14}
                          color={colors.green[500]}
                          style={{ marginBottom: -1 }} // Ajuste fino se a fonte ainda "puxar" para baixo
                        />{' '}
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            color: colors.green[500]
                          }}
                        >
                          {numberToCurrency(product.price * quantity)}
                        </Text>
                      </>
                    )}
                  </Text>
                </View>

                {/* CONTROLE DE AÇÃO / QUANTIDADE */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={{
                        width: 58,
                        height: 58,
                        opacity: (product?.qtdEstoque ?? 0) <= 0 ? 0.3 : 1,
                        padding: 6,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeftColor: colors.green[500],
                        borderLeftWidth: 1
                      }}
                      onPress={handleAdd}
                      disabled={(product?.qtdEstoque ?? 0) <= 0}
                    >
                      <MaterialIcons
                        name="add-shopping-cart"
                        size={28}
                        color={colors.green[500]}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 4,
                        gap: 6
                      }}
                    >
                      {/* Botão Decrementar (-) */}
                      <TouchableOpacity
                        onPress={handleRemove}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          backgroundColor: colors.green[100],
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <MaterialIcons
                          name="remove"
                          size={18}
                          color={colors.green[500]}
                        />
                      </TouchableOpacity>

                      {/* Input de Quantidade */}
                      <TextInput
                        style={{
                          fontFamily: fontFamily.bold,
                          fontSize: 16,
                          color: colors.black,
                          textAlign: 'center',
                          minWidth: 32,
                          paddingHorizontal: 4
                        }}
                        value={String(quantity)}
                        editable={false}
                        cursorColor={colors.green[500]}
                        keyboardType="numeric"
                        maxLength={3}
                      />

                      {/* Botão Incrementar (+) */}
                      <TouchableOpacity
                        onPress={handleAdd}
                        disabled={quantity >= (product?.qtdEstoque ?? 0)}
                        style={{
                          opacity:
                            quantity >= (product?.qtdEstoque ?? 0) ? 0.4 : 1
                        }}
                      >
                        <LinearGradient
                          colors={[colors.green[400], colors.green[500]]}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <MaterialIcons
                            name="add"
                            size={18}
                            color={colors.white}
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
