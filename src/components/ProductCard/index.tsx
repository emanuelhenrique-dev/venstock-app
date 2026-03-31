import React, { useRef } from 'react'; // Importante para o Swipeable funcionar bem
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
import { RectButton } from 'react-native-gesture-handler';

interface Props extends ViewProps {
  data: ProductCardProps;
  onDelete?: () => void;
}

export function ProductCard({ data, onDelete, ...rest }: Props) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  function onSwipeableWillOpen() {
    console.warn('Deletar produto', data.id);
    swipeableRef.current?.close();
  }

  // O que vai aparecer atrás do card
  const renderLeftActions = () => (
    <RectButton style={styles.option} onPress={onDelete} activeOpacity={0.9}>
      <MaterialIcons name="delete" size={24} color="#fff" />
    </RectButton>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      overshootLeft={false}
      dragOffsetFromLeftEdge={20}
      leftThreshold={45}
      containerStyle={styles.swipeableContainer}
      activeOffsetX={[-10, 10]}
      onSwipeableWillOpen={onSwipeableWillOpen}
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

          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          <View style={styles.details}>
            <Text
              style={[
                styles.status,
                { color: colors.green[500], fontSize: 12 }
              ]}
            >
              R$ {data.price.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons
            name="add-shopping-cart"
            size={25}
            color={colors.green[500]}
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}
