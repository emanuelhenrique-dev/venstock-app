import React, { ReactNode, useRef, useState } from 'react'; // Importante para o Swipeable funcionar bem
import { MaterialIcons } from '@expo/vector-icons';
import { Text, ViewProps, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { CustomImage } from '../CustomImage';
import { colors } from '@/theme';
import { ProductCardProps } from '../ProductsListOverlay';

// Mudamos para a importação estável (sem o /Reanimated)
import Swipeable, {
  SwipeableMethods
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../Input';

type ProductCardVariant = 'stock' | 'sell' | 'remove';
interface Props extends ViewProps {
  data: ProductCardProps;
  leftAction: {
    onOpen: () => void;
    icon: keyof typeof MaterialIcons.glyphMap;
  };
  variant?: ProductCardVariant;
  children?: ReactNode;
}

export function ProductCard({
  data,
  leftAction,
  variant = 'stock',
  children,
  ...rest
}: Props) {
  const [quantity, setQuantity] = useState(0);
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  async function handleSwipeable() {
    swipeableRef.current?.close();
    await leftAction.onOpen();
  }

  // Funções para manipular a quantidade
  const handleAdd = () => setQuantity((prev) => (prev < 999 ? prev + 1 : 999));
  const handleRemove = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  // O que vai aparecer atrás do card
  const renderLeftActions = () => (
    <RectButton style={styles.option} activeOpacity={0.9}>
      <MaterialIcons name={leftAction.icon} size={24} color="#fff" />
    </RectButton>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      overshootLeft={false}
      dragOffsetFromLeftEdge={40}
      leftThreshold={50}
      containerStyle={styles.swipeableContainer}
      activeOffsetX={[-10, 10]}
      onSwipeableWillOpen={handleSwipeable}
      ref={swipeableRef}
    >
      <View style={styles.container} {...rest}>
        <CustomImage
          image={null}
          size={50}
          color={colors.blue[400]}
          variant="product"
        />
        <View style={styles.content}>
          {variant == 'stock' && (
            <View style={styles.statusContainer}>
              <View style={styles.statusContent}>
                <MaterialIcons
                  name="inventory"
                  color={colors.blue[400]}
                  size={10}
                />
                <Text style={[styles.status, { color: colors.blue[400] }]}>
                  {data.qtdEstoque} em estoque
                </Text>
              </View>
              <View style={styles.statusContent}>
                <MaterialIcons
                  name="shopping-bag"
                  size={10}
                  color={colors.green[500]}
                />
                <Text style={[styles.status, { color: colors.green[500] }]}>
                  {data.qtdVendidos} vendidos
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          <View style={styles.details}>
            {children ? (
              children // Se você passou algo personalizado, ele renderiza aqui
            ) : (
              // Se não passou nada, renderiza o preço padrão (Fallback)
              <Text
                style={[
                  styles.status,
                  { color: colors.green[500], fontSize: 12 }
                ]}
              >
                R$ {data.price.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>
        </View>
        {/* LÓGICA DO BOTÃO DINÂMICO */}
        <View style={styles.actionContainer}>
          {quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <MaterialIcons
                name="add-shopping-cart"
                size={24}
                color={colors.green[500]}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={handleRemove}
                style={[
                  styles.qtyButton,
                  { backgroundColor: colors.green[100] }
                ]}
              >
                <MaterialIcons
                  name="remove"
                  size={16}
                  color={colors.green[500]}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityText}
                value={quantity.toString()}
                onChangeText={(text) => {
                  // Remove qualquer coisa que não seja número
                  const numericValue = text.replace(/[^0-9]/g, '');
                  const finalValue = parseInt(numericValue) || 0;

                  // Se o valor for maior que 999, trava no 999
                  if (finalValue > 999) {
                    setQuantity(999);
                  } else {
                    setQuantity(finalValue);
                  }
                }}
                cursorColor={colors.blue[400]}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                onPress={handleAdd}
                style={{ opacity: quantity >= 999 ? 0.1 : 1 }}
              >
                <LinearGradient
                  colors={[colors.green[400], colors.green[500]]}
                  style={styles.qtyButton}
                >
                  <MaterialIcons name="add" size={16} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Swipeable>
  );
}
