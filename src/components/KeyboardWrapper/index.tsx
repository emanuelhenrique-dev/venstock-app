import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  ScrollViewProps
} from 'react-native';
import { colors } from '@/theme';

interface ScreenWrapperProps
  extends KeyboardAvoidingViewProps, ScrollViewProps {
  scrollView?: boolean;
  children: React.ReactNode;
}

export function KeyboardWrapper({
  scrollView = true,
  children,
  ...rest
}: ScreenWrapperProps) {
  const [flexToggle, setFlexToggle] = useState(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setFlexToggle(false)
    );
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setFlexToggle(true)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={flexToggle ? { flexGrow: 1 } : { flex: 1 }}
      enabled={!flexToggle}
    >
      {scrollView ? (
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.white }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ ...rest }.contentContainerStyle}
        >
          {children}
        </ScrollView>
      ) : (
        <>{children}</>
      )}
    </KeyboardAvoidingView>
  );
}
