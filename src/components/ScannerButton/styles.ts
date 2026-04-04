import { colors } from '@/theme';
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MOLDURA_PERCENTUAL = 0.95;
const MOLDURA_WIDTH = SCREEN_WIDTH * MOLDURA_PERCENTUAL;
const MOLDURA_HEIGHT = MOLDURA_WIDTH * 1.0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mascoteBackground: {
    width: MOLDURA_WIDTH,
    height: MOLDURA_HEIGHT,
    position: 'absolute',
    top: (SCREEN_HEIGHT - MOLDURA_HEIGHT) / 2,
    left: (SCREEN_WIDTH - MOLDURA_WIDTH) / 2,
    resizeMode: 'contain',
    zIndex: 1
  },
  // O NOVO ESTILO AQUI:
  instruction: {
    position: 'absolute',
    // Pega o fim da imagem e desce 20px
    top: (SCREEN_HEIGHT + MOLDURA_HEIGHT) / 2 + 20,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 2
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gray[500],
    zIndex: 2
  },
  closeText: {
    color: colors.red[500],
    fontWeight: 'bold',
    fontSize: 16
  }
});
