// src/components/CategorySelect.tsx
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontFamily } from '@/theme';
import { Button } from '../Button';
import { styles } from './styles';
// Importe o seu botão

interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  label: string;
  options: Category[];
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
}

export function CategorySelect({
  label,
  options,
  selectedCategory,
  onSelect
}: CategorySelectProps) {
  const [isVisible, setIsVisible] = useState(false);

  function handleSelect(category: Category) {
    onSelect(category);
    setIsVisible(false);
  }

  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>

      {/* O "Botão" que parece um Input */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
        style={styles.container}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedCategory && { color: colors.gray[400] }
          ]}
        >
          {selectedCategory ? selectedCategory.name : 'Selecione uma categoria'}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={colors.gray[400]}
        />
      </TouchableOpacity>

      {/* Modal Interno */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.indicator}
                  onPressIn={() => setIsVisible(false)}
                />

                <Text style={styles.modalTitle}>Categorias</Text>

                <FlatList
                  data={options}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleSelect(item)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedCategory?.id === item.id && {
                            color: colors.blue[500],
                            fontFamily: 'Poppins_700Bold'
                          }
                        ]}
                      >
                        {item.name}
                      </Text>
                      {selectedCategory?.id === item.id && (
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={colors.blue[500]}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
