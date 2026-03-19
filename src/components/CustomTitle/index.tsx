import { Text, TextProps, View } from 'react-native';
import { styles } from './styles';
import { GradientText } from '../GradientText';
import { colors } from '@/theme';

interface props extends TextProps {
  text1: string;
  text2: string;
}

export function CustomTitle({ text1, text2, ...rest }: props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text} {...rest}>
        {text1}
      </Text>
      <GradientText
        style={styles.text}
        color1={colors.green[400]}
        color2={colors.green[500]}
      >
        {text2}
      </GradientText>
    </View>
  );
}
