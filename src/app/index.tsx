import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar
} from 'react-native';

// IMPORTANTE: Importar da biblioteca nova
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { CustomTitle } from '@/components/CustomTitle';
import { GradientText } from '@/components/GradientText';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { colors, fontFamily } from '@/theme';

export default function Index() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  return (
    // O SafeAreaProvider deve envolver a aplicação (pode estar aqui ou no seu _layout.tsx)
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
              // Mudamos para 'padding' em ambos, mas com ajuste de altura
              behavior={'padding'}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 24,
                  paddingBottom: 20
                }}
                // IMPORTANTE: Isso ajuda o ScrollView a entender o teclado
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

                  <CustomTitle text1="Seja" text2="Bem vindo ao" />

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
                    onPress={() => {
                      Keyboard.dismiss();
                      console.log('Nome:', userName);
                    }}
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
