import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  value: {
    fontSize: 22,
    color: colors.white,
    fontFamily: fontFamily.medium,
    height: '90%'
  },
  label: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fontFamily.medium
  },
  details: {
    fontSize: 10,
    color: colors.white,
    fontFamily: fontFamily.medium,
    textAlign: 'right',
    paddingBottom: 10
  }
});
