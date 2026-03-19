import { Easing, TouchableOpacity, View } from 'react-native';
import { Text } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SequencedTransition
} from 'react-native-reanimated';

import { styles } from './styles';
import { colors } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.separatorLine} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            key={route.key}
            activeOpacity={0.6}
            layout={LinearTransition.springify().damping(35).mass(2)}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused
                  ? ' rgba(0, 128, 246, 0.2)'
                  : 'transparent'
              }
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? colors.blue[400] : colors.gray[400]
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(100)}
                style={[
                  styles.text,
                  { color: isFocused ? colors.blue[400] : colors.gray[400] }
                ]}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );
};

function getIconByRouteName(routeName: string, color: string) {
  let iconName: keyof typeof MaterialIcons.glyphMap;

  switch (routeName) {
    case 'index':
      iconName = 'home';
      break;
    case 'cart':
      iconName = 'shopping-cart';
      break;
    case 'cashier':
      iconName = 'qr-code';
      break;
    case 'profile':
      iconName = 'person';
      break;
    default:
      iconName = 'person';
  }

  return <MaterialIcons name={iconName} size={32} color={color} />;
}

export default CustomTabBar;
