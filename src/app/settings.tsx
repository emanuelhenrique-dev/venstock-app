import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PageHeader } from '@/components/PageHeader';
import { OptionCard } from '@/components/OptionCard';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';

export default function Settings() {
  const router = useRouter();
  const {
    notificationsEnabled,
    resetCategoryOnFocus,
    sortAlphabetically,
    toggleNotifications,
    toggleResetCategoryOnFocus,
    toggleSortAlphabetically
  } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingTop: 22
        }}
        edges={['bottom']}
      >
        <View>
          <PageHeader
            title1="Preferências"
            title2="do App"
            subtitle="Gerencie alertas e comportamentos do sistema."
            gradient={[colors.green[400], colors.green[500]]}
            back
            style={{ paddingHorizontal: 24, paddingBottom: 16 }}
          />
        </View>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <OptionCard
            title="Permitir Notificações"
            subtitle="Ex: Notificar quando os produtos estiverem em baixa."
            icon="notifications-none"
            isSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={toggleNotifications}
          />

          <OptionCard
            title="Resetar Categoria"
            subtitle="Limpa a categoria selecionada na Home sempre que a tela ganhar foco."
            icon="refresh"
            isSwitch
            switchValue={resetCategoryOnFocus}
            onSwitchChange={toggleResetCategoryOnFocus}
          />

          <OptionCard
            title="Ordenar Categorias por Nome (A-Z)"
            subtitle={
              sortAlphabetically
                ? 'Categorias em ordem alfabética. Pode ser necessário reiniciar o app para aplicar.'
                : 'Categorias por data de criação. Pode ser necessário reiniciar o app para aplicar.'
            }
            icon="sort-by-alpha"
            isSwitch
            switchValue={sortAlphabetically}
            onSwitchChange={toggleSortAlphabetically}
          />

          <OptionCard
            title="Importar & Exportar"
            subtitle="Faça backup ou importe dados de categorias e produtos."
            icon="file-download"
            onPress={() => router.push('/import-export')}
          />

          {/* Espaço pronto para os próximos recursos de personalização */}
          {/* 
        <OptionCard
          title="Tema Escuro"
          subtitle="Alternar entre modo claro e escuro."
          icon="dark-mode"
          isSwitch
          ...
        /> 
        */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
