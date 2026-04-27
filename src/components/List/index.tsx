import {
  FlatList,
  FlatListProps,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { styles } from './styles';
import { Separator } from '../Separator';
import { colors } from '@/theme';

interface Props<T> extends FlatListProps<T> {
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function List<T>({
  containerStyle,
  data,
  renderItem,
  ...rest
}: Props<T>) {
  return (
    <View style={[{ flex: 1, height: '100%' }, styles.content, containerStyle]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <Separator space={4} color={colors.gray[150]} />
        )}
        contentContainerStyle={[styles.listContent]}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </View>
  );
}
