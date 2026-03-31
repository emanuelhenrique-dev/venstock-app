import { CategoryCard } from '@/components/CategoryCard';
import { Input } from '@/components/Input';
import { List } from '@/components/List';
import { PageHeader } from '@/components/PageHeader';
import { ProductsListOverlay } from '@/components/ProductsListOverlay';
import { Summary } from '@/components/Summary';
import { userStorage } from '@/database/userStorage';
import { colors, fontFamily } from '@/theme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Defina a estrutura da categoria
export type selectedCategoryProps = {
  id: string;
  name: string;
};

export default function Index() {
  const [userName, setUserName] = useState('');
  const [periodIndex, setPeriodIndex] = useState(0); // 0: 24h, 1: Semana, 2: Mês, 3: Ano
  const [selectedCategory, setSelectedCategory] =
    useState<selectedCategoryProps | null>(null);
  const [loading, setLoading] = useState(true);

  const { getUserData } = userStorage();

  //Base de dados fictícia para os períodos
  const salesPeriods = [
    { label: 'Últimas 24h', value: '169' },
    { label: 'Última Semana', value: '1.240' },
    { label: 'Último Mês', value: '4.850' },
    { label: 'Último Ano', value: '52.300' }
  ];

  // Mocks das  categorias
  const categorias = [
    {
      id: '1',
      name: 'Gelados',
      qtdEstoque: 180,
      qtdVendidos: 64,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '2',
      name: 'Bebidas',
      qtdEstoque: 245,
      qtdVendidos: 84,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '3',
      name: 'Carnes & Espetinhos',
      qtdEstoque: 60,
      qtdVendidos: 15,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '4',
      name: 'Outros',
      qtdEstoque: 42,
      qtdVendidos: 8,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    },
    {
      id: '5',
      name: 'Outrosasdasdsadasadasdsada',
      qtdEstoque: 42,
      qtdVendidos: 8,
      imageUrl: 'url-aqui',
      color: 'color-aqui'
    }
  ];

  //Função para alternar o período (o "Ciclo")
  function handleNextPeriod() {
    setPeriodIndex((prev) => (prev + 1) % salesPeriods.length);
  }

  async function loadProfile() {
    try {
      const data = await getUserData();
      if (data.name) setUserName(data.name);
    } catch (error) {
      Alert.alert('Error', 'Erro ao carregar Usuário');
      console.log('Erro ao carregar perfil no Dashboard', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

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
              details: salesPeriods[periodIndex].label, // Texto dinâmico
              value: salesPeriods[periodIndex].value // Valor dinâmico
            }}
            icon="shopping-bag"
            gradient={[colors.green[400], colors.green[500]]}
            onPress={handleNextPeriod}
          />
        </View>

        <Text
          style={{
            color: colors.black,
            fontSize: 18,
            fontFamily: fontFamily.medium
          }}
        >
          Produtos
        </Text>
        <Input placeholder="Buscar Categoria" />
        <View
          style={{
            flex: 1,
            position: 'relative',
            marginBottom: 110
          }}
        >
          {/* LISTA DE CATEGORIAS (Fica no fundo) */}
          <List
            data={categorias}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                data={item}
                // Ao clicar, ativamos o estado para exibir os produtos
                onPress={() =>
                  setSelectedCategory({ id: item.id, name: item.name })
                }
              />
            )}
            snapToInterval={200}
            decelerationRate="fast"
            emptyMessage="Nenhuma categoria criada."
            containerStyle={{ flex: 1 }}
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
