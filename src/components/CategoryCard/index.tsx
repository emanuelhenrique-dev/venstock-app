import { MaterialIcons } from '@expo/vector-icons';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import { styles } from './styles';
import { CustomImage } from '../CustomImage';
import { colors } from '@/theme';

export type CategoryCardProps = {
  id: string;
  name: string;
  qtdEstoque: number;
  qtdProdutosUnicos: number;
  qtdVendidos: number;
  imageUrl?: string | null;
  color?: string;
  hasLowStock?: boolean;
};

interface Props extends TouchableOpacityProps {
  data: CategoryCardProps;
  showUniqueProducts: boolean;
}

export function CategoryCard({ data, showUniqueProducts, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <CustomImage
        image={data.imageUrl ?? null}
        size={60}
        color={data.color ?? colors.blue[400]}
        variant="category"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>
        <View style={{ flexDirection: 'row', gap: 30 }}>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="inventory"
              color={colors.blue[400]}
              size={12}
            />
            <Text style={[styles.status, { color: colors.blue[400] }]}>
              {!showUniqueProducts
                ? data.qtdEstoque
                : data.qtdProdutosUnicos}{' '}
            </Text>

            {data.hasLowStock && (
              <MaterialIcons
                name="warning"
                color={colors.yellow[300]}
                size={12}
                style={{
                  marginLeft: -5
                }}
              />
            )}
          </View>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name="shopping-bag"
              size={12}
              color={colors.green[500]}
            />
            <Text style={[styles.status, { color: colors.green[500] }]}>
              {data.qtdVendidos} vendidos
            </Text>
          </View>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={25} color={colors.gray[500]} />
    </TouchableOpacity>
  );
}
