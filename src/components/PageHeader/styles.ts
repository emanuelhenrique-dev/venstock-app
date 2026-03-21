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
    marginBottom: 32
  },
  buttonHeader: {
    padding: 10,
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
    bottom: -3,
    right: -3,
    width: 13,
    height: 13,
    backgroundColor: colors.red[500],
    borderRadius: 150
  }
});
