import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  productsOverlay: {
    // position: 'absolute' dentro do container pai faz ela cobrir tudo
    position: 'absolute',
    top: 0, // Sobe um pouco para cobrir o título e input antigos
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff', // Cor de fundo para cobrir a lista de baixo
    paddingTop: 10
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  backButton: {
    padding: 10,
    backgroundColor: colors.gray[100],
    borderRadius: 20
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: fontFamily.medium,
    color: colors.black
  }
});
