import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 32
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  buttonHeader: {
    padding: 8,
    backgroundColor: colors.gray[150],
    borderRadius: 75
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    fontFamily: fontFamily.regular,
    textAlign: 'center'
  },
  buttonContent: {
    position: 'relative',
    padding: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 16
  },
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 18,
    height: 18,
    backgroundColor: colors.red[500],
    borderRadius: 150
  },
  textBadge: {
    fontSize: 12,
    color: colors.white,
    fontFamily: fontFamily.regular,
    textAlign: 'center'
  }
});
