import React, { useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Pressable,
  Alert,
  Appearance
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/theme';
import { styles } from './styles'; // Importando os estilos fixos

// Importação dos Placeholders
import placeholderProfile from '../../../assets/generic_imageProfile.png';
import placeholderCategory from '../../../assets/generic_category.png';
import placeholderProduct from '../../../assets/generic_product.png';

type ImageInputVariant = 'profile' | 'category' | 'product';

interface Props {
  imageUri: string | null;
  onChangeImage: (uri: string | null) => void;
  color1: string;
  color2: string;
  variant?: ImageInputVariant;
}

Appearance.setColorScheme('dark');

export function ImageInput({
  imageUri,
  onChangeImage,
  color1,
  color2,
  variant = 'profile'
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  // Define qual placeholder exibir baseado na variante
  const getPlaceholder = () => {
    switch (variant) {
      case 'category':
        return placeholderCategory;
      case 'product':
        return placeholderProduct;
      default:
        return placeholderProfile;
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.canceled) onChangeImage(result.assets[0].uri);
  };

  const pickImage = async () => {
    setModalVisible(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso às suas fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.canceled) onChangeImage(result.assets[0].uri);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        style={styles.container}
      >
        <Image
          source={imageUri ? { uri: imageUri } : getPlaceholder()}
          style={styles.image}
        />

        <LinearGradient
          colors={[color1, color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <MaterialIcons name="edit" size={18} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal de Opções */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Selecione uma opção</Text>

            <TouchableOpacity style={styles.option} onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={24} color={color2} />
              <Text style={styles.optionText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color={color2} />
              <Text style={styles.optionText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            {imageUri && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onChangeImage(null);
                  setModalVisible(false);
                }}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color="#FF4444"
                />
                <Text style={[styles.optionText, { color: '#FF4444' }]}>
                  Remover Foto
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
