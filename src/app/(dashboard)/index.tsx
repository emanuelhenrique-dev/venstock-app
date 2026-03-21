import { PageHeader } from '@/components/PageHeader';
import { Summary } from '@/components/Summary';
import { userStorage } from '@/database/userStorage';
import { colors } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  StatusBar,
  Text,
  UIManager,
  View
} from 'react-native';

export default function Index() {
  const [userName, setUserName] = useState('');
  const [periodIndex, setPeriodIndex] = useState(0); // 0: 24h, 1: Semana, 2: Mês, 3: Ano
  const [loading, setLoading] = useState(true);

  const { getUserData } = userStorage();

  //Base de dados fictícia para os períodos
  const salesPeriods = [
    { label: 'Últimas 24h', value: '169' },
    { label: 'Última Semana', value: '1.240' },
    { label: 'Último Mês', value: '4.850' },
    { label: 'Último Ano', value: '52.300' }
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
    <View
      style={{
        flex: 1,
        paddingVertical: 52,
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
      <View style={{ marginTop: 32, gap: 24 }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'space-between'
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
      </View>
    </View>
  );
}
