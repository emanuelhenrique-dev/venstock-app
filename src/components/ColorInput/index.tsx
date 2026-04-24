import { Text, TouchableOpacity, View } from 'react-native';
import { ColorPickerDialog } from 'react-native-ui-lib';
import { styles } from './styles';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  label: string;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
}

export function ColorInput({ label, selectedColor, setSelectedColor }: Props) {
  const [colors, setColors] = useState<string[]>([
    '#EF4444', // vermelho
    '#EC4899', // rosa
    '#FACC15', // amarelo
    '#5DAA18', // verde
    '#040305', // roxo
    '#155794' // azul
  ]);

  const [showPicker, setShowPicker] = useState(false);

  function handleSubmit(newColor: string) {
    setColors((prev) => {
      const filtered = prev.filter((c) => c !== newColor);
      return [newColor, ...filtered].slice(0, 6);
    });
    setSelectedColor(newColor);
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.colorsInput}>
        <TouchableOpacity
          style={[styles.color, { borderWidth: 1, borderColor: 'black' }]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="add" size={20} />
        </TouchableOpacity>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.color, { backgroundColor: color }]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor == color ? (
              <MaterialIcons name="done" size={20} color={'white'} />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      <ColorPickerDialog
        initialColor={selectedColor}
        onDismiss={() => setShowPicker(false)}
        onSubmit={(newColor) => handleSubmit(newColor)}
        visible={showPicker}
        containerStyle={{ backgroundColor: 'red' }}
        dialogProps={{
          centerV: true,
          bottom: false
        }}
      />
    </View>
  );
}
