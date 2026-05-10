import { CustomImage } from '@/components/CustomImage';
import { OptionCard } from '@/components/OptionCard';
import { PageHeader } from '@/components/PageHeader';

import { userStorage } from '@/database/userStorage';
import { colors, fontFamily } from '@/theme';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Index from '..';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useFocusEffect } from 'expo-router';
import { Loading } from '@/components/Loading';

type profile = {
  name: string;
  image: string | null;
  color: string;
};

export default function User() {
  const [profile, setProfile] = useState<profile>({
    name: '',
    image: null,
    color: ''
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const { getUserData, clearUserData } = userStorage();

  async function loadProfile() {
    try {
      const data = await getUserData();

      setProfile({
        name: data?.name || 'Usuário desconhecido',
        image: data?.image || null,
        color: data?.color || colors.green[500]
      });
    } catch (error) {
      console.log('Erro ao carregar perfil', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, sair',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            // 1. Limpa o storage
            await clearUserData();

            // 2. Tente usar o navigate com um pequeno delay maior
            // Isso força o roteador a reavaliar a árvore de arquivos
            setTimeout(() => {
              // Força a ida para a raiz absoluta
              if (router.canGoBack()) {
                router.dismissAll();
              }
              router.replace('/');
            }, 200);
          } catch (error) {
            setLoading(false);
            Alert.alert('Erro', 'Não foi possível sair.');
          }
        }
      }
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  if (loading) {
    return <Loading height={300} width={300} />;
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
          image={profile.image}
          size={130}
          color={profile.color}
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
            {profile.name}
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
            onPress={() => router.navigate('/edit-profile')}
          />

          <OptionCard
            title="Gerenciamento de contas"
            subtitle="Adicionar novo usuário ou editar um usuário."
            icon="group-add"
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
            onPress={() => handleLogout()}
            destructiveIcon="logout"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
