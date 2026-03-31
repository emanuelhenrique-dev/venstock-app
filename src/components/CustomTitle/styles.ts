import { fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    flexDirection: 'row',
    gap: 8
  },
  text: {
    fontSize: 24,
    fontFamily: fontFamily.semiBold
  }
});
