import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';

import { colors, fontFamily } from '@/theme';
import { numberToCurrency } from '@/utils/numberToCurrency';
import { styles } from './styles';
import { transactionCategoryType } from '@/app/(dashboard)/cart';
import { GradientText } from '../GradientText';

type TransactionType = 'pix' | 'general';

interface HistoryItem {
  name: string;
  quantity: number;
  price?: number;
}

export interface HistoryProps {
  type: TransactionType;
  id: string;
  value?: number;
  category?: transactionCategoryType;
  userName: string;
  status?: 'Pending' | 'Completed';
  date: string;
  itemsCount?: number;
  description?: string; // Ex: "Retirada por Avaria"
  items?: HistoryItem[]; // Para a versão geral
  details?: string;
}

interface props {
  data: HistoryProps;
  isOpen?: boolean; // Recebe se está aberto
  onPress?: () => void; // Função para avisar o pai que foi clicado
}

export function HistoryCard({ data, isOpen, onPress }: props) {
  const isPix = data.type === 'pix';

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.dateText}>{data.date}</Text>
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
                data.status === 'Pending' || data.category === 'withdrawal'
                  ? colors.blue[100]
                  : colors.green[100]
            }
          ]}
        >
          <GradientText
            color1={
              data.status === 'Pending' || data.category === 'withdrawal'
                ? colors.blue[400]
                : colors.green[400]
            }
            color2={
              data.status === 'Pending' || data.category === 'withdrawal'
                ? colors.blue[500]
                : colors.green[500]
            }
          >
            <MaterialIcons
              name={
                !data.category
                  ? 'pix'
                  : data.category === 'sale'
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
              ? `Transação #PX${data.id}`
              : `${data.category === 'sale' ? 'Venda' : 'Retirada'} #${data.id}`}
          </Text>
          <Text style={styles.mainInfo}>
            {isPix || data.category === 'sale'
              ? `${numberToCurrency(data.value || 0)} • ${data.userName}`
              : `${data.itemsCount} Itens • ${data.userName}`}
          </Text>

          <View style={styles.status}>
            {data.category && (
              <Text style={[styles.statusText]}>
                {data.category === 'withdrawal' ? 'Motivo:' : 'Pago com'}
              </Text>
            )}

            <GradientText
              style={[styles.statusText, { fontFamily: fontFamily.bold }]}
              color1={
                data.status === 'Pending' || data.category === 'withdrawal'
                  ? colors.blue[400]
                  : colors.green[400]
              }
              color2={
                data.status === 'Pending' || data.category === 'withdrawal'
                  ? colors.blue[500]
                  : colors.green[500]
              }
            >
              {!data.category ? data.status : data.description}
            </GradientText>
          </View>
        </View>

        {!isPix && (
          <MaterialIcons
            name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={
              data.category === 'withdrawal'
                ? colors.blue[400]
                : colors.green[400]
            }
            style={[
              styles.arrowOpen,
              {
                borderColor:
                  data.category === 'withdrawal'
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
                {item.price && (
                  <Text style={styles.itemPrice}>
                    {numberToCurrency(item.price * item.quantity)} —
                  </Text>
                )}
                <View style={styles.itemContainer}>
                  <Text style={styles.itemQty}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              </View>
            ))}

            <View style={styles.footer}>
              {data.value ? (
                <>
                  <Text style={styles.footerText}>
                    SubTotal: {numberToCurrency(data.value || 0)}
                  </Text>
                  <Text style={styles.footerText}>Taxa: R$ 0,00</Text>
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
                  Detalhes: {data.details}
                </Text>
              )}
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
