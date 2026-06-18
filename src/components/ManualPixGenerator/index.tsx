import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { colors } from '@/theme';
import { styles } from './styles';

const ASYNC_STORAGE_KEY = '@meu_app:manual_pix_code';

export default function ManualPixGenerator() {
  const [inputPix, setInputPix] = useState('');
  const [pixSalvo, setPixSalvo] = useState('');
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    async function loadStoredPix() {
      try {
        const cachedPix = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (cachedPix) {
          setPixSalvo(cachedPix);
          setInputPix(cachedPix);
          setShowInput(false);
        }
      } catch (error) {
        console.error('Error loading Pix:', error);
      }
    }
    loadStoredPix();
  }, []);

  const handleSavePix = async () => {
    if (!inputPix.trim()) {
      Alert.alert('Aviso', 'Por favor, digite ou cole um código Pix válido.');
      return;
    }
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, inputPix.trim());
      setPixSalvo(inputPix.trim());
      setShowInput(false);
      Alert.alert('Sucesso!', 'Código Pix salvo com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o Pix.');
      console.error(error);
    }
  };

  const handleEditPix = () => {
    Alert.alert(
      'Alterar Pix',
      'Deseja realmente alterar o código Pix configurado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, alterar', onPress: () => setShowInput(true) }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* 📝 SEÇÃO DO INPUT */}
      {showInput && (
        <>
          <Text style={styles.inputTitle}>Configurar Código Pix ou Link:</Text>

          <TextInput
            style={styles.input}
            placeholder="Cole o código Pix ou Link aqui..."
            placeholderTextColor={colors.gray[400]}
            value={inputPix}
            onChangeText={setInputPix}
            multiline
          />

          <TouchableOpacity onPress={handleSavePix} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Salvar Dados do Pix</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🔄 SEÇÃO DO QR CODE */}
      {!showInput && pixSalvo && (
        <View style={styles.qrWrapper}>
          <TouchableOpacity onPress={handleEditPix} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.gray[500]} />
          </TouchableOpacity>

          <View style={styles.qrCard}>
            <QRCode value={pixSalvo} size={180} color={colors.black} />
          </View>

          <Text style={styles.instructionsText}>
            Escaneie o QR Code acima para receber o pagamento via Pix ou copie o
            código abaixo:
          </Text>

          <View style={styles.copyContainer}>
            <Text numberOfLines={1} style={styles.copyText}>
              {pixSalvo}
            </Text>

            <TouchableOpacity
              onPress={async () => {
                await Clipboard.setStringAsync(pixSalvo);
                Alert.alert('Copiado!', 'Código Pix cobrado.');
              }}
            >
              <MaterialIcons
                name="content-copy"
                size={20}
                color={colors.green[500]}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* CASO VAZIO */}
      {!pixSalvo && !showInput && (
        <TouchableOpacity onPress={() => setShowInput(true)}>
          <Text style={styles.emptyText}>
            Toque aqui para configurar o seu Pix.
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
