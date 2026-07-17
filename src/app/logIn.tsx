import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
  Alert,
  TouchableOpacity
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '@/components/Button';
import { CustomTitle } from '@/components/CustomTitle';
import { GradientText } from '@/components/GradientText';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { colors, fontFamily } from '@/theme';
import { userStorage } from '@/database/userStorage';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { Loading } from '@/components/Loading';

import { useAuth } from '@/hooks/useAuth';

export default function LogIn() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isNavigatingAbout, setIsNavigatingAbout] = useState(false);

  const { loggedIn } = useAuth();
  const router = useRouter();

  // Função para salvar e avançar
  const handleStart = async () => {
    if (userName.trim().length < 3) {
      Alert.alert('Ops!', 'Por favor, digite um nome válido para a loja.');
      return;
    }

    try {
      await loggedIn(userName, userImage, colors.green[500]);
      console.log('Dados salvos!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar seus dados.');
      console.log(error);
    }
  };

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
        <TouchableOpacity
          onPress={async () => {
            if (isNavigatingAbout) return;
            setIsNavigatingAbout(true);
            try {
              await router.push('/about');
            } finally {
              setIsNavigatingAbout(false);
            }
          }}
          disabled={isNavigatingAbout}
          style={{
            position: 'absolute',
            top: 62,
            right: 24,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 6,
            opacity: isNavigatingAbout ? 0.7 : 1
          }}
        >
          <MaterialIcons name="info" size={24} color={colors.green[500]} />
        </TouchableOpacity>

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
