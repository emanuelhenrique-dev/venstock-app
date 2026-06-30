import { Button } from '@/components/Button';
import { ColorInput } from '@/components/ColorInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { PageHeader } from '@/components/PageHeader';
import { userStorage } from '@/database/userStorage';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileForm() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.image || null
  );
  const [selectedColor, setSelectedColor] = useState(
    user?.color || colors.green[500]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      return Alert.alert(
        'Atenção',
        'Não é possível salvar o perfil sem um nome.'
      );
    }

    setIsProcessing(true);

    try {
      await updateUser(name, profileImage, selectedColor);

      setIsProcessing(false);
      router.back();
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
      Alert.alert('Erro', 'Não foi possível salvar a mudança do perfil.');
    }
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: 22,
          paddingTop: 22
        }}
        edges={['bottom']}
      >
        <View>
          <PageHeader
            title1="Editar"
            title2="Perfil"
            subtitle="Mude seu nome de exibição e a cor do seu perfil."
            gradient={[colors.green[400], colors.green[500]]}
            back
          />
        </View>

        <View style={{ flex: 1, marginTop: 10, gap: 20 }}>
          <ImageInput
            imageUri={profileImage}
            onChangeImage={setProfileImage}
            color1={selectedColor}
            color2={selectedColor}
            variant="profile"
          />
          <Input
            label="NOME DO PERFIL"
            placeholder="Digite seu nome ou nome da loja..."
            value={name}
            onChangeText={setName}
          />
          <ColorInput
            label="COR DO CONTORNO"
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </View>
        <View style={{ marginVertical: 10, width: '100%' }}>
          <Button
            text="Editar Perfil"
            color1={colors.green[400]}
            color2={colors.green[500]}
            onPress={handleSave}
            isProcessing={isProcessing}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
