import { CustomImage } from '@/components/CustomImage';
import { OptionCard } from '@/components/OptionCard';
import { PageHeader } from '@/components/PageHeader';

import { userStorage } from '@/database/userStorage';
import { colors, fontFamily } from '@/theme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Index from '..';
import { ScrollView } from 'react-native-gesture-handler';

export default function User() {
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header com Foto e Nome */}
      <View
        style={{
          alignItems: 'center',
          paddingTop: 50,

          zIndex: 1
        }}
      >
        <CustomImage
          image={userImage}
          size={130}
          color={colors.green[400]}
          style={{ zIndex: 1 }}
        />
        <View
          style={{
            width: '100%',
            marginTop: -20,
            paddingTop: 30,
            paddingBottom: 22,
            alignItems: 'center',
            backgroundColor: colors.gray[150]
          }}
        >
          <Text style={{ fontSize: 24, fontFamily: fontFamily.semiBold }}>
            {userName}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.regular,
              color: colors.gray[600],
              textAlign: 'center',
              paddingHorizontal: 40
            }}
          >
            Configurações de conta e visão geral do sistema.
          </Text>
        </View>
      </View>

      {/* LISTA DE OPÇÕES */}
      <View
        style={{
          marginBottom: 82,
          gap: 24,
          backgroundColor: colors.gray[150],
          flex: 1,
          paddingHorizontal: 24,
          marginTop: -160
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            gap: 8,
            paddingTop: 160,
            paddingBottom: 10
          }}
        >
          <OptionCard
            title="Editar Perfil"
            subtitle="Configure seu perfil"
            icon="person"
            onPress={() => console.log('perfil')}
          />

          <OptionCard
            title="Gerenciamento de contas"
            subtitle="Adicionar novo usuário ou editar um usuário."
            icon="sell"
            onPress={() => console.log('contas')}
            disabled
          />

          <OptionCard
            title="Sua Estatística"
            subtitle="Seu estoque teve 12 movimentações nos últimos 7 dias. Veja aqui."
            icon="local-offer" // O ícone de tag da imagem
            onPress={() => console.log('stats')}
          />

          <OptionCard
            title="Permitir Notificações"
            subtitle="Notificar quando os produtos estiverem em baixa."
            icon="notifications-none"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />

          <OptionCard
            title="Sair"
            subtitle="Sair da conta atual."
            icon="door-back"
            onPress={() => console.log('sair')}
            destructiveIcon="logout"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
