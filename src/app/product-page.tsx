import React, { useCallback, useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ProductResponse,
  useProductDatabase
} from '@/database/useProductDatabase';
import { Loading } from '@/components/Loading';
import { ImageInput } from '@/components/ImageInput';
import { CustomImage } from '@/components/CustomImage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const productDatabase = useProductDatabase();

  function handleEditProduct() {
    if (!product) return;

    const categoryNameEncoded = encodeURIComponent(product.category_name ?? '');

    router.navigate(
      `/new-product/?id=${product.id}&categoryId=${product.category_id}&categoryName=${categoryNameEncoded}`
    );
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
                      product?.color.toLowerCase() !== '#ffffff'
                        ? colors.white
                        : colors.black
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 32,
                gap: 20,
                paddingTop: 16
              }}
            >
              {/* Nome do Produto */}
              <View style={{ gap: 4 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: 18,
                    color: colors.black
                  }}
                >
                  Nome do Produto :
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 16,
                    color: colors.gray[600]
                  }}
                >
                  {product?.name || 'Picolé de Fruta'}
                </Text>
              </View>

              {/* Descrição */}
              <View style={{ gap: 4 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: 18,
                    color: colors.black
                  }}
                >
                  Descrição :
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 16,
                    color: colors.gray[600],
                    lineHeight: 22
                  }}
                >
                  {/* {product?.description || 'Nenhuma descrição informada.'} */}
                  Nenhuma descrição informada
                </Text>
              </View>

              {/* Categoria */}
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: 18,
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
                    variant="product"
                  />
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 18,
                      color: colors.black
                    }}
                  >
                    {product?.category_name || 'Sem Categoria'}
                  </Text>
                </View>
              </View>

              {/* Código do Produto / Localização */}
              <View style={{ gap: 4 }}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: 18,
                    color: colors.black
                  }}
                >
                  Codigo do Produto :
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 16,
                    color: colors.gray[600]
                  }}
                >
                  {product?.codBar || 'Nenhum Registrado'}
                </Text>
              </View>

              {/* Grid de Estoques (Lado a Lado) */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8
                }}
              >
                {/* Estoque Atual */}
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: 18,
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
                    {product?.qtdEstoque ?? 0} unidades
                  </Text>
                </View>

                {/* Estoque Mínimo */}
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: 18,
                      color: colors.black
                    }}
                  >
                    Estoque minimo :
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 16,
                      color: colors.black
                    }}
                  >
                    {product?.minEstoque ?? 0} unidades
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
