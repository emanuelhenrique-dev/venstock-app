import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { StatusBar, Text, View } from 'react-native';

export default function Cashier() {
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
        title1="Meu"
        title2="Caixa"
        subtitle="Confira os pagamentos via Pix e Históricos geral."
        gradient={[colors.green[400], colors.green[500]]}
      />
      <View style={{ marginTop: 32, gap: 24 }}></View>
    </View>
  );
}
