import { colors } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 170,
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Para o badge se posicionar

    // Sombra leve para destacar no fundo branco
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 170
  }
});
