import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: '100%'
  },
  gradient: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.white
  }
});
