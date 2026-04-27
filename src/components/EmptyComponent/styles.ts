import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 25
  },
  textPrimary: {
    color: colors.black,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    includeFontPadding: false
  },
  textSecondary: {
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
    fontSize: 14,
    includeFontPadding: false
  }
});
