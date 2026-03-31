import { MaterialIcons } from '@expo/vector-icons';
import { Text, ViewProps, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { CustomImage } from '../CustomImage';
import { colors } from '@/theme';
import { ProductCardProps } from '../ProductsListOverlay';

interface Props extends ViewProps {
  data: ProductCardProps;
}

export function ProductCard({ data, ...rest }: Props) {
  return (
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
          {/* <MaterialIcons
            name="shopping-bag"
            size={12}
            color={colors.green[500]}
          /> */}
          <Text
            style={[styles.status, { color: colors.green[500], fontSize: 12 }]}
          >
            RS {data.price}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <MaterialIcons
          name="add-shopping-cart"
          size={25}
          color={colors.green[500]}
        />
      </TouchableOpacity>
    </View>
  );
}
