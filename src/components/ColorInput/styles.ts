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
  colorsInput: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  color: {
    width: 36,
    height: 36,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6
  }
});
