import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '@/theme';

interface props extends TextProps {
  color1: string;
  color2: string;
  children: React.ReactNode;
}

export function GradientText({ children, color1, color2, ...rest }: props) {
  return (
    <MaskedView
      maskElement={
        <Text
          {...rest}
          style={[rest.style, { backgroundColor: 'transparent' }]}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient
        // Ajuste as cores para o seu tema (ex: Azul para Verde)
        colors={[color1, color2]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        {/* O texto dentro aqui fica invisível, servindo apenas para dar altura ao gradiente */}
        <Text {...rest} style={[rest.style, { opacity: 0 }]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
