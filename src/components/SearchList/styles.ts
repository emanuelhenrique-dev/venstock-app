import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  productsHeader: {
    backgroundColor: colors.gray[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: 5
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.black,
    includeFontPadding: false,
    maxWidth: 200
  }
});
