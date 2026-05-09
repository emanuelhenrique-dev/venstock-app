import { colors, fontFamily } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View, Switch } from 'react-native';
import { styles } from './styles';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { GradientText } from '../GradientText';

interface OptionCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isSwitch?: boolean;
  switchValue?: boolean;
  disabled?: boolean;
  destructiveIcon?: keyof typeof MaterialIcons.glyphMap;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
}

export function OptionCard({
  title,
  subtitle,
  icon,
  isSwitch,
  switchValue,
  disabled = false,
  destructiveIcon,
  onPress,
  onSwitchChange
}: OptionCardProps) {
  const color = !destructiveIcon
    ? [colors.green[400], colors.green[500]]
    : [colors.red[500], colors.red[500]];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isSwitch || disabled}
      style={[styles.container, { opacity: disabled ? 0.6 : 1 }]}
    >
      {/* Ícone com fundo arredondado */}
      <View
        style={[
          styles.imageContainer,
          destructiveIcon && { backgroundColor: colors.red[100] }
        ]}
      >
        <GradientText color1={color[0]} color2={color[1]}>
          <MaterialIcons name={icon} size={32} color={color[1]} />
        </GradientText>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.gray[200], true: colors.green[400] }}
          thumbColor={colors.white}
        />
      ) : !destructiveIcon ? (
        <MaterialIcons
          name="chevron-right"
          size={30}
          color={colors.green[500]}
        />
      ) : (
        <MaterialIcons name={destructiveIcon} size={30} color={color[1]} />
      )}
    </TouchableOpacity>
  );
}
