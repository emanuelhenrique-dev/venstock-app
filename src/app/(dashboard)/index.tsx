import { PageHeader } from '@/components/PageHeader';
import { userStorage } from '@/database/userStorage';
import { colors } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native';

export default function Index() {
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { getUserData } = userStorage();

  async function loadProfile() {
    try {
      const data = await getUserData();
      if (data.name) setUserName(data.name);
      if (data.image) setUserImage(data.image);
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
      <View style={{ marginTop: 32, gap: 24 }}></View>
    </View>
  );
}
