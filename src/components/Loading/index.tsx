import { Image, Text } from 'react-native';
import { styles } from './styles';
import { colors } from '@/theme/colors';

import icon from '../../../assets/adaptive-icon.png';
import { View } from 'react-native-ui-lib';
import { MotiView } from 'moti';
import React from 'react';
import { fontFamily } from '@/theme';

interface loadingProps {
  width: number;
  height: number;
}

export const Loading = React.memo(({ width, height }: loadingProps) => {
  return (
    <View style={styles.container}>
      <MotiView
        from={{
          scale: 0.9,
          opacity: 0.8
        }}
        animate={{
          scale: 1.1,
          opacity: 1
        }}
        transition={{
          type: 'timing',
          duration: 1500,
          loop: true,
          repeatReverse: true // Essencial para o efeito de pulso (vai e volta)
        }}
      >
        <Image
          source={icon}
          style={{ width: width, height: height }}
          resizeMode="cover"
        />
      </MotiView>
      <Text
        style={{
          marginTop: -46,
          fontFamily: fontFamily.medium,
          color: colors.gray[400],
          fontSize: 14
        }}
      >
        Carregando...
      </Text>
    </View>
  );
});
