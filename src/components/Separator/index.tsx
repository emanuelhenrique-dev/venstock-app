import { ColorValue, View } from 'react-native';
import { styles } from './styles';

interface props {
  color: ColorValue;
  space?: number;
}

export function Separator({ color, space }: props) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color, marginVertical: space }
      ]}
    />
  );
}
