import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.matchingo.game',
  appName: 'Matchingo',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'LIGHT',
    },
    SplashScreen: {
      // Stay until LoadingSplash calls hideNativeSplash — avoids white gap.
      launchAutoHide: false,
      backgroundColor: '#0284c7',
      showSpinner: false,
    },
    FirebaseAuthentication: {
      // Keep auth on the JS SDK so Firestore uses the same session.
      skipNativeAuth: true,
      providers: ['apple.com', 'google.com'],
    },
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    scrollEnabled: false,
    // Match splash sky top so WebView never flashes cream/white.
    backgroundColor: '#0284c7',
  },
};

export default config;
