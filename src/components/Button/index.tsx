import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Props extends TouchableOpacityProps {
  text: string;
  color1: string;
  color2: string;
  isProcessing?: boolean;
}

export function Button({
  text,
  color1,
  color2,
  isProcessing = false,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      disabled={isProcessing}
      {...rest}
    >
      <LinearGradient
        style={styles.gradient}
        colors={[color1, color2]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <Text style={styles.text}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            text
          )}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
