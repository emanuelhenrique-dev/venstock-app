import { Button } from '@/components/Button';
import { ColorInput } from '@/components/ColorInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { PageHeader } from '@/components/PageHeader';
import { useCategoryDatabase } from '@/database/useCategoryDatabase';
import { colors } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryForm() {
  const param = useLocalSearchParams<{ id?: string }>();
  const categoryDatabase = useCategoryDatabase();

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
        await update();
        Alert.alert('Atualizar Categoria', 'Categoria atualizada com sucesso', [
          { text: 'Ok', onPress: () => router.back() }
        ]);
      } else {
        await create();
        Alert.alert('Nova Categoria', 'Nova Categoria criada com sucesso', [
          { text: 'Ok', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.log('Erro ao salvar categoria:', error);
      Alert.alert('Erro', 'Não foi possível salvar a categoria.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function create() {
    await categoryDatabase.create({
      name: categoryName.trim(),
      color: selectedColor,
      imageUrl: categoryImage ?? undefined
    });
  }

  async function update() {
    await categoryDatabase.updateCategory({
      id: Number(param.id),
      name: categoryName.trim(),
      color: selectedColor,
      imageUrl: categoryImage ?? undefined
    });
  }

  async function handleRemove() {
    if (!param.id) {
      return;
    }

    Alert.alert('Remover', 'Deseja realmente remover esta Categoria?', [
      { text: 'não', style: 'cancel' },
      {
        text: 'sim',
        style: 'destructive',
        onPress: remove
      }
    ]);
  }

  async function remove() {
    try {
      setIsProcessing(true);

      await categoryDatabase.removeCategory(Number(param.id));

      Alert.alert('Remover Categoria', 'Categoria removida!', [
        { text: 'Ok', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a Categoria.');
      console.log(error);
      setIsProcessing(false);
    }
  }

  async function loadCategoryData(id: number) {
    try {
      const currentCategory = await categoryDatabase.show(id);

      if (currentCategory) {
        setCategoryName(currentCategory.name);
        setCategoryImage(currentCategory.imageUrl ?? null);
        setSelectedColor(currentCategory.color);
      }
    } catch (error) {
      console.log('Erro ao carregar dados da categoria para edição:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da categoria.');
    }
  }

  useEffect(() => {
    if (param.id) {
      loadCategoryData(Number(param.id));
    }
  }, [param.id]);

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
                    onPress: () => handleRemove()
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
            placeholder="Ex: Gelados"
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
