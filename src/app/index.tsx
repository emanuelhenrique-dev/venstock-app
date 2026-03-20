import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { CustomTitle } from '@/components/CustomTitle';
import { GradientText } from '@/components/GradientText';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { colors, fontFamily } from '@/theme';
import { userStorage } from '@/database/userStorage';

export default function Index() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const { saveUserData, getUserData } = userStorage();

  // Função para salvar e avançar
  const handleStart = async () => {
    if (userName.trim().length < 3) {
      Alert.alert('Ops!', 'Por favor, digite um nome válido para a loja.');
      return;
    }

    try {
      await saveUserData(userName, userImage);
      console.log('Dados salvos!');
      router.push('/(dashboard)');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seus dados.');
      console.log(error);
    }
  };

  //CHECAR SE EXISTE UM USUÁRIO
  async function checkExistingUser() {
    try {
      const data = await getUserData();
      if (data.name) {
        console.log('Usuário já esta logado');
        console.log('Logado como', data.name);
        console.log('imageUrl', data.image);
        router.replace('/(dashboard)');
      }
    } catch (error) {
      console.log('Error ao carregar dados', error);
    }
  }

  useEffect(() => {
    checkExistingUser();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              // Ajuste fino para o botão não sumir no Android
              keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 24,
                  paddingBottom: 20 // Aumentei um pouco para o botão respirar
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ImageInput
                    imageUri={userImage}
                    onChangeImage={setUserImage}
                    color1={colors.green[400]}
                    color2={colors.green[500]}
                  />

                  <CustomTitle
                    text1="Seja"
                    text2="Bem vindo ao"
                    gradient={[colors.green[400], colors.green[500]]}
                  />

                  <GradientText
                    style={{
                      fontSize: 32,
                      fontFamily: fontFamily.regular,
                      includeFontPadding: false
                    }}
                    color1={colors.green[500]}
                    color2={colors.blue[400]}
                  >
                    Venstock
                  </GradientText>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: fontFamily.medium,
                      fontSize: 13,
                      color: colors.black,
                      marginTop: 15,
                      lineHeight: 18,
                      includeFontPadding: false
                    }}
                  >
                    Para começar a organizar suas{' '}
                    <Text
                      style={{
                        color: colors.green[400],
                        fontFamily: fontFamily.semiBold
                      }}
                    >
                      vendas{' '}
                    </Text>
                    e{' '}
                    <Text
                      style={{
                        color: colors.blue[400],
                        fontFamily: fontFamily.semiBold
                      }}
                    >
                      estoque
                    </Text>{' '}
                    offline, diga-nos seu nome.
                  </Text>

                  <View style={{ width: '100%', marginTop: 25 }}>
                    <Input
                      placeholder="Digite seu nome ou nome da loja..."
                      value={userName}
                      onChangeText={setUserName}
                    />
                  </View>
                </View>

                <View style={{ marginTop: 20, width: '100%' }}>
                  <Button
                    text="Começar minhas vendas"
                    color1={colors.green[400]}
                    color2={colors.green[500]}
                    onPress={handleStart}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
