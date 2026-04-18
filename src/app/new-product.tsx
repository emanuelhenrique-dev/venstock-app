import { Button } from '@/components/Button';
import { CategorySelect } from '@/components/CategorySelect';
import { ColorInput } from '@/components/ColorInput';
import { CurrencyInput } from '@/components/CurrencyInput';
import { ImageInput } from '@/components/ImageInput';
import { Input } from '@/components/Input';
import { KeyboardWrapper } from '@/components/KeyboardWrapper';
import { PageHeader } from '@/components/PageHeader';
import { colors } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '@/database/categories';
import { ScannerButton } from '@/components/ScannerButton';

export default function ProductForm() {
  const param = useLocalSearchParams<{ id?: string }>();

  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>({ id: '1', name: 'Gelados' });
  const [selectedColor, setSelectedColor] = useState(colors.green[500]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [codBar, setCodBar] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSave() {
    // 1. Sanitização e Conversão
    // Convertemos as strings para números apenas aqui no momento do salvamento
    const stockNumber = stock.trim() === '' ? 0 : Number(stock);
    const minStockNumber = minStock.trim() === '' ? 0 : Number(minStock);

    // 2. Validações de Segurança
    if (!productName.trim()) {
      return Alert.alert('Atenção', 'O nome do produto é obrigatório.');
    }

    if (price <= 0) {
      return Alert.alert(
        'Atenção',
        'O preço de venda deve ser maior que zero.'
      );
    }

    // Validamos se o estoque é um número válido (caso o usuário tenha digitado algo estranho)
    if (isNaN(stockNumber)) {
      return Alert.alert('Atenção', 'O valor do estoque atual não é válido.');
    }

    if (stockNumber <= 0) {
      return Alert.alert(
        'Atenção',
        'O estoque inicial tem que ser maior que zero.'
      );
    }

    // 3. Início do Processo de Salvamento
    setIsProcessing(true);

    try {
      // Montagem do objeto final que vai para o Banco de Dados (SQLite/API)
      const productData = {
        name: productName.trim(),
        image: productImage,
        color: selectedColor,
        price: price, // Já é number vindo do CurrencyInput
        stock: stockNumber,
        minStock: minStockNumber,
        codBar: codBar.trim()
      };

      if (param.id) {
        // Aqui entrará sua função de update: await updateProduct(param.id, productData);
        console.log('📝 Atualizando produto ID:', param.id, productData);
      } else {
        // Aqui entrará sua função de create: await createProduct(productData);
        console.log('✅ Salvando novo produto:', productData);
      }

      // Simulação de latência de rede/banco
      setTimeout(() => {
        setIsProcessing(false);

        // Feedback visual opcional
        // Alert.alert('Sucesso', 'Produto registrado com sucesso!');

        router.back();
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setIsProcessing(false);
      Alert.alert('Erro', 'Não foi possível salvar as informações do produto.');
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
              imageUri={productImage}
              onChangeImage={setProductImage}
              color1={selectedColor}
              color2={selectedColor}
              variant="category"
            />
            <Input
              label="NOME DA PRODUTO*"
              placeholder="Digite o nome do produto"
              value={productName}
              onChangeText={setProductName}
            />
            <CategorySelect
              label="CATEGORIA*"
              options={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory} // Passa a função diretamente
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
                    setCodBar(codigo); // O valor volta do componente e preenche o input!
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
                onChangeText={setStock}
                keyboardType="numeric"
                mini
              />

              <Input
                label="ESTOQUE MÍNIMO"
                placeholder="00"
                value={minStock}
                onChangeText={setMinStock}
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
          <View style={{ marginTop: 40, width: '100%' }}>
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
