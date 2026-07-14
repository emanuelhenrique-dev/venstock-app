import { StyleSheet } from 'react-native';

import { fontFamily } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 4,
    marginBottom: 54
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    color: '#111827',
    marginBottom: 16
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 12,
    marginBottom: 12
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  filterText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: '#6B7280'
  },
  selectWrapper: {
    marginBottom: 16
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  headerColumnLeft: {
    width: '54%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 6
  },
  headerDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB'
  },
  headerCellQuantity: {
    width: '19%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4
  },
  headerCellRevenue: {
    width: '27%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4
  },
  headerCellText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    color: '#6B7280'
  },
  headerLabelText: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    includeFontPadding: false
  },
  headerSortArrow: {
    fontSize: 10,
    color: '#3B82F6'
  },
  scrollWrapper: {
    height: 260
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'stretch'
  },
  rowColumnLeft: {
    width: '54%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 8
  },
  rankText: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    color: '#9CA3AF',
    width: 18,
    includeFontPadding: false
  },
  rowNameText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: '#111827',
    flex: 1,
    includeFontPadding: false
  },
  rowValueText: {
    fontSize: 14,
    includeFontPadding: false
  },
  rowDivider: {
    width: 1,
    backgroundColor: '#E5E7EB'
  },
  rowCellQuantity: {
    width: '19%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14
  },
  rowCellRevenue: {
    width: '27%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14
  }
});
