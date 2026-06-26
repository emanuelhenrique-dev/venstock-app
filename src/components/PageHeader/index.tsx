import { Text, TouchableOpacity, View, ViewProps } from 'react-native';
import { CustomTitle } from '../CustomTitle';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { colors } from '@/theme';
import { router } from 'expo-router';

interface Props extends ViewProps {
  title1: string;
  title2: string;
  subtitle: string;
  gradient: string[];
  back?: boolean;
  loading?: boolean;
  button?: {
    onPress: () => void;
    icon: keyof typeof MaterialIcons.glyphMap;
    color?: string;
    badgeNumber?: string;
  };
}

export function PageHeader({
  title1,
  title2,
  subtitle,
  gradient,
  back = false,
  loading = false,
  button,
  ...rest
}: Props) {
  return (
    <View style={[styles.container, { ...rest }.style]}>
      {back && (
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.buttonHeader, { opacity: !loading ? 1 : 0.4 }]}
            activeOpacity={0.8}
            onPress={() => router.back()}
            disabled={loading}
          >
            <MaterialIcons name="arrow-back" size={28} color={colors.black} />
          </TouchableOpacity>

          {button && (
            <TouchableOpacity
              style={styles.buttonHeader}
              activeOpacity={0.8}
              onPress={button.onPress}
            >
              <MaterialIcons
                name={button.icon}
                size={24}
                color={button.color || colors.gray[600]}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View
        style={[
          styles.content,
          button && !back && { justifyContent: 'space-between' }
        ]}
      >
        <View
          style={[
            styles.titleContainer,
            button && !back && { alignItems: 'flex-start' }
          ]}
        >
          <CustomTitle text1={title1} text2={title2} gradient={gradient} />
          <Text
            style={[styles.subtitle, button && !back && { textAlign: 'left' }]}
          >
            {subtitle}
          </Text>
        </View>
        {button && !back && (
          <TouchableOpacity
            style={styles.buttonContent}
            activeOpacity={0.8}
            onPress={button.onPress}
          >
            <MaterialIcons
              name={button.icon}
              size={22}
              color={button.color || colors.gray[600]}
            />
            {(Number(button.badgeNumber) ?? 0) > 0 && (
              <View style={styles.badge}>
                <Text style={styles.textBadge}>{button.badgeNumber}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
