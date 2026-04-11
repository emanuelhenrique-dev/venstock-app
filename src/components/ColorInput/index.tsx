import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  label?: string;
  placeholder: string;
}

export function ColorInput({ label, ...rest }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.colorsInput}>
        <View style={[styles.color, { borderWidth: 1, borderColor: 'black' }]}>
          <MaterialIcons name="add" size={20} />
        </View>
        <View style={[styles.color, { backgroundColor: '#0627FF' }]} />
        <View style={[styles.color, { backgroundColor: '#FF0000' }]} />
        <View style={[styles.color, { backgroundColor: '#00FF1E' }]} />
        <View style={[styles.color, { backgroundColor: '#FFEA00' }]} />
        <View style={[styles.color, { backgroundColor: '#0080F6' }]} />
      </View>
    </View>
  );
}
