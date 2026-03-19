import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },
  container: {
    width: 130,
    height: 130,
    borderRadius: 170,
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    borderColor: colors.green[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative', // Para o badge se posicionar

    // Sombra leve para destacar no fundo branco
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 170
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.green[500],
    width: 41,
    height: 41,
    borderRadius: 170,
    justifyContent: 'center',
    alignItems: 'center'
  },
  //modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  content: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    marginBottom: 20,
    color: colors.black
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100]
  },
  optionText: {
    marginLeft: 15,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.black
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 10
  },
  cancelText: {
    fontFamily: fontFamily.bold,
    color: colors.gray[400],
    fontSize: 14
  }
});
