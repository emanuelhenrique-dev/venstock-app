import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    width: '100%',
    padding: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.white
  },
  payWithdrawalOptionsContainer: {
    width: '100%',
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 12,
    borderBottomWidth: 1,
    borderColor: colors.gray[100]
  },
  payWithdrawalOption: {
    position: 'relative',
    width: 84,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 6
  },
  pin: {
    position: 'absolute',
    top: 2,
    right: 2
  },
  summary: {
    paddingVertical: 5,
    gap: 2,
    height: 78
  },
  textInput: {
    width: '100%',
    backgroundColor: colors.gray[150],
    borderRadius: 8,
    padding: 8,
    color: colors.black,
    height: '100%',
    textAlign: 'left',
    textAlignVertical: 'top'
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 7
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    fontFamily: fontFamily.medium,
    color: colors.white
  }
});
