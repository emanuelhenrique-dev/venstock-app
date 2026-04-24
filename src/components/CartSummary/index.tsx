import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme';
import { useState } from 'react';
import { green, opacity } from 'react-native-reanimated/lib/typescript/Colors';

interface CartSummaryProps extends TextInputProps {
  type: 'sale' | 'withdrawal';
  onChangeType: (type: 'sale' | 'withdrawal') => void;
  method: string;
  onChangeMethod: (method: string) => void;
}

export function CartSummary({
  type,
  onChangeType,
  method,
  onChangeMethod,
  ...rest
}: CartSummaryProps) {
  const Icons: Record<string, any> = {
    // Venda
    money: 'money',
    pix: 'pix',
    // Retirada
    avaria: 'delete',
    vencimento: 'date-range',
    consumo: 'lunch-dining'
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.green[400] }]}
          activeOpacity={0.8}
          onPress={() => onChangeType('sale')}
        >
          <Text style={[styles.text, { fontSize: 14 }]}>Venda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.blue[400] }]}
          activeOpacity={0.8}
          onPress={() => onChangeType('withdrawal')}
        >
          <Text style={[styles.text, { fontSize: 14 }]}>Retirada</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={
          type === 'sale'
            ? [colors.green[400], colors.green[500]]
            : [colors.blue[400], colors.blue[500]]
        }
        style={styles.content}
        locations={[0.189, 0.8243]}
        start={{ x: 0.1, y: 0.1 }} // Aproximação para 133.28°
        end={{ x: 0.9, y: 0.9 }}
      >
        <View style={styles.payWithdrawalOptionsContainer}>
          {type === 'sale' ? (
            // BLOCO DE VENDA: Dinheiro e Pix
            <>
              {['money', 'pix'].map((metodo) => (
                <TouchableOpacity
                  key={metodo}
                  style={[
                    styles.payWithdrawalOption,
                    { opacity: method !== metodo ? 0.8 : 1 }
                  ]}
                  onPress={() => onChangeMethod(metodo)}
                  activeOpacity={0.9}
                >
                  <MaterialIcons
                    name={Icons[metodo]} // <--- Ele busca o ícone aqui
                    size={20}
                    color={
                      method === metodo ? colors.green[500] : colors.gray[500]
                    }
                  />

                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          method === metodo
                            ? colors.green[500]
                            : colors.gray[500],
                        fontSize: 12
                      }
                    ]}
                  >
                    {metodo === 'money' ? 'Dinheiro' : 'Pix'}
                  </Text>

                  {method === metodo && (
                    <MaterialIcons
                      name="circle"
                      size={12}
                      color={colors.green[500]}
                      style={styles.pin}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </>
          ) : (
            // BLOCO DE RETIRADA: Avaria, Vencimento, Consumo
            <>
              {['Avaria', 'Vencimento', 'Consumo'].map((motivo) => (
                <TouchableOpacity
                  key={motivo}
                  style={[
                    styles.payWithdrawalOption,
                    { opacity: method !== motivo.toLowerCase() ? 0.8 : 1 }
                  ]}
                  onPress={() => onChangeMethod(motivo.toLowerCase())}
                  activeOpacity={0.9}
                >
                  <MaterialIcons
                    name={Icons[motivo.toLowerCase()]}
                    size={20}
                    color={
                      method === motivo.toLowerCase()
                        ? colors.blue[500]
                        : colors.gray[500]
                    }
                  />
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          method === motivo.toLowerCase()
                            ? colors.blue[500]
                            : colors.gray[500],
                        fontSize: 10
                      }
                    ]}
                  >
                    {motivo}
                  </Text>
                  {method === motivo.toLowerCase() && (
                    <MaterialIcons
                      name="circle"
                      color={colors.blue[500]}
                      style={styles.pin}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
        <View style={styles.summary}>
          {type === 'sale' ? (
            <>
              <View style={styles.summaryContent}>
                <Text style={styles.text}>Subtotal:</Text>
                <Text style={styles.text}>R$ 262,90</Text>
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.text}>Taxa/Serviço:</Text>
                <Text style={styles.text}>R$ 0,00</Text>
              </View>
              <View style={styles.summaryContent}>
                <Text style={[styles.text, { fontSize: 16 }]}>
                  Preço total:
                </Text>
                <Text style={[styles.text, { fontSize: 16 }]}>R$ 262,90</Text>
              </View>
            </>
          ) : (
            <TextInput
              placeholder="Escreva os detalhes do retiro (Opcional)..."
              placeholderTextColor={colors.gray[200]}
              multiline
              style={styles.textInput}
              numberOfLines={3}
              {...rest}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                color: type === 'sale' ? colors.green[500] : colors.blue[500]
              }
            ]}
          >
            Finalizar Venda
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
