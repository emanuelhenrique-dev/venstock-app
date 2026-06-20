// src/components/ProductsListOverlay/index.tsx
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { colors } from '@/theme';
import { List } from '../List';
import { styles } from './styles';
import { ProductCard } from '../ProductCard';
import { selectedCategoryProps } from '@/app/(dashboard)';
import { CustomImage } from '../CustomImage';
import { router } from 'expo-router';
import { useCartStore } from '@/store/useCartStore';
import { Loading } from '../Loading';
import { ProductSkeleton } from '../ProductSkeleton';
import { Separator } from '../Separator';
import { useProductDatabase } from '@/database/useProductDatabase';
import { EmptyComponent } from '../EmptyComponent';
import { handleCategoryShare } from '@/utils/productShare';

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
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [canRenderList, setCanRenderList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ProductDatabase = useProductDatabase();

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
            if (!selectedCategory) return;
            console.warn('editar produto', id);

            router.navigate(
              `/new-product/?id=${id}&categoryId=${selectedCategory.id}&categoryName=${encodeURIComponent(selectedCategory.name)}`
            );
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível editar o Produto');
      console.log(error);
    }
  }

  async function fetchProductsByCategory(): Promise<ProductCardProps[]> {
    if (!selectedCategory?.id) {
      return [];
    }

    try {
      const response = await ProductDatabase.getByCategory(
        Number(selectedCategory.id)
      );

      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        qtdEstoque: item.qtdEstoque,
        qtdVendidos: item.qtdVendidos,
        imageUrl: item.imageUrl ?? undefined,
        color: item.color
      }));
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar os Produtos da Categoria ' +
          selectedCategory?.name
      );
      console.log(error);
      return [];
    }
  }

  async function fetchData() {
    const data = await fetchProductsByCategory();
    setProducts(data);

    setIsLoading(false);
  }

  // Só mostra a lista após a animação de entrada acabar (250ms)
  useEffect(() => {
    if (selectedCategory) {
      // Dispara a busca no banco de dados imediatamente em paralelo
      fetchData();

      // Ativa o renderizador após 200ms para casar com a transição do Moti
      const timer = setTimeout(() => setCanRenderList(true), 200);
      return () => clearTimeout(timer);
    } else {
      // Reseta os estados quando o overlay é fechado (selectedCategory vira null)
      setCanRenderList(false);
      setProducts([]);
    }
  }, [selectedCategory]);

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
                image={selectedCategory.image}
                size={30}
                color={selectedCategory.color ?? colors.blue[400]}
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
              <MaterialIcons
                name="share"
                size={20}
                color={colors.black}
                onPress={() =>
                  handleCategoryShare(selectedCategory.name, products)
                }
              />
            </TouchableOpacity>
          </View>
          {canRenderList ? (
            <List
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                //Buscamos se o produto já existe no carrinho
                const cartItem = items.find(
                  (cart) => cart.productId === item.id
                );
                const currentQuantity = cartItem ? cartItem.quantity : 0;

                return (
                  <ProductCard
                    data={item}
                    quantity={currentQuantity}
                    onChangeQuantity={(newQty) => {
                      //Adicionando novo item ao carrinho
                      if (currentQuantity === 0 && newQty > 0) {
                        addItem({
                          id: String(Date.now()),
                          productId: item.id,
                          quantity: 1
                        });
                      } else if (newQty === 0) {
                        //Removendo se chegar a zero
                        if (cartItem) removeItem(cartItem.id);
                      } else {
                        if (cartItem)
                          updateQuantity(cartItem.id, newQty, item.qtdEstoque);
                      }
                    }}
                    leftAction={{
                      icon: 'edit',
                      onOpen: () => EditProduct(item.id)
                    }}
                  />
                );
              }}
              containerStyle={{ flex: 1 }}
              snapToInterval={80}
              ListEmptyComponent={
                <EmptyComponent
                  text="Nenhum produto cadastrado"
                  subtext={`Esta Categoria ainda não possui produtos.`}
                  icon="dropbox"
                  color={colors.green[500]}
                  style={{ marginLeft: -15 }}
                />
              }
            />
          ) : (
            // Renderiza 5 ou 6 esqueletos fixos enquanto a animação termina
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              {[1, 2, 3, 4, 5].map((key) => (
                <React.Fragment key={key}>
                  <ProductSkeleton />
                </React.Fragment>
              ))}
            </ScrollView>
          )}
        </MotiView>
      )}
    </AnimatePresence>
  );
}
