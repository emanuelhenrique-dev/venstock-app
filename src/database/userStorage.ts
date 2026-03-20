import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const USER_NAME_KEY = '@venstock:user_name-1.0.1';
const USER_IMAGE_KEY = '@venstock:user_image-1.0.1';

export function userStorage() {
  // Salvar usuário
  async function saveUserData(name: string, image: string | null) {
    try {
      await AsyncStorage.setItem(USER_NAME_KEY, name);
      if (image) {
        await AsyncStorage.setItem(USER_IMAGE_KEY, image);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o usuário');
      console.log(error);
    }
  }

  // Buscar informações do usuário
  async function getUserData() {
    try {
      // ADICIONADO O AWAIT AQUI
      const name = await AsyncStorage.getItem(USER_NAME_KEY);
      // CORRIGIDO PARA A CHAVE DE IMAGEM
      const image = await AsyncStorage.getItem(USER_IMAGE_KEY);

      return { name, image };
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar dados do usuário');
      console.log(error);
      return { name: null, image: null };
    }
  }

  // LIMPAR (Útil para logout ou reset)
  async function clearUserData() {
    try {
      await AsyncStorage.removeItem(USER_NAME_KEY);
      await AsyncStorage.removeItem(USER_IMAGE_KEY);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível apagar os dados usuário');
      console.error('Erro ao limpar no loader:', error);
    }
  }

  return { saveUserData, getUserData, clearUserData };
}
