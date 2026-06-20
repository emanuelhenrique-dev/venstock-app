// src/utils/productShare.ts
import { Alert, Share } from 'react-native';

// Tipagem simplificada para o utilitário saber o que precisa ler
export type ShareProductProps = {
  name: string;
  qtdEstoque: number;
  minStock: number;
};

// Monta a string limpa para o cliente
function generateClientText(categoryName: string, list: ShareProductProps[]) {
  const title = `✨ Confira nossos produtos em ${categoryName}:\n\n`;

  const body = list
    .map((p) => {
      // Se tiver 2 ou menos no estoque, adiciona o aviso de últimas unidades
      const avisoEscassez = p.qtdEstoque <= 2 ? `(${p.qtdEstoque} un)` : '';
      return `• ${p.name}${avisoEscassez}`;
    })
    .join('\n');

  const footer = `\n\nGostou de algo? Faça seu pedido! 😊`;
  return `${title}${body}${footer}`;
}

// 2. Lógica do Relatório Interno atualizada com as regras de minStock
function generateInternalText(categoryName: string, list: ShareProductProps[]) {
  const dateStr = new Date().toLocaleDateString('pt-BR');
  const title = `📦 *CATEGORIA: ${categoryName}*\n_Gerado em: ${dateStr}_\n\n`;

  const body = list
    .map((p) => {
      let aviso = '';

      if (p.qtdEstoque === 0) {
        aviso = ' ❌ *ZERADO!*';
      } else if (p.qtdEstoque <= p.minStock) {
        aviso = ` ⚠️ *ABAIXO DO MÍNIMO!* (Mín: ${p.minStock} un)`;
      }

      return `* ${p.name} - ${p.qtdEstoque} un${aviso}`;
    })
    .join('\n');

  return `${title}${body}`;
}

// Dispara a janela nativa de compartilhamento do celular
async function shareText(message: string) {
  try {
    await Share.share({ message });
  } catch (error) {
    console.error('Error sharing context:', error);
  }
}

// Função principal que será chamada pelo componente
export function handleCategoryShare(
  categoryName: string,
  products: ShareProductProps[]
) {
  if (products.length === 0) {
    Alert.alert(
      'Aviso',
      'Não há produtos disponíveis com estoque nesta categoria para compartilhar.'
    );
    return;
  }

  // 2. Abre a escolha de formato usando o Alert nativo
  Alert.alert(
    'Compartilhar Lista',
    'Escolha o formato de compartilhamento:',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: '📱 Enviar p/ Cliente',
        onPress: () => {
          // Filtra produtos ignorando os que têm quantidade igual ou menor que 0
          const validProducts = products.filter((p) => p.qtdEstoque > 0);

          if (validProducts.length === 0) {
            Alert.alert(
              'Aviso',
              'Não há produtos com estoque disponível para enviar ao cliente.'
            );
            return;
          }

          shareText(generateClientText(categoryName, validProducts));
        }
      },
      {
        text: '📊 Relatório Interno',
        onPress: () => shareText(generateInternalText(categoryName, products))
      }
    ],
    { cancelable: true }
  );
}
