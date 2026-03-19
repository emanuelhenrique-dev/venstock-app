import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    color: colors.black,
    fontFamily: fontFamily.medium,
    fontSize: 12
  },
  input: {
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    padding: 14,
    marginTop: 8,
    backgroundColor: colors.gray[150]
  }
});
