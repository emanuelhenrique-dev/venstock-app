import { PageHeader } from '@/components/PageHeader';
import { colors, fontFamily } from '@/theme';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Se usar ícones em outras telas, importe o pacote correto (ex: MaterialIcons)
import { MaterialIcons } from '@expo/vector-icons';

import icon from '../../assets/splash-icon.png';

export default function About() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Erro ao abrir link', err)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.white,
          paddingTop: 22
        }}
        edges={['bottom']}
      >
        <View>
          <PageHeader
            title1="Sobre o"
            title2="Venstock"
            subtitle="Conheça mais sobre o aplicativo e como ele ajuda a organizar seu estoque e vendas."
            gradient={[colors.green[400], colors.green[500]]}
            back
            style={{ paddingHorizontal: 24, paddingBottom: 16 }}
          />
        </View>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 24 }}
          contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD: O QUE É */}
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 20,
              marginTop: 8
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.semiBold,
                fontSize: 16,
                color: '#111827',
                marginBottom: 12
              }}
            >
              O que é o Venstock?
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24
              }}
            >
              O Venstock é um aplicativo desenvolvido para ajudar pequenos
              comércios a controlar estoque, vendas e receitas de forma simples
              e prática. A ideia é deixar todas os dados importantes à mão, com
              um visual limpo e fácil de usar.
            </Text>
          </View>

          {/* CARD: RECURSOS PRINCIPAIS */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 20
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.semiBold,
                fontSize: 16,
                color: '#111827',
                marginBottom: 12
              }}
            >
              Recursos principais
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24,
                marginBottom: 8
              }}
            >
              • Gerenciamento de categorias e produtos.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24,
                marginBottom: 8
              }}
            >
              • Registro de vendas e retiradas.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24
              }}
            >
              • Estatísticas com análise de faturamento e ranking de produtos
              mais vendidos.
            </Text>
          </View>

          {/* CARD: POR QUE USAR */}
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 20
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.semiBold,
                fontSize: 16,
                color: '#111827',
                marginBottom: 12
              }}
            >
              Por que usar?
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24
              }}
            >
              O app foi pensado para quem quer mais controle do negócio sem
              perder tempo. Com ele, você acompanha o desempenho diário,
              organiza o estoque e toma decisões mais informadas em apenas
              alguns toques.
            </Text>
          </View>

          {/* CARD: PRIVACIDADE/DADOS */}
          <View
            style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 20
            }}
          >
            <Text
              style={{
                fontFamily: fontFamily.semiBold,
                fontSize: 16,
                color: '#111827',
                marginBottom: 12
              }}
            >
              Segurança e Privacidade
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 15,
                color: '#4B5563',
                lineHeight: 24
              }}
            >
              Todas as informações de produtos, vendas e histórico de estoque
              são salvas localmente utilizando o banco de dados{' '}
              <Text
                style={{ fontFamily: fontFamily.semiBold, color: '#111827' }}
              >
                SQLite
              </Text>
              . Isso significa que seus dados ficam 100% offline, seguros no seu
              dispositivo e protegidos de falhas de conexão.
            </Text>
          </View>

          {/* NOVO CARD: DESENVOLVEDOR & LINKS (Casou perfeitamente com o fundo branco alternado) */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              padding: 20,
              alignItems: 'center',
              gap: 12
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={icon} // Ajuste o caminho conforme as pastas do seu projeto
                style={{
                  width: 128,
                  height: 128
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 13,
                  color: '#6B7280',
                  marginBottom: 2
                }}
              >
                Desenvolvido por
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.semiBold,
                  fontSize: 16,
                  color: '#111827'
                }}
              >
                Emanuel Silva
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 12,
                  color: '#9CA3AF',
                  marginTop: 2
                }}
              >
                Versão 1.0.0 • React Native & Expo
              </Text>
            </View>

            {/* CONTAINER DOS LINKS */}
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
              {/* LINK GITHUB */}
              <TouchableOpacity
                onPress={() =>
                  openLink('https://github.com/emanuelhenrique-dev')
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#F3F4F6',
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 99
                }}
              >
                <MaterialIcons name="code" size={18} color="#374151" />
                <Text
                  style={{
                    fontFamily: fontFamily.medium,
                    fontSize: 14,
                    color: '#374151'
                  }}
                >
                  GitHub
                </Text>
              </TouchableOpacity>

              {/* LINK LINKEDIN */}
              <TouchableOpacity
                onPress={() =>
                  openLink('https://www.linkedin.com/in/emanuel-hfsilva/')
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#EFF6FF',
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 99
                }}
              >
                <MaterialIcons name="link" size={18} color="#1D4ED8" />
                <Text
                  style={{
                    fontFamily: fontFamily.medium,
                    fontSize: 14,
                    color: '#1D4ED8'
                  }}
                >
                  LinkedIn
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
