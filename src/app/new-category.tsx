import { Button } from '@/components/Button';
import { ColorInput } from '@/components/ColorInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryForm() {
  const param = useLocalSearchParams<{ id?: string }>();

  const [name, setName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors.blue[500]);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSave() {
    // if (!name.trim() || amount <= 0) {
    //   return Alert.alert(
    //     'Atenção',
    //     'Preencha o nome e o valor precisa ser maior que zero'
    //   );
    // }

    // setIsProcessing(true);

    if (param.id) {
      //   await update();
      console.log('categoria atualizada', param.id);
    } else {
      //   await create();
      console.log('categoria salva', param.id);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white, padding: 22 }}
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
            color1={colors.blue[400]}
            color2={colors.blue[500]}
            variant="category"
          />
          <Input
            label="NOME DA CATEGORIA*"
            placeholder="Digite seu nome ou nome da loja..."
            // value={}
            // onChangeText={}
          />
          <ColorInput
            label="COR DA CATEGORIA"
            placeholder="Digite seu nome ou nome da loja..."
          />
        </View>
        <View style={{ marginTop: 20, width: '100%' }}>
          <Button
            text={param.id ? 'Salvar Mudanças' : 'Criar nova Categoria'}
            color1={colors.blue[400]}
            color2={colors.blue[500]}
            onPress={handleSave}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
