import { ProductResponse } from '@/database/useProductDatabase';
import { useCartStore } from '@/store/useCartStore';
import { Alert, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { ProductCard } from '../ProductCard';
import { router } from 'expo-router';
import { CustomImage } from '../CustomImage';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { styles } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { ProductSkeleton } from '../ProductSkeleton';
import { Loading } from '../Loading';
import { EmptyComponent } from '../EmptyComponent';

export type SearchResults = {
  title: string;
  data: ProductResponse[];
};

interface props {
  searchResults: SearchResults[];
  isSearching: boolean;
}

export function SearchList({ searchResults, isSearching }: props) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  //Função de editar adaptada para pegar os dados do próprio produto
  async function EditProduct(
    id: string,
    categoryId: number,
    categoryName: string
  ) {
    try {
      Alert.alert('Editar', 'Realmente deseja editar esse produto?', [
        {
          text: 'não',
          style: 'cancel'
        },
        {
          text: 'sim',
          style: 'destructive',
          onPress: () => {
            router.navigate(
              `/new-product/?id=${id}&categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`
            );
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível editar o Produto');
      console.log(error);
    }
  }

  if (isSearching) {
    return (
      <View style={{ justifyContent: 'flex-start', marginTop: 50 }}>
        <Loading height={200} width={200} text="Buscando produtos..." />
      </View>
    );
  }

  return (
    <SectionList
      sections={searchResults}
      keyExtractor={(item) => String(item.id)}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.productsHeader}>
          <Text style={styles.categoryTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
      renderItem={({ item }) => {
        const productData = {
          id: String(item.id),
          name: item.name,
          price: item.price,
          qtdEstoque: item.qtdEstoque,
          qtdVendidos: item.qtdVendidos,
          imageUrl: item.imageUrl ?? undefined,
          color: item.color
        };

        const cartItem = items.find(
          (cart) => cart.productId === productData.id
        );
        const currentQuantity = cartItem ? cartItem.quantity : 0;

        return (
          <ProductCard
            data={productData}
            quantity={currentQuantity}
            onChangeQuantity={(newQty) => {
              if (currentQuantity === 0 && newQty > 0) {
                addItem({
                  id: String(Date.now()),
                  productId: productData.id,
                  quantity: 1
                });
              } else if (newQty === 0) {
                if (cartItem) removeItem(cartItem.id);
              } else {
                if (cartItem)
                  updateQuantity(cartItem.id, newQty, productData.qtdEstoque);
              }
            }}
            leftAction={{
              icon: 'edit',
              onOpen: () =>
                EditProduct(
                  productData.id,
                  item.category_id,
                  item.category_name || 'Sem Categoria'
                )
            }}
          />
        );
      }}
      ListEmptyComponent={
        <EmptyComponent
          text="Nenhum resultado encontrado"
          subtext="O produto que você busca pode não estar cadastrado com este nome ou código."
          icon="store-search-outline"
          color={colors.gray[400]}
        />
      }
      contentContainerStyle={{ paddingBottom: 80, gap: 5 }}
    />
  );
}
