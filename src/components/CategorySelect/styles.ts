import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  label: { color: colors.black, fontFamily: fontFamily.medium, fontSize: 12 },
  container: {
    width: '100%',
    height: 56,
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 8,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray[200]
  },
  selectedText: {
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingTop: 12,
    maxHeight: '60%',
    paddingBottom: 50
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20
  },
  modalTitle: { fontSize: 18, fontFamily: fontFamily.bold, marginBottom: 20 },
  option: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.gray[500]
  }
});
