import * as React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Navigation from './Navigation';
import { AuthProvider } from './AuthContext';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#191D88',
    accent: '#FFC436',
    background: '#EEF7FF',
    surface: '#FFFFFF',
    text: '#000000',
    placeholder: '#888888',
  },
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </AuthProvider>
  );
}
