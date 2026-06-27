import { CategoryCard, CategoryCardProps } from '@/components/CategoryCard';
import { List } from '@/components/List';
import { PageHeader } from '@/components/PageHeader';
import { ProductsListOverlay } from '@/components/ProductsListOverlay';
import { SearchInput } from '@/components/SearchInput';
import { Summary } from '@/components/Summary';
import { userStorage } from '@/database/userStorage';
import { colors, fontFamily } from '@/theme';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SectionList,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import {
  CategoryResponse,
  useCategoryDatabase
} from '@/database/useCategoryDatabase';
import { EmptyComponent } from '@/components/EmptyComponent';
import {
  SummaryPeriod,
  useTransactionDatabase
} from '@/database/useTransactionDatabase';
import {
  ProductResponse,
  useProductDatabase
} from '@/database/useProductDatabase';
import { SearchList, SearchResults } from '@/components/SearchList';
import { localNotificationService } from '@/services/local-notifications.service';

// Defina a estrutura da categoria
export type selectedCategoryProps = {
  id: string;
  name: string;
  image: string | null;
  color: string | null;
};

export default function Index() {
  const [userName, setUserName] = useState('');
  const [totalStock, setTotalStock] = useState('0');
  const [lowStockCount, setLowStockCount] = useState('0');

  // Captura os parâmetros vindos da URL/Deep Link
  const params = useLocalSearchParams<{ triggerLowStock?: string }>();

  //Estado para controlar a mostra as vendas de um período especifico
  const [periodIndex, setPeriodIndex] = useState(1);

  //Estado para controlar se mostra "Estoque Total" ou "Produtos Únicos"
  const [showUniqueProducts, setShowUniqueProducts] = useState(false);
  const [uniqueProductsCount, setUniqueProductsCount] = useState('0');

  //Estado para controlar a busca
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isLowStockFilterActive, setIsLowStockFilterActive] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<selectedCategoryProps | null>(null);

  const [categories, setCategories] = useState<CategoryCardProps[]>([]);
  const [itemsSoldCount, setItemsSoldCount] = useState('0');
  const [loading, setLoading] = useState(true);

  const { getUserData } = userStorage();
  const CategoryDatabase = useCategoryDatabase();
  const productDatabase = useProductDatabase();
  const transactionDatabase = useTransactionDatabase();

  const insets = useSafeAreaInsets();

  //Base de dados fictícia para os períodos
  const PERIODS_CONFIG: { key: SummaryPeriod; label: string }[] = [
    { key: '24h', label: 'Últimas 24h' },
    { key: '7days', label: 'Últimos 7 dias' },
    { key: '30days', label: 'Últimos 30 dias' },
    { key: '6months', label: 'Últimos 6 meses' },
    { key: '1year', label: 'Último ano' },
    { key: 'all', label: 'Todo o período' }
  ];

  //Função para alternar o período (o "Ciclo")
  function handleNextPeriod() {
    setPeriodIndex((prev) => (prev + 1) % PERIODS_CONFIG.length);
  }

  //Função para alternar o modo do card de estoque ao clicar
  function handleToggleStockMode() {
    setShowUniqueProducts((prev) => !prev);
  }

  async function loadProfile(): Promise<string | null> {
    try {
      const data = await getUserData();
      return data.name;
    } catch (error) {
      Alert.alert('Error', 'Erro ao carregar Usuário');
      console.log('Erro ao carregar perfil no Dashboard', error);
      return null;
    }
  }

  async function fetchCategories(): Promise<CategoryCardProps[]> {
    try {
      const response = await CategoryDatabase.getAll();

      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        qtdEstoque: item.qtdEstoque,
        qtdVendidos: item.qtdVendidos,
        qtdProdutosUnicos: item.qtdProdutosUnicos,
        imageUrl: item.imageUrl ?? undefined,
        color: item.color,
        hasLowStock: item.hasLowStock === 1
      }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
      console.log(error);
      return [];
    }
  }

  async function loadPeriodSales(currentIndex: number) {
    try {
      const currentPeriodKey = PERIODS_CONFIG[currentIndex].key;
      const summaryData =
        await transactionDatabase.getSalesSummaryByPeriod(currentPeriodKey);

      setItemsSoldCount(String(summaryData.totalItemsSold));
    } catch (error) {
      console.log('Erro ao buscar resumo de vendas por período:', error);
    }
  }

  function groupProductsByCategory(
    products: ProductResponse[]
  ): SearchResults[] {
    const groups: { [key: string]: ProductResponse[] } = {};

    // Como o banco já traz ordenado por categoria, o agrupamento mantém a ordem perfeita
    products.forEach((product) => {
      const categoryName = product.category_name || 'Sem categoria';

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(product);
    });

    // Transforma o objeto no Array esperado pelo SectionList
    return Object.keys(groups).map((categoryName) => ({
      title: categoryName,
      data: groups[categoryName]
    }));
  }

  async function handleSearch() {
    if (searchQuery.trim() === '' && !isLowStockFilterActive) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      let response = [];

      if (isLowStockFilterActive) {
        // 1. Busca os produtos com estoque baixo do banco
        // (Se o seu banco aceitar um termo de busca opcional lá dentro, massa.
        // Se não, buscamos todos os baixos e filtramos por texto aqui no JS)
        const lowStockData = await productDatabase.getLowStockProducts();

        if (searchQuery.trim() !== '') {
          response = lowStockData.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          response = lowStockData;
        }
      } else {
        // 2. Busca normal por texto/código de barras que você já tinha
        response = await productDatabase.searchAll(searchQuery);
      }

      // Agrupa os resultados por categoria
      const formattedResults = groupProductsByCategory(response);
      console.log(formattedResults);
      setSearchResults(formattedResults);
    } catch (error) {
      console.log('Erro ao buscar produtos:', error);
    } finally {
      setIsSearching(false);
    }
  }

  async function fetchData() {
    const categoryDataPromise = fetchCategories();
    const profileDataPromise = loadProfile();

    const lowStockCountPromise = productDatabase.getLowStockCount();

    const [categoryData, profileData, lowStockCountValue] = await Promise.all([
      categoryDataPromise,
      profileDataPromise,

      lowStockCountPromise
    ]);

    // console.log(categoryData);

    setUserName(profileData || 'Usuário desconhecido');
    setCategories(categoryData);

    setLowStockCount(String(lowStockCountValue));

    // 🟢 Soma o estoque total de todas as unidades
    const sumStock = categoryData.reduce(
      (acc, cat) => acc + (cat.qtdEstoque || 0),
      0
    );
    setTotalStock(String(sumStock));

    // 🟢 Soma a quantidade de produtos diferentes cadastrados
    const sumUnique = categoryData.reduce(
      (acc, cat) => acc + (cat.qtdProdutosUnicos || 0),
      0
    );
    setUniqueProductsCount(String(sumUnique));

    setLoading(false);
  }

  // busca dados
  useFocusEffect(
    useCallback(() => {
      fetchData();
      setSelectedCategory(null);

      setPeriodIndex(1);
    }, [])
  );

  // Roda quando os estados mudam OU quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      handleSearch();
      setSelectedCategory(null);
    }, [searchQuery, isLowStockFilterActive])
  );

  //Dispara a consulta ao banco apenas para o card toda vez que o periodIndex rodar
  useEffect(() => {
    loadPeriodSales(periodIndex);
  }, [periodIndex]);

  // Sempre que a contagem de estoque baixo mudar na tela principal atualizar a notificação
  useEffect(() => {
    localNotificationService.updateLowStockReminder({
      totalItems: Number(lowStockCount)
    });
  }, [lowStockCount]);

  // Monitora se o app foi aberto pela notificação de estoque baixo
  useEffect(() => {
    if (params.triggerLowStock === 'true') {
      setIsLowStockFilterActive(true); // Ativa o filtro do estoque baixo automaticamente
      setSearchQuery(''); // Limpa qualquer busca de texto anterior
    }

    // SEGREDO: Limpa o parâmetro da URL logo após usá-lo!
    router.setParams({ triggerLowStock: '' });
  }, [params.triggerLowStock]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24
        }}
      >
        <ActivityIndicator color={colors.green[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 24
      }}
    >
      <StatusBar barStyle="dark-content" />
      <PageHeader
        title1="Olá"
        title2={userName || 'Lojista'}
        subtitle="Acompanhe suas vendas"
        gradient={[colors.blue[400], colors.blue[500]]}
        button={{
          icon: 'report',
          onPress: () => {
            setIsLowStockFilterActive((prev) => !prev);

            // Se ativou o filtro, podemos pré-preencher o input ou disparar a busca direto
            if (!isLowStockFilterActive) {
              setSearchQuery(''); // Limpa a busca textual para focar só no estoque baixo
            }
          },
          color: isLowStockFilterActive ? colors.yellow[500] : '',
          badgeNumber: lowStockCount
        }}
      />
      <View style={{ marginTop: 24, flex: 1 }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <Summary
            label={
              showUniqueProducts ? 'produtos únicos' : 'produtos em estoque'
            }
            data={{
              // Se for produtos únicos, você pode mudar o detalhe para "cadastrados" ou manter os baixos
              details: `${lowStockCount} baixos`,
              value: showUniqueProducts ? uniqueProductsCount : totalStock
            }}
            icon="inventory"
            gradient={[colors.blue[400], colors.blue[500]]}
            onPress={handleToggleStockMode}
          />

          <Summary
            sale
            label="produtos vendidos"
            data={{
              details: PERIODS_CONFIG[periodIndex].label, // Texto dinâmico
              value: itemsSoldCount // Valor dinâmico
            }}
            icon="shopping-bag"
            gradient={[colors.green[400], colors.green[500]]}
            onPress={handleNextPeriod}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text
            style={{
              color: colors.black,
              fontSize: 18,
              fontFamily: fontFamily.medium,
              includeFontPadding: false
            }}
          >
            Produtos
          </Text>
          <TouchableOpacity
            onPress={() => {
              !selectedCategory
                ? router.navigate('/new-category')
                : router.navigate(
                    `/new-product/?categoryId=${selectedCategory.id}&categoryName=${encodeURIComponent(selectedCategory.name)}`
                  );
            }}
          >
            <LinearGradient
              colors={
                !selectedCategory
                  ? [colors.blue[400], colors.blue[500]]
                  : [colors.green[400], colors.green[500]]
              }
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={{ borderRadius: 40, padding: 4, paddingHorizontal: 6 }}
            >
              <MaterialIcons name="add" size={24} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <SearchInput
          placeholder="Buscar produto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          setIsSearching={setIsSearching}
        />
        <View
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          {searchQuery.trim().length > 0 || isLowStockFilterActive ? (
            <View style={{ flex: 1 }}>
              {isLowStockFilterActive && (
                <Text
                  style={{
                    padding: 10,
                    color: colors.red[500],
                    fontWeight: 'bold'
                  }}
                >
                  ⚠️ Mostrando apenas produtos com estoque baixo
                </Text>
              )}
              <SearchList
                searchResults={searchResults}
                isSearching={isSearching}
              />
            </View>
          ) : (
            <List
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CategoryCard
                  data={item}
                  showUniqueProducts={showUniqueProducts}
                  // Ao clicar, ativamos o estado para exibir os produtos
                  onPress={() =>
                    setSelectedCategory({
                      id: item.id,
                      name: item.name,
                      image: item.imageUrl ?? null,
                      color: item.color ?? null
                    })
                  }
                />
              )}
              snapToInterval={200}
              decelerationRate="fast"
              emptyMessage="Nenhuma categoria criada."
              ListEmptyComponent={
                <EmptyComponent
                  text="Nenhuma categoria por aqui"
                  subtext="Crie categorias para organizar o seu estoque de produtos."
                  icon="view-list"
                  color={colors.blue[500]}
                />
              }
              contentContainerStyle={{
                paddingBottom: insets.bottom + 40
              }}
            />
          )}

          {/* 2. CHAME O COMPONENTE SOBREPOSTO AQUI */}
          {/* Ele fica depois da lista no JSX para cobri-la */}
          <ProductsListOverlay
            selectedCategory={selectedCategory}
            onClose={() => setSelectedCategory(null)}
            // Botão "voltar"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
