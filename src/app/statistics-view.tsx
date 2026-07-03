import { PageHeader } from '@/components/PageHeader';

import { colors, fontFamily } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

type PeriodType =
  | '7days'
  | '14days'
  | '30days'
  | '2months'
  | '6months'
  | '1year'
  | 'all';

interface PeriodOption {
  key: PeriodType;
  label: string;
}

export default function Statistics() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>({
    key: '30days',
    label: '30 dias'
  });

  const PERIODS: PeriodOption[] = [
    { key: '7days', label: '7 dias' },
    { key: '14days', label: '14 dias' },
    { key: '30days', label: '30 dias' },
    { key: '2months', label: '2 meses' },
    { key: '6months', label: '6 meses' },
    { key: '1year', label: '1 ano' },
    { key: 'all', label: 'Tudo' }
  ];

  // 🌟 Função simples para ajustar a frase do cabeçalho de forma perfeita
  const getSubtitleText = () => {
    if (selectedPeriod.key === 'all') {
      return 'Analise o desempenho do seu negócio de todo o período.';
    }
    if (selectedPeriod.key === '1year') {
      return 'Analise o desempenho do seu negócio no último ano.';
    }
    return `Analise o desempenho do seu negócio nos últimos ${selectedPeriod.label}.`;
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,

          paddingTop: 22
        }}
        edges={['bottom']}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <PageHeader
            title1="Minhas"
            title2="Estatísticas"
            subtitle={getSubtitleText()}
            gradient={[colors.green[400], colors.green[500]]}
            back
          />
        </View>

        <View style={{ flex: 1, marginTop: 10, gap: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              gap: 8,
              height: 40,
              alignItems: 'center'
            }}
          >
            {PERIODS.map((period) => {
              const isActive = selectedPeriod.key === period.key;

              return (
                <TouchableOpacity
                  key={period.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedPeriod(period)}
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 14, // Formato pílula
                    backgroundColor: isActive ? colors.green[500] : '#F3F4F6', // Troca a cor de fundo reativamente
                    borderWidth: 1,
                    borderColor: isActive ? colors.green[500] : '#E5E7EB'
                  }}
                >
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color={isActive ? colors.white : colors.gray[200]}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: isActive
                        ? fontFamily.bold
                        : fontFamily.medium,
                      color: isActive ? colors.white : '#4B5563', // Texto branco se ativo, cinza se inativo
                      includeFontPadding: false
                    }}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
