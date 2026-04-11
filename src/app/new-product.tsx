import { colors } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ProductForm() {
  const param = useLocalSearchParams<{ id?: string }>();

  const [name, setName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors.blue[500]);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSave() {
    console.log('categoria salva');
    // if (!name.trim() || amount <= 0) {
    //   return Alert.alert(
    //     'Atenção',
    //     'Preencha o nome e o valor precisa ser maior que zero'
    //   );
    // }

    // setIsProcessing(true);

    // if (param.id) {
    //   await update();
    // } else {
    //   await create();
    // }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white, padding: 32 }}
        edges={['bottom']}
      ></SafeAreaView>
    </SafeAreaProvider>
  );
}
