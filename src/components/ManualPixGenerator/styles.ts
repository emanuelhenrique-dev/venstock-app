import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  inputTitle: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    marginBottom: 8,
    color: colors.black
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontFamily: fontFamily.regular,
    color: colors.black,
    backgroundColor: colors.gray[100],
    marginBottom: 12
  },
  saveButton: {
    backgroundColor: colors.green[500],
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24
  },
  saveButtonText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: 16
  },
  qrWrapper: {
    alignItems: 'center',
    gap: 4,
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: -20,
    padding: 8,
    zIndex: 1
  },
  qrCard: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  instructionsText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 16,
    includeFontPadding: false
  },
  copyContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[150],
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.green[500],
    alignItems: 'center',
    marginTop: 12
  },
  copyText: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    includeFontPadding: false
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: fontFamily.medium,
    color: colors.gray[500]
  }
});
