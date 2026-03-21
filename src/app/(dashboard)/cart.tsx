import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { StatusBar, Text, View } from 'react-native';

export default function Cart() {
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
        title1="Minhas"
        title2="Vendas"
        subtitle="Confira os itens antes de finalizar o saída."
        gradient={[colors.green[400], colors.green[500]]}
      />
      <View style={{ marginTop: 32, gap: 24 }}></View>
    </View>
  );
}
