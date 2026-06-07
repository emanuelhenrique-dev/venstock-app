import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ColorValue, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import { styles } from './styles';
import { colors } from '@/theme';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

interface props extends ViewProps {
  text: string;
  subtext: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: ColorValue;
}

export function EmptyComponent({ text, subtext, icon, color, ...rest }: props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon}
        size={150}
        color={color}
        style={[
          {
            opacity: 0.6,
            includeFontPadding: false,
            width: 'auto'
          },
          rest.style
        ]}
      />
      <Text style={styles.textPrimary}>{text}</Text>
      <Text style={styles.textSecondary}>{subtext}</Text>
    </View>
  );
}
