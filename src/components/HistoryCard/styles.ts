import { StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/theme';

export const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    backgroundColor: colors.white,
    borderRadius: 5,
    marginHorizontal: 2,
    overflow: 'hidden', // Importante para o MotiView não vazar nas bordas arredondadas
    borderWidth: 1,
    borderColor: colors.gray[100],
    // Sombra leve para destacar os cards na lista
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  mainContent: {
    position: 'relative',
    padding: 18,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    padding: 15,
    borderRadius: 120
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 3
  },
  idText: {
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
    color: colors.black
  },
  status: {
    flexDirection: 'row',
    gap: 4
  },
  statusText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    includeFontPadding: false
  },
  mainInfo: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.black,
    includeFontPadding: false
  },
  dateText: {
    position: 'absolute',
    top: 81,
    right: 6,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.gray[500]
  },

  // Estilos do Compartimento Expansível
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[150],
    backgroundColor: colors.gray[100], // Fundo sutilmente diferente
    padding: 16
  },
  itemsTitle: {
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: colors.black,
    marginBottom: 6
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[150]
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.gray[500]
  },
  itemQty: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginRight: 4
  },
  itemPrice: {
    width: '25%',
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: colors.gray[500],
    textAlign: 'right'
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowOpen: {
    position: 'absolute',
    top: 39,
    right: 21,
    borderWidth: 1.5,
    borderRadius: 25
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 100,
    padding: 10
  },

  // Rodapé do Compartimento
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    gap: 15,
    borderTopWidth: 1,
    borderColor: colors.gray[300]
  },
  footerText: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    textAlign: 'right'
  },
  totalText: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
    color: colors.green[500],
    textAlign: 'right',
    marginTop: 4
  }
});
