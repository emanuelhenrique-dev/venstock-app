import { Button } from '@/components/Button';
import { CategorySelect, SelectedCategory } from '@/components/CategorySelect';
import { ColorInput } from '@/components/ColorInput';
import { CurrencyInput } from '@/components/CurrencyInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ScannerButton } from '@/components/ScannerButton';
import {
  ProductResponse,
  useProductDatabase
} from '@/database/useProductDatabase';
import { useCategoryDatabase } from '@/database/useCategoryDatabase';

export default function ProductForm() {
  const param = useLocalSearchParams<{
    id?: string;
    categoryId: string;
    categoryName: string;
  }>();

  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    id: '',
    name: ''
  });
  const [categoriesOptions, setCategoriesOptions] = useState<
    SelectedCategory[]
  >([]);
  const [selectedColor, setSelectedColor] = useState(colors.green[500]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [codBar, setCodBar] = useState('');
  const [productIdentifier, setProductIdentifier] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  const productDatabase = useProductDatabase();
  const categoryDatabase = useCategoryDatabase();

  async function handleSave() {
    // 1. Validações obrigatórias
    if (!productName.trim()) {
      return Alert.alert(
        'Atenção',
        'Por favor, digite um nome para o produto.'
      );
    }

    if (price <= 0) {
      return Alert.alert(
        'Atenção',
        'Por favor, defina um preço válido para o produto.'
      );
    }

    if (!selectedCategory?.id) {
      return Alert.alert(
        'Atenção',
        'Por favor, selecione uma categoria para este produto.'
      );
    }

    setIsProcessing(true);

    try {
      if (param.id) {
        await update();
        Alert.alert('Atualizar Produto', 'Produto atualizado com sucesso!', [
          { text: 'Ok', onPress: () => router.back() }
        ]);
      } else {
        await create();
        Alert.alert('Novo Produto', 'Produto cadastrado com sucesso!', [
          { text: 'Ok', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.log('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      // Garante que o botão destrave independente de dar certo ou erro
      setIsProcessing(false);
    }
  }

  async function create() {
    // Tratamento dos campos de estoque (igual ao seu rascunho seguro)
    const stockNumber = stock.trim() === '' ? 0 : Number(stock);
    const minStockNumber = minStock.trim() === '' ? 0 : Number(minStock);

    await productDatabase.create({
      name: productName.trim(),
      price: price, // Já vem como number do seu CurrencyInput
      qtdEstoque: stockNumber,
      minEstoque: minStockNumber,
      codBar: codBar.trim() || undefined, // Se estiver vazio, envia undefined (salva nulo no banco)
      identifier: productIdentifier.trim() || undefined,
      color: selectedColor,
      imageUrl: productImage ?? undefined,
      category_id: Number(selectedCategory?.id)
    });
  }

  async function update() {
    const stockNumber = stock.trim() === '' ? 0 : Number(stock);
    const minStockNumber = minStock.trim() === '' ? 0 : Number(minStock);

    await productDatabase.updateProduct({
      id: Number(param.id),
      name: productName.trim(),
      price: price,
      qtdEstoque: stockNumber,
      minEstoque: minStockNumber,
      codBar: codBar.trim() || undefined,
      identifier: productIdentifier.trim() || undefined,
      color: selectedColor,
      imageUrl: productImage ?? undefined,
      category_id: Number(selectedCategory?.id)
    });
  }

  async function handleRemove() {
    if (!param.id || Array.isArray(param.id)) {
      return;
    }

    Alert.alert('Remover', 'Deseja realmente remover este produto?', [
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

      await productDatabase.removeProduct(Number(param.id));

      Alert.alert('Remover Produto', 'Produto removido!', [
        { text: 'Ok', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o produto.');
      console.log(error);
      setIsProcessing(false);
    }
  }

  // Função para buscar as categorias do seletor
  async function fetchCategoriesOptions(): Promise<SelectedCategory[]> {
    try {
      const response = await categoryDatabase.getAll();
      console.log('1. Resposta Bruta do Banco:', response);
      return response.map((category) => ({
        id: String(category.id),
        name: category.name
      }));
    } catch (error) {
      console.log('Erro ao buscar categorias para o seletor:', error);
      return [];
    }
  }

  // Função para buscar os dados do produto caso seja edição
  async function fetchProductDetails(
    productId: number
  ): Promise<ProductResponse | null> {
    try {
      return await productDatabase.show(productId);
    } catch (error) {
      console.log(`Erro ao buscar o produto com ID ${productId}:`, error);
      return null;
    }
  }

  async function fetchData() {
    try {
      setIsProcessing(true);

      // Criamos as promessas em paralelo
      const categoriesPromise = fetchCategoriesOptions();
      const productPromise = param.id
        ? fetchProductDetails(Number(param.id))
        : Promise.resolve(null);

      // Aguardamos ambas responderem juntas com o Promise.all
      const [categoriesData, productData] = await Promise.all([
        categoriesPromise,
        productPromise
      ]);

      // Alimenta o seletor de categorias
      setCategoriesOptions(categoriesData);

      // Se retornou um produto (Cenário de Edição), popula os inputs do formulário
      if (productData) {
        setProductName(productData.name);
        setPrice(productData.price);
        setStock(String(productData.qtdEstoque));
        setMinStock(String(productData.minEstoque));
        setCodBar(productData.codBar ?? '');
        setProductIdentifier(productData.identifier ?? '');
        setSelectedColor(productData.color);
        setProductImage(productData.imageUrl ?? null);

        // Seta a categoria do produto editado
        setSelectedCategory({
          id: String(productData.category_id),
          name: productData.category_name
        });
      } else if (param.categoryId && param.categoryName) {
        setSelectedCategory({
          id: param.categoryId,
          name: param.categoryName
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados da tela.');
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [param.id, param.categoryId, param.categoryName]);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingHorizontal: 22,
          paddingTop: 18
        }}
        edges={['bottom']}
      >
        <KeyboardWrapper>
          <View>
            <PageHeader
              title1={param.id ? 'Editar' : 'Novo'}
              title2="Produto"
              subtitle={
                param.id
                  ? 'Atualize as informações deste produto.'
                  : 'Configure os detalhes do novo produto.'
              }
              gradient={[colors.green[400], colors.green[500]]}
              back
              loading={isProcessing}
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
              imageUri={productImage}
              onChangeImage={setProductImage}
              color1={selectedColor}
              color2={selectedColor}
              variant="category"
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Input
                  label="NOME DO PRODUTO*"
                  placeholder="Digite o nome do produto"
                  value={productName}
                  onChangeText={setProductName}
                />
              </View>
              <View style={{ width: 98 }}>
                <Input
                  label="ID EXTRA"
                  placeholder="Opcional"
                  value={productIdentifier}
                  onChangeText={(text) =>
                    setProductIdentifier(text.toUpperCase().slice(0, 2))
                  }
                  maxLength={2}
                  inputStyle={{ textAlign: 'center' }}
                />
              </View>
            </View>
            <CategorySelect
              label="CATEGORIA*"
              options={categoriesOptions}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <CurrencyInput
                label="PREÇO DE VENDA*"
                value={price}
                onChangeValue={(value) => setPrice(value ?? 0)}
                mini
              />
              <Input
                label="CODIGO DO PRODUTO"
                placeholder="######"
                value={codBar}
                onChangeText={setCodBar}
                mini
              >
                <ScannerButton
                  onScanResult={(codigo) => {
                    setCodBar(codigo);
                    console.log('Produto escaneado:', codigo);
                  }}
                />
              </Input>
            </View>
            <View style={{ flexDirection: 'row', gap: 30, width: '100%' }}>
              <Input
                label="ESTOQUE ATUAL*"
                placeholder="00"
                value={stock}
                onChangeText={(text) => setStock(text.replace(/\D/g, ''))}
                keyboardType="numeric"
                mini
              />

              <Input
                label="ESTOQUE MÍNIMO"
                placeholder="00"
                value={minStock}
                onChangeText={(text) => setMinStock(text.replace(/\D/g, ''))}
                keyboardType="numeric"
                mini
              />
            </View>

            <ColorInput
              label="COR DA CATEGORIA"
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </View>
          <View style={{ marginTop: 18, width: '100%' }}>
            <Button
              text={param.id ? 'Salvar Mudanças' : 'Adicionar Produto'}
              color1={colors.green[400]}
              color2={colors.green[500]}
              onPress={handleSave}
              isProcessing={isProcessing}
            />
          </View>
        </KeyboardWrapper>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
