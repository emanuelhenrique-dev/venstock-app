import { Text, TextProps, View } from 'react-native';
import { styles } from './styles';
import { GradientText } from '../GradientText';
import { colors } from '@/theme';

interface props extends TextProps {
  text1: string;
  text2: string;
  gradient: string[];
}

export function CustomTitle({ text1, text2, gradient, ...rest }: props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text} {...rest} numberOfLines={1}>
        {text1}
      </Text>
      {text2 && (
        <GradientText
          style={styles.text}
          color1={gradient[0]}
          color2={gradient[1]}
          numberOfLines={1}
        >
          {text2}
        </GradientText>
      )}
    </View>
  );
}
