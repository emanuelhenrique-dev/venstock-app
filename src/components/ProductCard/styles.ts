import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,

    borderRadius: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
    marginHorizontal: 2,
    paddingHorizontal: 8,

    borderLeftWidth: 1,
    borderColor: colors.red[500]
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8
  },
  name: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fontFamily.semiBold
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
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  identifierOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 170,
    backgroundColor: `rgba(59, 130, 246, 0.18)`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green[100],
    zIndex: 1,
    opacity: 0.9
  },
  identifierText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    includeFontPadding: false
  },
  swipeableContainer: {
    borderRadius: 8
  },
  option: {
    backgroundColor: colors.red[500],
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2 // Para alinhar com a sombra/borda do seu container
  },

  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 65 // Garante que o espaço não mude bruscamente
  },
  addButton: {
    padding: 14,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,

    borderLeftColor: colors.green[500],
    borderLeftWidth: 1
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  qtyButton: {
    padding: 4,
    borderRadius: 5
  },
  quantityText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginHorizontal: 4,
    width: 34,
    textAlign: 'center',
    includeFontPadding: false
  }
});
