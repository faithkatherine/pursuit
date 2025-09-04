import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ShakeAnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export interface ShakeAnimatedViewRef {
  shake: () => void;
}

export const ShakeAnimatedView = forwardRef<ShakeAnimatedViewRef, ShakeAnimatedViewProps>(
  ({ children, style }, ref) => {
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    useImperativeHandle(ref, () => ({
      shake,
    }));

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  }
);

ShakeAnimatedView.displayName = 'ShakeAnimatedView';