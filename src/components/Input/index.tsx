import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  placeholder: string;
}

export function Input({ label, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        {...rest}
      />
    </View>
  );
}
