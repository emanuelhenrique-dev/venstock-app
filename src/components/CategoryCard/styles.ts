import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    paddingBottom: 16
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 8
  },
  name: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.medium
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  status: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    gap: 12,
    includeFontPadding: false, // Dica de ouro para Android
    textAlignVertical: 'center'
  }
});
