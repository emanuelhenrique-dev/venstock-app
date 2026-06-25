import CustomTabBar from '@/components/CustomTabBar';

import { colors } from '@/theme';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

// Serviços e Stores
import { localNotificationService } from '@/services/local-notifications.service';

// Hooks
import { useCartReminder } from '@/hooks/useCartReminder';
import { useNotifications } from '@/hooks/useNotification';

export default function DashboardLayout() {
  // Ativa as permissões e escutadores de clique ao entrar no Dashboard
  useNotifications();

  // Ativa o monitoramento do carrinho em segundo plano de forma isolada!
  useCartReminder();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1
        }}
        edges={['bottom']}
      >
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: colors.white },
            tabBarActiveTintColor: colors.blue[400], // Cor quando ativa
            tabBarInactiveTintColor: colors.gray[400]

            // // Estilo do texto (Label)
            // tabBarLabelStyle: {
            //   fontFamily: 'Poppins_500Medium',
            //   fontSize: 14,
            //   marginBottom: 5
            // },

            // // Estilo da barra de abas
            // tabBarStyle: {
            //   backgroundColor: 'white',
            //   borderTopWidth: 1
            // }
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Início'
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: 'Vendas',
              freezeOnBlur: true
            }}
          />
          <Tabs.Screen
            name="cashier"
            options={{
              title: 'Caixa'
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Usuário'
            }}
          />
        </Tabs>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
