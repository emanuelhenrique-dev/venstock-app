import {
  ColorValue,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { colors } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

export type SummaryProps = {
  details: string;
  value: string;
};

interface Props extends TouchableOpacityProps {
  label: string;
  data: SummaryProps;
  icon: keyof typeof MaterialIcons.glyphMap;
  gradient: string[];
  sale?: boolean;
}

export function Summary({
  label,
  data,
  icon,
  gradient,
  sale = false,
  ...rest
}: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} {...rest}>
      <LinearGradient
        colors={[gradient[0], gradient[1]]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          {!sale && <MaterialIcons name="report" size={14} color="yellow" />}
          <Text style={styles.details}>{data.details}</Text>
        </View>
        <View style={[styles.content]}>
          <MaterialIcons name={icon} size={22} color={colors.white} />
          <Text style={styles.value}>{data.value}</Text>
        </View>

        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
