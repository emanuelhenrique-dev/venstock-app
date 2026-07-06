import { colors, fontFamily } from '@/theme';
import { Text, useWindowDimensions, View } from 'react-native';
import { LineChart, LineChartPropsType } from 'react-native-gifted-charts';

interface ChartProps extends LineChartPropsType {}

export function Chart({ ...rest }: ChartProps) {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        // Sombra leve para dar profundidade (opcional)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: fontFamily.bold,
          color: '#111827',
          marginBottom: 20
        }}
      >
        Desempenho de Vendas
      </Text>
      <LineChart
        // Estilização da Linha Principal
        thickness={3}
        color={colors.green[500]} // Linha verde combinando com o tema
        noOfSections={3}
        // Efeito de Área com Gradiente Lindo abaixo da linha
        areaChart
        startFillColor={colors.green[400]}
        endFillColor={colors.white}
        startOpacity={0.4}
        endOpacity={0.0}
        // Customização dos Eixos e Textos
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor="#E5E7EB"
        yAxisTextStyle={{
          color: '#9CA3AF',
          fontSize: 12,
          fontFamily: fontFamily.medium
        }}
        xAxisLabelTextStyle={{
          color: '#9CA3AF',
          fontSize: 12,
          fontFamily: fontFamily.medium
        }}
        // Ajustes de Layout internos
        height={160}
        spacing={40} // Espaçamento horizontal entre os pontos
        initialSpacing={10}
        hideRules // Esconde as linhas horizontais de fundo para um visual mais clean
        pointerConfig={{
          // Linha vertical guia ao tocar no gráfico
          pointerStripColor: colors.green[400],
          pointerStripWidth: 2,
          strokeDashArray: [2, 5]
        }}
        {...rest}
      />
    </View>
  );
}

export const sampleData = {
  '1M': [
    { value: 5200 },
    { value: 5150 },
    { value: 6285 },
    { value: 5220 },
    { value: 5400 },
    { value: 8330 },
    { value: 9480 }
  ],
  '3M': [
    { value: 4800 },
    { value: 4925 },
    { value: 4750 },
    { value: 5050 },
    { value: 4980 },
    { value: 5200 },
    { value: 5090 },
    { value: 5330 },
    { value: 5260 },
    { value: 5485 },
    { value: 5365 },
    { value: 5600 }
  ],
  '6M': [
    { value: 5000 },
    { value: 5120 },
    { value: 4890 },
    { value: 5230 },
    { value: 5075 },
    { value: 5410 },
    { value: 5280 },
    { value: 5525 },
    { value: 5430 },
    { value: 5650 },
    { value: 5575 },
    { value: 5790 },
    { value: 5710 },
    { value: 5935 },
    { value: 5860 },
    { value: 6075 },
    { value: 6000 },
    { value: 6220 }
  ],
  '12M': [
    { value: 5300 },
    { value: 5180 },
    { value: 5440 },
    { value: 5335 },
    { value: 5575 },
    { value: 5480 },
    { value: 5695 },
    { value: 5610 },
    { value: 5830 },
    { value: 5755 },
    { value: 5975 },
    { value: 5900 },
    { value: 6115 },
    { value: 6040 },
    { value: 6255 },
    { value: 6190 },
    { value: 6405 },
    { value: 6340 },
    { value: 6555 },
    { value: 6490 },
    { value: 6700 },
    { value: 6640 },
    { value: 6845 },
    { value: 6785 },
    { value: 6985 }
  ]
};
