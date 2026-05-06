import { transactionCategoryType } from '@/app/(dashboard)/cart';
import { colors, fontFamily } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';

interface ButtonToggleProps extends TouchableOpacityProps {
  text: string;
  type: transactionCategoryType;
  icon: keyof typeof MaterialIcons.glyphMap;
  filters: transactionCategoryType[]; // Tipagem corrigida aqui
}

export function ButtonToggle({
  text,
  type,
  icon,
  filters,
  style, // Pegamos o style das props para não sobrescrever o flex: 1
  ...rest
}: ButtonToggleProps) {
  const isSelected = filters.includes(type);

  // Cores dinâmicas baseadas no tipo (Sale = Verde, Withdrawal = Azul)
  const colorPrimary = type === 'sale' ? colors.green[500] : colors.blue[500];
  const colorSecondary = type === 'sale' ? colors.green[400] : colors.blue[400];
  const colorLight = type === 'sale' ? colors.green[100] : colors.blue[100];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[{ flex: 1 }, style]}
      {...rest}
    >
      <LinearGradient
        colors={
          isSelected
            ? [colorPrimary, colorSecondary]
            : [colors.white, colors.white]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isSelected ? colorPrimary : colors.gray[200],
          // Sombras
          elevation: isSelected ? 3 : 0,
          shadowColor: colorPrimary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.2 : 0,
          shadowRadius: 4
        }}
      >
        <MaterialIcons
          name={icon}
          size={18}
          color={isSelected ? colors.white : colors.gray[200]}
        />

        <Text
          style={{
            fontSize: 14,
            fontFamily: isSelected ? fontFamily.medium : fontFamily.regular,
            color: isSelected ? colors.white : colors.gray[500],
            includeFontPadding: false
          }}
        >
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
