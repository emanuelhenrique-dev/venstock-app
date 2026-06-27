import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { styles } from './styles';
import { GradientText } from '../GradientText';
import { formatProjectDate } from '@/utils/formatterData';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { useTransactionDatabase } from '@/database/useTransactionDatabase';
import { CartItem, useCartStore } from '@/store/useCartStore';

interface HistoryItem {
  id: string;
  historyItemId?: string;
  name: string;
  quantity: number;
  price?: number;
}

export interface HistoryProps {
  id: string;
  type: 'sale' | 'withdrawal';
  value?: number;
  fee?: number;
  category?: 'money' | 'pix' | 'avaria' | 'vencimento' | 'consumo';
  userName: string;
  status?: 'pending' | 'completed' | 'approved';
  date: string;
  description?: string; // Ex: "Retirada por Avaria"
  items?: HistoryItem[]; // Para a versão geral
}

interface props {
  isPix?: boolean;
  data: HistoryProps;
  isOpen?: boolean; // Recebe se está aberto
  onPress?: () => void; // Função para avisar o pai que foi clicado
  onDeleteSuccess: () => void;
}

export function HistoryCard({
  isPix = false,
  data,
  isOpen,
  onPress,
  onDeleteSuccess
}: props) {
  const transactionDatabase = useTransactionDatabase();

  const { addItem, clearCart } = useCartStore();

  const CATEGORY_LABELS: Record<string, string> = {
    money: 'Dinheiro',
    pix: 'Pix',
    avaria: 'Avaria',
    vencimento: 'Vencimento',
    consumo: 'Consumo'
  };

  const quantityTotal = data.items?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const TRANSACTION_DELETE_LIMIT_DAYS = 2;

  const canDeleteTransaction = (createdAtString: string): boolean => {
    try {
      // 1. Transforma a string do banco em uma data real de forma segura
      const transactionDate = parseISO(createdAtString);
      const now = new Date();

      // 2. Compara o "começo do dia" de cada uma, ignorando minutos e segundos sumidos
      const daysPassed = differenceInDays(
        startOfDay(now),
        startOfDay(transactionDate)
      );

      // 3. O Math.abs garante que mesmo se o número vier negativo por fuso horário, ele vira positivo
      return Math.abs(daysPassed) <= TRANSACTION_DELETE_LIMIT_DAYS;
    } catch (error) {
      // Se der qualquer erro de parse, bloqueia por segurança
      return false;
    }
  };

  async function RemoveHistoryItem(transaction: any) {
    console.log(transaction.items);
    // Recebe o objeto completo (data)
    const typeLabel = transaction.type === 'sale' ? 'Venda' : 'Retirada';

    // console.log(transaction.items);
    try {
      // CENÁRIO 1: SE FOR VENDA (Sempre devolve os itens para o estoque)
      if (transaction.type === 'sale') {
        Alert.alert(
          `Remover ${typeLabel}`,
          `O que deseja fazer com os itens desta venda ao removê-la? Ambos os casos devolverão os produtos ao estoque.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Apenas Devolver',
              style: 'default',
              onPress: async () => {
                // Executa passando transactionId, items e true (para restaurar estoque)
                await transactionDatabase.deleteTransaction(
                  transaction.id,
                  transaction.items,
                  true
                );
                onDeleteSuccess();
              }
            },
            {
              text: 'Voltar os items para o carrinho',
              style: 'destructive', // Destaca a ação principal escolhida
              onPress: async () => {
                // 1. Deleta do banco e joga as quantidades de volta pro estoque
                await transactionDatabase.deleteTransaction(
                  transaction.id,
                  transaction.items,
                  true
                );

                //limpar o carrinho
                clearCart();

                // Mapeia e adiciona os itens no formato que o seu CartItem exige
                transaction.items.forEach((item: CartItem, index: number) => {
                  addItem({
                    id: String(Date.now() + index), // Garante um ID único para o item no carrinho
                    productId: item.id, // Mantém o vínculo com o produto correto
                    quantity: item.quantity // Devolve a quantidade exata vendida
                  });
                });

                onDeleteSuccess();
              }
            }
          ]
        );
        return; // Para a execução aqui se for venda
      }

      // CENÁRIO 2: SE FOR RETIRADA (Pergunta se volta pro estoque)
      if (transaction.type === 'withdrawal') {
        Alert.alert(
          `Remover ${typeLabel}`,
          `Os produtos desta retirada devem voltar para o estoque disponível?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Não, apenas deletar',
              style: 'default',
              onPress: async () => {
                // Passa false: deleta o histórico, mas NÃO mexe no estoque (ex: produto foi pro lixo)
                await transactionDatabase.deleteTransaction(
                  transaction.id,
                  transaction.items,
                  false
                );
                onDeleteSuccess();
              }
            },
            {
              text: 'Sim, devolver',
              style: 'destructive',
              onPress: async () => {
                // Passa true: deleta o histórico e DEVOLVE os itens pro estoque
                await transactionDatabase.deleteTransaction(
                  transaction.id,
                  transaction.items,
                  true
                );
                onDeleteSuccess();
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erro', `Não foi possível remover a ${typeLabel}`);
      console.log(error);
    }
  }

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.dateText}>{formatProjectDate(data.date)}</Text>

      {
        //ativar remover transação
        !isPix && canDeleteTransaction(data.date) && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => RemoveHistoryItem(data)}
          >
            <MaterialIcons
              name="remove-circle"
              color={colors.red[500]}
              size={24}
            />
          </TouchableOpacity>
        )
      }
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.mainContent}
      >
        <View
          style={[
            styles.image,
            {
              backgroundColor:
                data.status === 'pending' || data.type === 'withdrawal'
                  ? colors.blue[100]
                  : colors.green[100]
            }
          ]}
        >
          <GradientText
            color1={
              data.status === 'pending' || data.type === 'withdrawal'
                ? colors.blue[400]
                : colors.green[400]
            }
            color2={
              data.status === 'pending' || data.type === 'withdrawal'
                ? colors.blue[500]
                : colors.green[500]
            }
          >
            <MaterialIcons
              name={
                isPix
                  ? 'pix'
                  : data.type === 'sale'
                    ? 'shopping-bag'
                    : 'inventory'
              }
              size={36}
            />
          </GradientText>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.idText} numberOfLines={1}>
            {isPix
              ? //saber se o card ta na area pix ou histórico geral
                `Transação#PX${data.id}`
              : `TX#${data.id} ${data.type === 'sale' ? 'Venda' : 'Retirada'} `}
          </Text>
          <Text style={styles.mainInfo} numberOfLines={1}>
            {isPix || data.type === 'sale'
              ? `${numberToCurrency(data.value || 0)} • ${data.userName || 'Admin'}`
              : `${quantityTotal} ${quantityTotal === 1 ? 'item' : 'itens'} • ${data.userName || 'Admin'}`}
          </Text>

          <View style={styles.status}>
            {!isPix && data.type && (
              <Text style={[styles.statusText]}>
                {data.type === 'withdrawal' ? 'Motivo:' : 'Pago com'}
              </Text>
            )}

            <GradientText
              style={[styles.statusText, { fontFamily: fontFamily.bold }]}
              color1={
                data.status === 'pending' || data.type === 'withdrawal'
                  ? colors.blue[400]
                  : colors.green[400]
              }
              color2={
                data.status === 'pending' || data.type === 'withdrawal'
                  ? colors.blue[500]
                  : colors.green[500]
              }
            >
              {!data.category ? data.status : CATEGORY_LABELS[data.category]}
              {isPix && (data.status === 'approved' ? 'Completed' : 'pending')}
            </GradientText>
          </View>
        </View>

        {!isPix && (
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={
              data.type === 'withdrawal' ? colors.blue[400] : colors.green[400]
            }
            style={[
              styles.arrowOpen,
              {
                borderColor:
                  data.type === 'withdrawal'
                    ? colors.blue[400]
                    : colors.green[400]
              }
            ]}
          />
        )}
      </TouchableOpacity>
      {/* COMPARTIMENTO EXPANSÍVEL (Geral) */}
      {/* COMPARTIMENTO EXPANSÍVEL (Geral) */}
      <AnimatePresence>
        {isOpen && (
          <MotiView
            from={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.expandedContent}
          >
            {isPix ? (
              /* 🌐 SE FOR PIX: Quebra a string da descrição para preencher as linhas */
              <>
                <Text style={styles.itemsTitle}>Detalhes da Transação:</Text>

                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>ID Gateway:</Text>
                  <Text style={styles.itemName}>{data.id}</Text>
                </View>

                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>Status Detail:</Text>
                  <Text
                    style={[
                      styles.itemName,
                      {
                        color:
                          data.status === 'approved' ? '#2ecc71' : '#f1c40f',
                        fontFamily: fontFamily.medium
                      }
                    ]}
                  >
                    {/* Pega apenas a parte do "Status: ..." */}
                    {data.description?.split(' | ')[1] || 'N/A'}
                  </Text>
                </View>

                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>Comprador:</Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {/* Pega apenas a parte do "Comprador: ..." */}
                    {data.description?.split(' | ')[2] || 'N/A'}
                  </Text>
                </View>

                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>Referência:</Text>
                  <Text style={styles.itemName}>
                    {/* Pega apenas a parte do "Ref: ..." */}
                    {data.description?.split(' | ')[0] || data.description}
                  </Text>
                </View>
              </>
            ) : (
              /* 🛒 SE NÃO FOR PIX: Mantém o teu fluxo original intacto */
              <>
                <Text style={styles.itemsTitle}>Itens:</Text>
                {data.items?.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemQty}>{item.quantity} x</Text>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    {item.price && data.type === 'sale' && (
                      <Text style={styles.itemPrice}>
                        {numberToCurrency(item.price * item.quantity)}
                      </Text>
                    )}
                  </View>
                ))}

                <View style={styles.footer}>
                  {data.value && data.type == 'sale' ? (
                    <>
                      <Text style={styles.footerText}>
                        Sub:{' '}
                        {numberToCurrency(data.value - (data.fee || 0) || 0)}
                      </Text>
                      <Text style={styles.footerText}>
                        Taxa: {numberToCurrency(data.fee || 0)}
                      </Text>
                      <Text
                        style={[
                          styles.footerText,
                          { fontFamily: fontFamily.bold }
                        ]}
                      >
                        Total: {numberToCurrency(data.value || 0)}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.footerText,
                        { fontFamily: fontFamily.medium }
                      ]}
                    >
                      Detalhes: {data.description || 'Sem observações'}
                    </Text>
                  )}
                </View>
              </>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
