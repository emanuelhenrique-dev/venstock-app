import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importando para os ícones dinâmicos

import { CategorySelect, SelectedCategory } from '../CategorySelect';
import { EmptyComponent } from '../EmptyComponent';
import { colors, fontFamily } from '@/theme';
import { styles } from './styles';

export interface RankingItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  categoryId?: string;
}

export interface CategoryFilter {
  id: string;
  name: string;
}

interface TopSellingSectionProps {
  items: RankingItem[];
  categories: CategoryFilter[];
}

export function TopSellingSection({
  items,
  categories
}: TopSellingSectionProps) {
  // Filtro 1: 'products' ou 'categories'
  const [rankingType, setRankingType] = useState<'products' | 'categories'>(
    'products'
  );

  // Filtro 2: Categoria selecionada no seu componente CategorySelect
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
    id: 'all',
    name: 'Filtra por Categoria'
  });

  // Controle de ordenação por 'quantity' (Qtd.) ou 'revenue' (Faturamento)
  const [orderBy, setOrderBy] = useState<'quantity' | 'revenue'>('quantity');

  // Injeta a opção de redefinir o filtro ("Todos") no início da lista do Select
  const selectOptions = useMemo(() => {
    const soldCategoryIds = new Set(
      items.map((item) => item.categoryId).filter(Boolean)
    );

    const activeCategories = categories.filter((cat) =>
      soldCategoryIds.has(cat.id)
    );

    return [{ id: 'all', name: 'Filtra por Categoria' }, ...activeCategories];
  }, [items, categories]);

  // Lógica inteligente que filtra produtos ou agrupa por categoria, e ordena dinamicamente
  const processedItems = useMemo(() => {
    let result: RankingItem[] = [];

    if (rankingType === 'products') {
      result = items.filter((item) => {
        if (!selectedCategory || selectedCategory.id === 'all') return true;
        return item.categoryId === selectedCategory.id;
      });
    } else {
      const categoryMap: Record<
        string,
        { id: string; name: string; quantity: number; revenue: number }
      > = {};

      items.forEach((item) => {
        if (!item.categoryId) return;

        const categoryName =
          categories.find((c) => c.id === item.categoryId)?.name ||
          'Sem Categoria';

        if (!categoryMap[item.categoryId]) {
          categoryMap[item.categoryId] = {
            id: item.categoryId,
            name: categoryName,
            quantity: 0,
            revenue: 0
          };
        }

        categoryMap[item.categoryId].quantity += item.quantity;
        categoryMap[item.categoryId].revenue += item.revenue;
      });

      result = Object.values(categoryMap);
    }

    return [...result].sort((a, b) => b[orderBy] - a[orderBy]);
  }, [items, rankingType, selectedCategory, categories, orderBy]);

  // Limita o ranking aos 30 primeiros resultados
  const displayedItems = processedItems.slice(0, 30);

  React.useEffect(() => {
    setSelectedCategory({ id: 'all', name: 'Filtra por Categoria' });
  }, [categories]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Ranking de
        <Text
          style={{
            color:
              rankingType === 'products' ? colors.green[500] : colors.blue[500]
          }}
        >
          {' '}
          {rankingType === 'products' ? 'Produtos' : 'Categorias'}
        </Text>
      </Text>

      {/* FILTRO 1: Alternar entre Produtos e Categorias */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setRankingType('products')}
          style={[
            styles.filterButton,
            {
              backgroundColor:
                rankingType === 'products' ? colors.green[500] : 'transparent'
            }
          ]}
        >
          <Text
            style={[
              styles.filterText,
              {
                fontFamily:
                  rankingType === 'products'
                    ? fontFamily.bold
                    : fontFamily.medium,
                color: rankingType === 'products' ? colors.white : '#6B7280'
              }
            ]}
          >
            Produtos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setRankingType('categories');
            setSelectedCategory({ id: 'all', name: 'Filtra por Categoria' });
          }}
          style={[
            styles.filterButton,
            {
              backgroundColor:
                rankingType === 'categories' ? colors.blue[500] : 'transparent'
            }
          ]}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: rankingType === 'categories' ? colors.white : '#6B7280'
              }
            ]}
          >
            Categorias
          </Text>
        </TouchableOpacity>
      </View>

      {/* FILTRO 2: CategorySelect */}
      {rankingType === 'products' && (
        <View style={styles.selectWrapper}>
          <CategorySelect
            options={selectOptions}
            selectedCategory={selectedCategory}
            onSelect={(category) => setSelectedCategory(category)}
            style={{ marginTop: 0 }}
          />
        </View>
      )}

      {/* TABELA DE RANKING COM ALTURA CONTROLADA E SCROLLVIEW */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho Interativo, Ordenável e Separado por Colunas */}
        <View style={styles.tableHeader}>
          {/* Coluna 1: Título e Ícone */}
          <View style={styles.headerColumnLeft}>
            <MaterialIcons
              name={rankingType === 'products' ? 'shopping-bag' : 'folder'}
              size={16}
              color={
                rankingType === 'products'
                  ? colors.green[500]
                  : colors.blue[500]
              }
            />
            <Text
              style={[
                styles.headerLabelText,
                {
                  color:
                    rankingType === 'products'
                      ? colors.green[500]
                      : colors.blue[500]
                }
              ]}
            >
              {rankingType === 'products' ? 'Produto' : 'Categoria'}
            </Text>
          </View>

          {/* Divisor Vertical */}
          <View style={styles.headerDivider} />

          {/* Coluna 2: Cabeçalho Interativo de Quantidade */}
          <TouchableOpacity
            onPress={() => setOrderBy('quantity')}
            activeOpacity={0.7}
            style={styles.headerCellQuantity}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily:
                  orderBy === 'quantity' ? fontFamily.bold : fontFamily.medium,
                color: orderBy === 'quantity' ? '#3B82F6' : '#6B7280'
              }}
            >
              Qtd.
            </Text>
            {orderBy === 'quantity' && (
              <Text style={{ fontSize: 10, color: '#3B82F6' }}>▼</Text>
            )}
          </TouchableOpacity>

          {/* Divisor Vertical */}
          <View
            style={{ width: 1, height: '100%', backgroundColor: '#E5E7EB' }}
          />

          {/* Coluna 3: Cabeçalho Interativo de Faturamento */}
          <TouchableOpacity
            onPress={() => setOrderBy('revenue')}
            activeOpacity={0.7}
            style={styles.headerCellRevenue}
          >
            <Text
              style={[
                styles.headerCellText,
                {
                  fontFamily:
                    orderBy === 'revenue' ? fontFamily.bold : fontFamily.medium,
                  color: orderBy === 'revenue' ? '#3B82F6' : '#6B7280'
                }
              ]}
            >
              R$
            </Text>
            {orderBy === 'revenue' && (
              <Text style={styles.headerSortArrow}>▼</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Corpo da Tabela com Rolagem Interna */}
        <ScrollView
          style={styles.scrollWrapper}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {displayedItems.length === 0 ? (
            <EmptyComponent
              text="Nenhum dado acumulado"
              subtext="Não encontramos registros de vendas para o período ou filtro selecionado."
              icon="magnify"
              color={colors.gray[400]}
              size={120}
            />
          ) : (
            displayedItems.map((item, index) => (
              <View key={item.id} style={styles.row}>
                {/* Coluna de Conteúdo 1: Ícone + Rank + Nome */}
                <View style={styles.rowColumnLeft}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                  <Text numberOfLines={1} style={styles.rowNameText}>
                    {item.name}
                  </Text>
                </View>

                {/* Divisor Vertical */}
                <View style={styles.rowDivider} />

                {/* Coluna de Conteúdo 2: Valor de Quantidade */}
                <View style={styles.rowCellQuantity}>
                  <Text
                    style={[
                      styles.rowValueText,
                      {
                        fontFamily:
                          orderBy === 'quantity'
                            ? fontFamily.semiBold
                            : fontFamily.regular,
                        color: orderBy === 'quantity' ? '#111827' : '#4B5563'
                      }
                    ]}
                  >
                    {item.quantity}
                  </Text>
                </View>

                {/* Divisor Vertical */}
                <View style={styles.rowDivider} />

                {/* Coluna de Conteúdo 3: Valor de Faturamento */}
                <View style={styles.rowCellRevenue}>
                  <Text
                    style={[
                      styles.rowValueText,
                      {
                        fontFamily:
                          orderBy === 'revenue'
                            ? fontFamily.bold
                            : fontFamily.semiBold,
                        color: orderBy === 'revenue' ? '#111827' : '#4B5563'
                      }
                    ]}
                  >
                    R$ {item.revenue.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
