import { colors, fontFamily } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,

    borderRadius: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
    marginHorizontal: 2,
    paddingHorizontal: 8,
    paddingVertical: 10,

    borderLeftWidth: 1,
    borderColor: colors.red[500]
  },
  imageSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 170,
    backgroundColor: '#E1E9EE'
  }
});
