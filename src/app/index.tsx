import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Platform, StatusBar, Alert } from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { CustomTitle } from '@/components/CustomTitle';
import { GradientText } from '@/components/GradientText';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { colors, fontFamily } from '@/theme';
import { userStorage } from '@/database/userStorage';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { Loading } from '@/components/Loading';

export default function Index() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  const { saveUserData, getUserData } = userStorage();

  // Função para salvar e avançar
  const handleStart = async () => {
    if (userName.trim().length < 3) {
      Alert.alert('Ops!', 'Por favor, digite um nome válido para a loja.');
      return;
    }

    try {
      await saveUserData(userName, userImage, colors.green[500]);
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
      // Verificação rigorosa: se não tiver nome, não redireciona
      if (data && data.name) {
        router.replace('/(dashboard)');
      } else {
        setUserName('');
        setUserImage(null);
        setIsChecking(false); // Libera a tela de boas-vindas
      }
    } catch (error) {
      setIsChecking(false);
      console.log('Error ao carregar dados', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      checkExistingUser();
    }, [])
  );

  // Enquanto checa o banco, não mostra nada (ou um spinner)
  if (isChecking) return <Loading height={300} width={300} />;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: 24
        }}
        edges={['bottom']}
      >
        <KeyboardWrapper
          keyboardVerticalOffset={Platform.OS === 'android' ? -30 : 0}
          // contentContainerStyle do scroll view
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 60
          }}
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
        </KeyboardWrapper>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
