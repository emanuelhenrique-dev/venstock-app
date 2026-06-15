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
  value: string;
  onChangeText: (text: string) => void;
  setIsSearching: (searching: boolean) => void;
}

export function SearchInput({
  value,
  onChangeText,
  setIsSearching,
  ...rest
}: Props) {
  // Função interna que intercepta a digitação ou o scanner
  function handleTextChange(text: string) {
    // Se tem texto, liga o loading imediatamente! Se limpou, desliga.
    if (text.trim().length > 0) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    // Repassa o texto para a tela pai atualizar o estado global da busca
    onChangeText(text);
  }

  function handleClearInput() {
    onChangeText(''); // Limpa o texto no componente pai
    setIsSearching(false); // Desliga o loading imediatamente
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="search" size={24} color={colors.gray[400]} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          {...rest}
          value={value}
          onChangeText={handleTextChange}
          cursorColor={colors.blue[400]}
        />
      </View>

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClearInput}
          activeOpacity={0.5}
          style={{ paddingHorizontal: 12 }} // Garante uma área boa de clique
        >
          <MaterialIcons name="close" size={20} color={colors.gray[500]} />
        </TouchableOpacity>
      )}

      <ScannerButton
        onScanResult={(codigo) => {
          handleTextChange(codigo); // O valor volta do componente e preenche o input!
          console.log('Produto escaneado:', codigo);
        }}
      />
    </View>
  );
}
