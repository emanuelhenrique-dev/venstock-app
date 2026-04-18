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
    width: 42,
    height: 42,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200]
  }
});
