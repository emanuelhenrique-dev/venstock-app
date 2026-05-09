import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    minHeight: 110,
    backgroundColor: colors.white,
    padding: 16,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    // Sombra suave conforme a imagem
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05
  },
  imageContainer: {
    backgroundColor: colors.green[100],
    padding: 12,
    borderRadius: 50
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.black
  },
  subTitle: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.gray[400],
    marginTop: 2
  }
});
