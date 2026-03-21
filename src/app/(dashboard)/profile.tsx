import { CustomImage } from '@/components/CustomImage';
import { PageHeader } from '@/components/PageHeader';
import { userStorage } from '@/database/userStorage';
import { colors } from '@/theme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StatusBar, Text, View } from 'react-native';

export default function User() {
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
      console.log('Erro ao carregar perfil', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} color={colors.green[500]} />;
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
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CustomImage image={userImage} size={130} color={colors.green[400]} />
        <PageHeader
          title1={userName}
          title2=""
          subtitle="Configurações de conta e visão geral do sistema."
          gradient={[colors.green[400], colors.green[500]]}
          style={{ paddingTop: 0 }}
        />
      </View>

      <View style={{ marginTop: 32, gap: 24 }}></View>
    </View>
  );
}
