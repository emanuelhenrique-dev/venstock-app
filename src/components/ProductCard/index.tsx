import React, { memo, ReactNode, useEffect, useRef, useState } from 'react'; // Importante para o Swipeable funcionar bem
import { MaterialIcons } from '@expo/vector-icons';
import { Text, ViewProps, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { CustomImage } from '../CustomImage';
import { colors } from '@/theme';
import { ProductCardProps } from '../ProductsListOverlay';

// Mudamos para a importação estável (sem o /Reanimated)
import Swipeable, {
  SwipeableMethods,
  SwipeDirection
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../Input';
import { numberToCurrency } from '@/utils/numberToCurrency';

type ProductCardVariant = 'stock' | 'sale' | 'withdrawal';

type SwipeAction = {
  onOpen: () => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  color?: string;
};
interface Props extends ViewProps {
  data: ProductCardProps;
  leftAction: SwipeAction;
  rightAction?: SwipeAction;
  variant?: ProductCardVariant;
  children?: ReactNode;

  quantity: number;
  onChangeQuantity: (newQuantity: number) => void;
}

function ProductCardComponent({
  data,
  leftAction,
  rightAction,
  variant = 'stock',
  children,
  quantity,
  onChangeQuantity,
  ...rest
}: Props) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const [showIdentifier, setShowIdentifier] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLowStock = data.qtdEstoque <= data.minStock;

  async function handleSwipeable(direction: SwipeDirection) {
    console.log(direction);
    swipeableRef.current?.close();

    // SwipeDirection.RIGHT -> Puxou para a direita (revela o lado esquerdo)
    if (direction === SwipeDirection.RIGHT) {
      await leftAction.onOpen();
    } // SwipeDirection.LEFT -> Puxou para a esquerda (revela o lado direito)
    else if (direction === SwipeDirection.LEFT && rightAction) {
      await rightAction.onOpen();
    }
  }

  function clearIdentifierTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function showIdentifierForSeconds() {
    setShowIdentifier(true);
    clearIdentifierTimer();
    timeoutRef.current = setTimeout(() => {
      setShowIdentifier(false);
    }, 3000);
  }

  useEffect(() => {
    return () => {
      clearIdentifierTimer();
    };
  }, []);

  // Funções agora apenas repassam a ordem para o pai
  const handleAdd = () => {
    if (quantity < 999) onChangeQuantity(quantity + 1);
  };

  const handleRemove = () => {
    if (variant === 'stock') {
      if (quantity > 0) onChangeQuantity(quantity - 1);
    } else {
      if (quantity > 1) onChangeQuantity(quantity - 1);
    }
  };

  // O que vai aparecer atrás do card
  const renderLeftActions = () => (
    <RectButton
      style={[
        styles.option,
        leftAction.color && { backgroundColor: leftAction.color }
      ]}
      activeOpacity={0.9}
    >
      <MaterialIcons name={leftAction.icon} size={24} color="#fff" />
    </RectButton>
  );

  // Renderiza a ação da Direita
  const renderRightActions = () => {
    if (!rightAction) return null;
    return (
      <View
        style={[
          styles.option,
          rightAction.color && { backgroundColor: rightAction.color }
        ]}
      >
        <MaterialIcons name={rightAction.icon} size={24} color="#fff" />
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={rightAction ? renderRightActions : undefined}
      overshootLeft={false}
      overshootRight={false}
      dragOffsetFromLeftEdge={40}
      dragOffsetFromRightEdge={60}
      leftThreshold={50}
      rightThreshold={50}
      containerStyle={styles.swipeableContainer}
      activeOffsetX={[-10, 10]}
      onSwipeableWillOpen={(direction) => handleSwipeable(direction)}
      ref={swipeableRef}
    >
      <View
        style={[
          styles.container,
          leftAction.color && { borderColor: leftAction.color }
        ]}
        {...rest}
      >
        <TouchableOpacity
          style={styles.imageWrapper}
          activeOpacity={0.85}
          onPress={() => showIdentifierForSeconds()}
        >
          <CustomImage
            image={data.imageUrl || null}
            size={50}
            color={data.color || colors.blue[400]}
            variant="product"
          />
          {data.identifier && showIdentifier ? (
            <View style={styles.identifierOverlay}>
              <Text style={styles.identifierText}>{data.identifier}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
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
                  {data.qtdEstoque} em estoque{' '}
                </Text>
                {isLowStock && (
                  <MaterialIcons
                    name="warning"
                    color={colors.yellow[300]}
                    size={12}
                    style={{ marginLeft: -5 }}
                  />
                )}
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
              children
            ) : (
              // Se não passou nada, renderiza o preço padrão (Fallback)
              <Text
                style={[
                  styles.status,
                  { color: colors.green[500], fontSize: 12 }
                ]}
              >
                {numberToCurrency(data.price)}
              </Text>
            )}
          </View>
        </View>
        {/* LÓGICA DO BOTÃO DINÂMICO */}
        <View style={styles.actionContainer}>
          {quantity === 0 && variant === 'stock' ? (
            <TouchableOpacity
              style={[
                styles.addButton,
                { opacity: quantity >= data.qtdEstoque ? 0.3 : 1 }
              ]}
              onPress={handleAdd}
              disabled={quantity >= data.qtdEstoque}
            >
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
                disabled={variant !== 'stock' && quantity === 1}
                style={[
                  styles.qtyButton,
                  {
                    backgroundColor:
                      variant === 'withdrawal'
                        ? colors.blue[100]
                        : colors.green[100],
                    opacity: quantity === 1 && variant !== 'stock' ? 0.4 : 1
                  }
                ]}
              >
                <MaterialIcons
                  name="remove"
                  size={16}
                  color={
                    variant === 'withdrawal'
                      ? colors.blue[500]
                      : colors.green[500]
                  }
                />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityText}
                value={quantity.toString()}
                readOnly={variant === 'stock'}
                onChangeText={(text) => {
                  // Remove qualquer coisa que não seja número
                  const numericValue = text.replace(/[^0-9]/g, '');
                  let finalValue = parseInt(numericValue) || 0;

                  // Se estiver no checkout, não deixa apagar e ficar vazio ou 0
                  if (variant !== 'stock' && finalValue < 1) finalValue = 1;

                  // Se o valor for maior que 999, trava no 999
                  if (finalValue > 999) finalValue = 999;

                  onChangeQuantity(finalValue);
                }}
                cursorColor={colors.blue[400]}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                onPress={handleAdd}
                disabled={quantity >= data.qtdEstoque}
                style={{ opacity: quantity >= data.qtdEstoque ? 0.4 : 1 }}
              >
                <LinearGradient
                  colors={
                    variant === 'withdrawal'
                      ? [colors.blue[400], colors.blue[500]]
                      : [colors.green[400], colors.green[500]]
                  }
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

// Exporte usando o memo com uma função de comparação
export const ProductCard = memo(
  ProductCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.variant === nextProps.variant &&
      prevProps.quantity === nextProps.quantity &&
      prevProps.data.id === nextProps.data.id &&
      prevProps.data.imageUrl === nextProps.data.imageUrl &&
      prevProps.data.name === nextProps.data.name &&
      prevProps.data.price === nextProps.data.price &&
      prevProps.data.color === nextProps.data.color &&
      prevProps.data.qtdEstoque === nextProps.data.qtdEstoque &&
      prevProps.data.qtdVendidos === nextProps.data.qtdVendidos
    );
  }
);
