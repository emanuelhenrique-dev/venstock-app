import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface Props extends TextInputProps {
  placeholder: string;
}

export function SearchInput({ ...rest }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="search" size={24} color={colors.gray[400]} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          {...rest}
        />
      </View>

      <TouchableOpacity>
        <MaterialIcons
          name="document-scanner"
          size={24}
          color={colors.gray[500]}
        />
      </TouchableOpacity>
    </View>
  );
}
