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
import { router, useFocusEffect } from 'expo-router';

import {
  CategoryResponse,
  useCategoryDatabase
} from '@/database/useCategoryDatabase';
import { EmptyComponent } from '@/components/EmptyComponent';
import {
  SummaryPeriod,
  useTransactionDatabase
} from '@/database/useTransactionDatabase';

// Defina a estrutura da categoria
export type selectedCategoryProps = {
  id: string;
  name: string;
  image: string | null;
  color: string | null;
};

export default function Index() {
  const [userName, setUserName] = useState('');
  const [periodIndex, setPeriodIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] =
    useState<selectedCategoryProps | null>(null);

  const [categories, setCategories] = useState<CategoryCardProps[]>([]);
  const [itemsSoldCount, setItemsSoldCount] = useState('0');
  const [loading, setLoading] = useState(true);

  const { getUserData } = userStorage();
  const CategoryDatabase = useCategoryDatabase();
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
        imageUrl: item.imageUrl ?? undefined,
        color: item.color
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

  async function fetchData() {
    const categoryDataPromise = fetchCategories();
    const profileDataPromise = loadProfile();

    const currentPeriodKey = PERIODS_CONFIG[periodIndex].key;
    const salesSummaryPromise =
      transactionDatabase.getSalesSummaryByPeriod(currentPeriodKey);

    const [categoryData, profileData, salesSummary] = await Promise.all([
      categoryDataPromise,
      profileDataPromise,
      salesSummaryPromise
    ]);

    console.log(categoryData);

    setUserName(profileData || 'Usuário desconhecido');
    setCategories(categoryData);
    setItemsSoldCount(String(salesSummary.totalItemsSold));

    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setSelectedCategory(null);
    }, [])
  );

  //Dispara a consulta ao banco apenas para o card toda vez que o periodIndex rodar
  useEffect(() => {
    if (!loading) {
      loadPeriodSales(periodIndex);
    }
  }, [periodIndex]);

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
          icon: 'delete',
          onPress: () => {
            console.log('lixeira apertada');
          }
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
            label="produtos em estoque"
            data={{ details: '5 baixos', value: '527' }}
            icon="inventory"
            gradient={[colors.blue[400], colors.blue[500]]}
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

        <SearchInput placeholder="Buscar produto..." />
        <View
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          {/* LISTA DE CATEGORIAS (Fica no fundo) */}
          <List
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                data={item}
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
