import { CustomImage } from '@/components/CustomImage';
import { OptionCard } from '@/components/OptionCard';

import { colors, fontFamily } from '@/theme';
import { useCallback, useState } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import { ScrollView } from 'react-native-gesture-handler';
import { router, useFocusEffect } from 'expo-router';

import { useCartStore } from '@/store/useCartStore';
import { localNotificationService } from '@/services/local-notifications.service';
import { useAuth } from '@/hooks/useAuth';

type profile = {
  name: string;
  image: string | null;
  color: string;
};

export default function User() {
  const { clearCart } = useCartStore();
  const { user, loggedOut, notificationsEnabled, toggleNotifications } =
    useAuth();

  const insets = useSafeAreaInsets();

  const profileName = user?.name || 'Usuário desconhecido';
  const profileImage = user?.image || null;
  const profileColor = user?.color || colors.green[500];

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim, sair',
        style: 'destructive',
        onPress: async () => {
          try {
            // Limpa o carrinho de compras global
            clearCart();
            //  Cancela todas notificações
            await localNotificationService.cancelAllNotifications();

            await loggedOut();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível sair.');
          }
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header com Foto e Nome */}
      <View
        style={{
          alignItems: 'center',
          paddingTop: 40,
          zIndex: 1
        }}
      >
        <CustomImage
          image={profileImage}
          size={130}
          color={profileColor}
          style={{ zIndex: 1 }}
        />
        <View
          style={{
            width: '100%',
            marginTop: -60,
            paddingTop: 60,
            paddingBottom: 50,
            paddingHorizontal: 10,
            alignItems: 'center',
            backgroundColor: colors.gray[150]
          }}
        >
          <Text
            numberOfLines={1}
            style={{ fontSize: 24, fontFamily: fontFamily.semiBold }}
          >
            {profileName}
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
          gap: 24,
          backgroundColor: colors.gray[150],
          flex: 1,
          paddingHorizontal: 24,
          marginBottom: 10
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            gap: 8,
            paddingBottom: insets.bottom + 80
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
            subtitle="Visualize suas estatísticas de vendas e desempenho."
            icon="local-offer" // O ícone de tag da imagem
            onPress={() => router.navigate('/statistics-view')}
          />

          <OptionCard
            title="Permitir Notificações"
            subtitle="Ex: Notificar quando os produtos estiverem em baixa."
            icon="notifications-none"
            isSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={toggleNotifications}
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
