import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  placeholder: string;
  mini?: boolean;
  children?: React.ReactNode;
}

export function Input({ label, mini = false, children, ...rest }: Props) {
  return (
    <View style={[styles.container, mini ? { flex: 1 } : null]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          {...rest}
        />
        {children}
      </View>
    </View>
  );
}
