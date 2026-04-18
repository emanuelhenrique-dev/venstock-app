import { Button } from '@/components/Button';
import { ColorInput } from '@/components/ColorInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryForm() {
  const param = useLocalSearchParams<{ id?: string }>();

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors.blue[500]);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSave() {
    if (!categoryName.trim()) {
      return Alert.alert(
        'Atenção',
        'Por favor, digite um nome para a categoria.'
      );
    }

    setIsProcessing(true);

    try {
      if (param.id) {
        // Lógica de Update virá aqui
        console.log('Atualizando categoria:', {
          id: param.id,
          name: categoryName,
          color: selectedColor,
          image: categoryImage
        });
      } else {
        // Lógica de Create virá aqui
        console.log('Salvando nova categoria:', {
          name: categoryName,
          color: selectedColor,
          image: categoryImage
        });
      }

      // Simulação de delay de salvamento
      setTimeout(() => {
        setIsProcessing(false);
        router.back();
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
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
            title1={param.id ? 'Editar' : 'Nova'}
            title2="Categoria"
            subtitle={
              param.id
                ? 'Atualize as informações deste grupo de produtos.'
                : 'Configure um novo grupo de produtos.'
            }
            gradient={[colors.blue[400], colors.blue[500]]}
            back
            button={
              param.id
                ? {
                    icon: 'delete',
                    onPress: () => {
                      console.log('lixeira apertada para o id:', param.id);
                    }
                  }
                : undefined
            }
          />
        </View>

        <View style={{ flex: 1, marginTop: 10, gap: 20 }}>
          <ImageInput
            imageUri={categoryImage}
            onChangeImage={setCategoryImage}
            color1={selectedColor}
            color2={selectedColor}
            variant="category"
          />
          <Input
            label="NOME DA CATEGORIA*"
            placeholder="Digite seu nome ou nome da loja..."
            value={categoryName}
            onChangeText={setCategoryName}
          />
          <ColorInput
            label="COR DA CATEGORIA"
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </View>
        <View style={{ marginVertical: 10, width: '100%' }}>
          <Button
            text={param.id ? 'Salvar Mudanças' : 'Criar nova Categoria'}
            color1={colors.blue[400]}
            color2={colors.blue[500]}
            onPress={handleSave}
            isProcessing={isProcessing}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
