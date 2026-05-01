import { View } from 'react-native';
import { styles } from './styles';
import { MotiView } from 'moti';
import { Separator } from '../Separator';
import { colors } from '@/theme';

export const ProductSkeleton = () => (
  <>
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.6 }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true
      }}
      style={[styles.container, { marginBottom: 8 }]}
    >
      <View style={styles.imageSkeleton} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <View
          style={{
            width: '70%',
            height: 16,
            backgroundColor: '#E1E9EE',
            borderRadius: 4
          }}
        />
        <View
          style={{
            width: '40%',
            height: 12,
            backgroundColor: '#E1E9EE',
            borderRadius: 4
          }}
        />
      </View>
    </MotiView>
    <Separator space={-4} color={colors.gray[150]} />
    <View
      style={{
        width: '100%',
        height: 1,
        marginTop: 6
      }}
    />
  </>
);
