import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,

    borderRadius: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
    marginHorizontal: 2,
    paddingHorizontal: 8
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8
  },
  name: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.medium,
    maxWidth: '80%'
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  status: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    includeFontPadding: false, // Dica de ouro para Android
    textAlignVertical: 'center'
  },
  details: {},
  button: {
    flexShrink: 0,
    padding: 14,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,

    borderLeftColor: colors.green[500],
    borderLeftWidth: 1
  }
});
