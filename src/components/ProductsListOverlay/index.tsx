// src/components/ProductsListOverlay/index.tsx
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/theme';
import { List } from '../List';
import { styles } from './styles';
import { ProductCard } from '../ProductCard';
import { selectedCategoryProps } from '@/app/(dashboard)';
import { CustomImage } from '../CustomImage';
import { router } from 'expo-router';
import { products } from '@/database/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tipagem baseada no que o seu Index.tsx já usa
export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  qtdEstoque: number;
  qtdVendidos: number;
  imageUrl?: string;
  color?: string;
};

interface Props {
  selectedCategory: selectedCategoryProps | null;
  onClose: () => void;
  // Depois você passará os produtos reais aqui:
  // products: ProductCardProps[];
}

export function ProductsListOverlay({ selectedCategory, onClose }: Props) {
  async function EditProduct(id: string) {
    try {
      Alert.alert('Editar', 'Realmente deseja editar esse produto?', [
        {
          text: 'não',
          style: 'cancel',
          onPress: () => {
            console.warn('Cancelando editar produto', id);
          }
        },
        {
          text: 'sim',
          style: 'destructive',
          onPress: () => {
            console.warn('editar produto', id);
            router.navigate(`/new-product/?id=${id}`);
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível editar o Produto');
      console.log(error);
    }
  }

  return (
    <AnimatePresence>
      {selectedCategory && (
        <MotiView
          from={{ translateX: SCREEN_WIDTH }}
          animate={{ translateX: 0 }}
          exit={{ translateX: SCREEN_WIDTH }}
          transition={{
            type: 'timing',
            duration: 250
          }}
          // Estilo da Camada Sobreposta (O seu productsOverlay)
          style={styles.productsOverlay}
        >
          {/* Cabeçalho da Lista de Produtos (Baseado na imagem do Venstock) */}
          <View style={styles.productsHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={colors.black} />
            </TouchableOpacity>

            <View style={styles.categoryInfo}>
              <CustomImage
                image={null}
                size={30}
                color={colors.blue[400]}
                variant="category"
              />
              <Text style={styles.categoryTitle} numberOfLines={1}>
                {selectedCategory.name}
              </Text>
              <TouchableOpacity activeOpacity={0.3}>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={colors.gray[500]}
                  onPress={() =>
                    router.navigate(`/new-category/?id=${selectedCategory.id}`)
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <MaterialIcons name="share" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          <List
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                data={item}
                leftAction={{
                  icon: 'edit',
                  onOpen: () => EditProduct(item.id)
                }}
              />
            )}
            containerStyle={{ flex: 1 }}
            snapToInterval={100}
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
}
