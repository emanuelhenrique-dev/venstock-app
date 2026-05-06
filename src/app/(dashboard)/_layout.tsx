import CustomTabBar from '@/components/CustomTabBar';
import { colors } from '@/theme';
import { Tabs } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DashboardLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
