import { Image, View, ViewProps } from 'react-native';

type ImageInputVariant = 'profile' | 'category' | 'product';

interface props extends ViewProps {
  image: string | null;
  size: number;
  color: string;
  variant?: ImageInputVariant;
}

// Importação dos Placeholders
import placeholderProfile from '../../../assets/generic_imageProfile.png';
import placeholderCategory from '../../../assets/generic_category.png';
import placeholderProduct from '../../../assets/generic_product.png';
import { styles } from './styles';

export function CustomImage({
  image,
  size,
  color,
  variant = 'profile',
  ...rest
}: props) {
  // Define qual placeholder exibir baseado na variante
  const getPlaceholder = () => {
    // console.log('image:', placeholderProfile);
    switch (variant) {
      case 'category':
        return placeholderCategory;
      case 'product':
        return placeholderProduct;
      default:
        return placeholderProfile;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: color, width: size, height: size },
        { ...rest }.style
      ]}
    >
      <Image
        width={size}
        height={size}
        source={image ? { uri: image } : getPlaceholder()}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}
