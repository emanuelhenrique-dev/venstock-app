import { Text, View } from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';

import Input, { CurrencyInputProps } from 'react-native-currency-input';

interface Props extends CurrencyInputProps {
  label?: string;
  mini?: boolean;
}

export function CurrencyInput({ label, mini = false, ...rest }: Props) {
  return (
    <View style={[styles.container, mini ? { flex: 1 } : null]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Input
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        prefix="R$ "
        delimiter="."
        separator=","
        minValue={0}
        {...rest}
      />
    </View>
  );
}
