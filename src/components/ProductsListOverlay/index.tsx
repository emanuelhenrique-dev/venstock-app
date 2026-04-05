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
  // Mock dos produtos (como no seu Index anterior)
  const produtosGelados: ProductCardProps[] = [
    {
      id: '1',
      name: 'Picolé de Fruta',
      price: 12.6,
      qtdEstoque: 70,
      qtdVendidos: 30,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '2',
      name: 'Picolé de Leite',
      price: 15.0,
      qtdEstoque: 25,
      qtdVendidos: 15,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '3',
      name: 'Saco de Gelo (Cubo)',
      price: 8.5,
      qtdEstoque: 45,
      qtdVendidos: 12,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '4',
      name: 'Geladinho de chocolate',
      price: 2.0,
      qtdEstoque: 30,
      qtdVendidos: 8,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '5',
      name: 'Sorvete Napolitano',
      price: 22.0,
      qtdEstoque: 12,
      qtdVendidos: 4,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    }
  ];

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
              <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
              <TouchableOpacity>
                <MaterialIcons name="edit" size={20} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <MaterialIcons name="share" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          <List
            data={produtosGelados}
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
          ></List>
        </MotiView>
      )}
    </AnimatePresence>
  );
}
