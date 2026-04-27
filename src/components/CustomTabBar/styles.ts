import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    bottom: 40,
    paddingHorizontal: 34,
    paddingBottom: 20
  },
  tabItem: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  text: {
    fontSize: 16,
    fontFamily: fontFamily.medium
  },
  separatorLine: {
    width: '100%', // Largura da linha (não precisa ser 100% para ficar elegante)
    height: 1, // Espessura da linha
    backgroundColor: colors.gray[300],
    marginBottom: 20, // O ESPAÇAMENTO que você pediu entre a linha e os botões
    alignSelf: 'center'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    backgroundColor: '#FF4B4B',

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white
  }
});
