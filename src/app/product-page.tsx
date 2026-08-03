import React, { useCallback, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  ProductResponse,
  useProductDatabase
} from '@/database/useProductDatabase';
import { Loading } from '@/components/Loading';

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
            <Text style={{ fontSize: 32 }}>{product?.name || `ID: ${id}`}</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
