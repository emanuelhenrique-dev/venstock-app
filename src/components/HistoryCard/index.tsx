import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { styles } from './styles';
import { GradientText } from '../GradientText';
import { formatProjectDate } from '@/utils/formatterData';

interface HistoryItem {
  id: string;
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
  status?: 'Pending' | 'Completed';
  date: string;
  description?: string; // Ex: "Retirada por Avaria"
  items?: HistoryItem[]; // Para a versão geral
}

interface props {
  isPix?: boolean;
  data: HistoryProps;
  isOpen?: boolean; // Recebe se está aberto
  onPress?: () => void; // Função para avisar o pai que foi clicado
}

export function HistoryCard({ isPix = false, data, isOpen, onPress }: props) {
  const CATEGORY_LABELS: Record<string, string> = {
    money: 'Dinheiro',
    pix: 'Pix',
    avaria: 'Avaria',
    vencimento: 'Vencimento',
    consumo: 'Consumo'
  };

  async function RemoveHistoryItem(id: string, type: string) {
    try {
      Alert.alert(
        `Remover ${type}`,
        `Deseja remover essa ${type}? Os itens voltarão para a lista de produtos.`,
        [
          {
            text: 'não',
            style: 'cancel',
            onPress: () => {
              console.warn('Remoção cancelada', id);
            }
          },
          {
            text: 'sim',
            style: 'destructive',
            onPress: () => {
              console.warn(`${type} removida com sucesso de id`, id);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', `Não foi possível remover a ${type}`);
      console.log(error);
    }
  }

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.dateText}>{formatProjectDate(data.date)}</Text>
      //ativar remover transação
      {false && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() =>
            RemoveHistoryItem(
              data.id,
              data.type === 'sale' ? 'Venda' : 'Retirada'
            )
          }
        >
          <MaterialIcons
            name="remove-circle"
            color={colors.red[500]}
            size={24}
          />
        </TouchableOpacity>
      )}
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
                data.status === 'Pending' || data.type === 'withdrawal'
                  ? colors.blue[100]
                  : colors.green[100]
            }
          ]}
        >
          <GradientText
            color1={
              data.status === 'Pending' || data.type === 'withdrawal'
                ? colors.blue[400]
                : colors.green[400]
            }
            color2={
              data.status === 'Pending' || data.type === 'withdrawal'
                ? colors.blue[500]
                : colors.green[500]
            }
          >
            <MaterialIcons
              name={
                !data.category
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
          <Text style={styles.idText}>
            {isPix
              ? //saber se o card ta na area pix ou histórico geral
                `Transação #PX${data.id}`
              : `TX#${data.id} ${data.type === 'sale' ? 'Venda' : 'Retirada'} `}
          </Text>
          <Text style={styles.mainInfo} numberOfLines={1}>
            {isPix || data.type === 'sale'
              ? `${numberToCurrency(data.value || 0)} • ${data.userName}`
              : `2 Itens • ${data.userName}`}
          </Text>

          <View style={styles.status}>
            {data.type && (
              <Text style={[styles.statusText]}>
                {data.type === 'withdrawal' ? 'Motivo:' : 'Pago com'}
              </Text>
            )}

            <GradientText
              style={[styles.statusText, { fontFamily: fontFamily.bold }]}
              color1={
                data.status === 'Pending' || data.type === 'withdrawal'
                  ? colors.blue[400]
                  : colors.green[400]
              }
              color2={
                data.status === 'Pending' || data.type === 'withdrawal'
                  ? colors.blue[500]
                  : colors.green[500]
              }
            >
              {!data.category ? data.status : CATEGORY_LABELS[data.category]}
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
      <AnimatePresence>
        {isOpen && (
          <MotiView
            from={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.expandedContent}
          >
            <Text style={styles.itemsTitle}>Itens:</Text>
            {data.items?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                {/* Bloco da Esquerda: Quantidade e Nome */}
                <View style={styles.itemContainer}>
                  <Text style={styles.itemQty}>{item.quantity} x</Text>
                  {/* O numberOfLines garante que se o nome for gigante, ele vira "..." e não atropela o preço */}
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                {/* Bloco da Direita: Preço final do item */}
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
                    Sub: {numberToCurrency(data.value - (data.fee || 0) || 0)}
                  </Text>
                  <Text style={styles.footerText}>
                    Taxa: {numberToCurrency(data.fee || 0)}
                  </Text>
                  <Text
                    style={[styles.footerText, { fontFamily: fontFamily.bold }]}
                  >
                    Total: {numberToCurrency(data.value || 0)}
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.footerText, { fontFamily: fontFamily.medium }]}
                >
                  Detalhes: {data.description || 'Sem observações'}
                </Text>
              )}
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
