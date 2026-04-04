import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // Import moderno

import { colors } from '@/theme';

// IMPORTANTE: Importe aqui a sua imagem PNG que já tem o "furo" transparente
import molduraScannerMascote from '../../../assets/moldura-scanner-venstock.png';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

interface Props {
  onScanResult: (data: string) => void;
  size?: number;
  color?: string;
}

export function ScannerButton({
  onScanResult,
  size = 24,
  color = colors.gray[500]
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  async function handleOpenScanner() {
    const { granted } = await requestPermission();
    if (granted) {
      setIsModalVisible(true);
    } else {
      alert('Precisamos de permissão para acessar a câmera.');
    }
  }

  function handleBarcodeScanned({ data }: { data: string }) {
    if (data) {
      setIsModalVisible(false);
      onScanResult(data);
    }
  }

  return (
    <>
      <TouchableOpacity onPress={handleOpenScanner} activeOpacity={0.7}>
        <MaterialIcons name="document-scanner" size={size} color={color} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="fade" // Fade fica mais suave com imagem estática
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.container}>
          {/* 1. Camada do fundo (Z-Index 0): A Câmera (ocupa tudo) */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />

          {/* 2. Camada do meio (Z-Index 1): Sua imagem editada com o "buraco" 
              Como ela tem um furo transparente no meio, a câmera aparece ali.
          */}
          <Image
            source={molduraScannerMascote}
            style={styles.mascoteBackground}
            resizeMode="cover"
          />
          <Text style={styles.instruction}>Aproxime o código de barras</Text>

          {/* Camada do topo (Z-Index 2): Botão de Fechar */}
          <TouchableOpacity
            onPress={() => setIsModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Fechar Scanner</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
