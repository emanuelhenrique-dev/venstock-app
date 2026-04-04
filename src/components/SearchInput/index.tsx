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
import { useState } from 'react';
import { ScannerButton } from '../ScannerButton';

interface Props extends TextInputProps {
  placeholder: string;
}

export function SearchInput({ ...rest }: Props) {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="search" size={24} color={colors.gray[400]} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          {...rest}
          value={searchText}
          onChangeText={setSearchText}
          cursorColor={colors.blue[400]}
        />
      </View>

      <ScannerButton
        onScanResult={(codigo) => {
          setSearchText(codigo); // O valor volta do componente e preenche o input!
          console.log('Produto escaneado:', codigo);
        }}
      />
      {/* 
      <TouchableOpacity activeOpacity={0.7}>
        <MaterialIcons
          name="document-scanner"
          size={24}
          color={colors.gray[500]}
        />
      </TouchableOpacity> */}
    </View>
  );
}
