// src/components/ProductsListOverlay/index.tsx
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { colors, fontFamily } from '@/theme'; // Ajuste o path se necessário
import { Input } from '../Input';
import { List } from '../List';
import { styles } from './styles';
import { ProductCard } from '../ProductCard';
import { selectedCategoryProps } from '@/app/(dashboard)';
// import { ProductCard } from '../ProductCard'; // Você criará depois!
// import { CategoryCardProps } from '../CategoryCard'; // Se tiver a tipagem centralizada

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
    }
  ];

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
              <MaterialIcons name="arrow-back" size={20} color={colors.black} />
            </TouchableOpacity>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
              <TouchableOpacity>
                <MaterialIcons name="edit" size={16} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <MaterialIcons name="share" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>

          <List
            data={produtosGelados} // Mock por enquanto
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard data={item} />}
            containerStyle={{ flex: 1 }}
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
}
