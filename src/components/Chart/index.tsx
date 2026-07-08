import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, fontFamily } from '@/theme';

const screenWidth = Dimensions.get('window').width;

interface ChartItem {
  value: number;
  label: string;
  quantity: number;
}

interface ChartProps {
  data: ChartItem[];
}

type ChartMode = 'revenue' | 'quantity';

export function Chart({ data }: ChartProps) {
  const [mode, setMode] = useState<ChartMode>('revenue');
  const [selectedPoint, setSelectedPoint] = useState<ChartItem | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedPoint(data[data.length - 1]);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}
      >
        <Text style={{ fontFamily: fontFamily.medium, color: '#9CA3AF' }}>
          Nenhuma venda registrada neste período.
        </Text>
      </View>
    );
  }

  // Ajuste milimétrico para blindar o card contra vazamentos
  const paddingCard = 32;
  const yAxisWidth = 50;
  // O chartWidth agora desconta perfeitamente as laterais para o gráfico caber 100% dentro do card
  const chartWidth = screenWidth - paddingCard - yAxisWidth - 10;

  const minSpacing = 55;
  const calculatedSpacing =
    data.length > 1 ? chartWidth / (data.length - 0.5) : 55;
  const finalSpacing =
    calculatedSpacing < minSpacing ? minSpacing : calculatedSpacing;

  const adjustedData = data.map((item) => {
    const isSelected = selectedPoint && selectedPoint.label === item.label;
    const value = mode === 'revenue' ? item.value : item.quantity;

    return {
      ...item,
      value,
      dataPointColor: isSelected ? colors.green[500] : '#9CA3AF',
      dataPointRadius: isSelected ? 6 : 3.5,
      dataPointBorderColor: isSelected ? colors.white : 'transparent',
      dataPointBorderWidth: isSelected ? 2 : 0,

      showStrip: isSelected,
      stripColor: '#9CA3AF',
      stripWidth: 1.2,
      stripType: 'dashed',
      stripOpacity: 0.5
    };
  });

  const currentReferenceValue = selectedPoint
    ? mode === 'revenue'
      ? selectedPoint.value
      : selectedPoint.quantity
    : 0;

  return (
    <View
      style={{
        backgroundColor: colors.white,
        paddingVertical: 18,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: '100%'
      }}
    >
      {/* CABEÇALHO DO CARD COM ALTERNADOR DE MODO */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingHorizontal: 4
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: fontFamily.bold,
            color: '#111827'
          }}
        >
          Desempenho
        </Text>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            padding: 3,
            borderRadius: 10
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMode('revenue')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: mode === 'revenue' ? colors.white : 'transparent'
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.bold,
                color: mode === 'revenue' ? colors.green[500] : '#6B7280'
              }}
            >
              R$ Ganhos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setMode('quantity')}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor:
                mode === 'quantity' ? colors.white : 'transparent'
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamily.bold,
                color: mode === 'quantity' ? colors.green[500] : '#6B7280'
              }}
            >
              un. Vendidas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ÁREA DO GRÁFICO SEGURO COM ENCAPSULAMENTO DE OVERFLOW */}
      <View
        style={{ width: '100%', overflow: 'hidden', alignItems: 'flex-start' }}
      >
        <LineChart
          data={adjustedData}
          width={chartWidth}
          height={180}
          curved
          curvature={0.15}
          thickness={2.5}
          color={colors.green[500]}
          areaChart
          startFillColor={colors.green[400]}
          endFillColor={colors.white}
          startOpacity={0.15}
          endOpacity={0.005}
          showDataPoints
          onPress={(item: ChartItem) => {
            setSelectedPoint(item);
          }}
          scrollBuffer={15}
          // AJUSTE DO EIXO y
          yAxisThickness={1}
          yAxisColor="#E5E7EB"
          yAxisTextStyle={{
            color: '#9CA3AF',
            fontSize: 10,
            fontFamily: fontFamily.medium
          }}
          yAxisLabelWidth={yAxisWidth}
          noOfSections={4}
          yAxisLabelPrefix={mode === 'revenue' ? 'R$ ' : ''}
          yAxisLabelSuffix={mode === 'revenue' ? '' : ' un.'}
          // AJUSTE DO EIXO X
          xAxisThickness={1}
          xAxisColor="#E5E7EB"
          labelsExtraHeight={5}
          xAxisLabelTextStyle={{
            color: '#9CA3AF',
            fontSize: 10,
            fontFamily: fontFamily.medium,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: -4
          }}
          rulesColor="#F3F4F6"
          rulesThickness={1}
          spacing={finalSpacing}
          initialSpacing={15}
          endSpacing={30} // Folga de segurança no fim da linha rolável
          isAnimated
          animationDuration={400}
          animateOnDataChange
          anima
          showReferenceLine1={selectedPoint !== null}
          referenceLine1Position={currentReferenceValue}
          referenceLine1Config={{
            color: '#9CA3AF',
            thickness: 1.2,
            type: 'dashed',
            dashWidth: 4,
            dashGap: 4
          }}
        />
      </View>

      {/* 🏷️ BALÃO DE INFORMAÇÕES (Fixo na Base) */}
      {selectedPoint && (
        <View
          style={{
            backgroundColor: '#1E1E24',
            padding: 12,
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
            borderWidth: 1,
            borderColor: '#374151'
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 11,
                fontFamily: fontFamily.medium,
                color: '#9CA3AF'
              }}
            >
              Dia / Período:{' '}
              <Text
                style={{ color: colors.white, fontFamily: fontFamily.bold }}
              >
                {selectedPoint.label}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fontFamily.bold,
                color: colors.white,
                marginTop: 2
              }}
            >
              Faturamento: R$ {selectedPoint.value.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#272730',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: fontFamily.bold,
                color: '#10B981'
              }}
            >
              {selectedPoint.quantity} un.
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: fontFamily.medium,
                color: '#9CA3AF'
              }}
            >
              vendidos
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
