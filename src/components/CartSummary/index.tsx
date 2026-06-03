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

import { numberToCurrency } from '@/utils/numberToCurrency';
import { CurrencyInput } from '../CurrencyInput';

interface CartSummaryProps extends TextInputProps {
  type: 'sale' | 'withdrawal';
  method: string;
  total: number;
  fee: number;
  disabled?: boolean;
  onChangeType: (type: 'sale' | 'withdrawal') => void;
  onChangeMethod: (method: string) => void;
  onChangeFee: (fee: number) => void;
  onConfirm: () => void;
}

export function CartSummary({
  type,
  method,
  total,
  fee,
  disabled = false,
  onChangeMethod,
  onChangeType,
  onChangeFee,
  onConfirm,
  ...rest
}: CartSummaryProps) {
  const [isEditingFee, setIsEditingFee] = useState(false);

  const finalPrice = total + fee;

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
          onPress={() => {
            setIsEditingFee(false);
            onChangeType('withdrawal');
          }}
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
                <Text style={styles.text}>{numberToCurrency(total)}</Text>
              </View>
              <View style={styles.summaryContent}>
                <Text style={[styles.text, { flex: 1 }]}>Taxa/Serviço:</Text>
                {isEditingFee ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <TouchableOpacity onPress={() => setIsEditingFee(false)}>
                      <MaterialIcons
                        name="check"
                        size={16}
                        color={colors.white}
                      />
                    </TouchableOpacity>
                    <CurrencyInput
                      style={{
                        backgroundColor: colors.white,
                        color: '#333',
                        fontSize: 12,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        width: 85,
                        textAlign: 'right'
                      }}
                      onSubmitEditing={() => setIsEditingFee(false)}
                      value={fee}
                      onChangeValue={onChangeFee}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onPress={() => setIsEditingFee(true)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="add-circle-outline"
                      size={16}
                      color="#fff"
                    />
                    <Text style={[styles.text, { includeFontPadding: false }]}>
                      {numberToCurrency(fee)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.summaryContent}>
                <Text style={[styles.text, { fontSize: 16 }]}>
                  Preço total:
                </Text>
                <Text style={[styles.text, { fontSize: 16 }]}>
                  {numberToCurrency(finalPrice)}
                </Text>
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
        <TouchableOpacity
          style={[
            styles.button,
            { opacity: total <= 0 || disabled || isEditingFee ? 0.7 : 1 }
          ]}
          activeOpacity={0.8}
          disabled={total <= 0 || disabled || isEditingFee}
          onPress={onConfirm}
        >
          <Text
            style={[
              styles.text,
              {
                fontSize: 14,
                color: type === 'sale' ? colors.green[500] : colors.blue[500]
              }
            ]}
          >
            {isEditingFee
              ? 'Confirmando a taxa'
              : type === 'sale'
                ? 'Finalizar Venda'
                : 'Finalizar Saída'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
