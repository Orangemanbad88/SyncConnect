import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.syncconnect.app',
  appName: 'SYNC',
  webDir: 'dist/public',
  server: {
    // Dev only — comment out for production builds
    url: 'http://10.0.2.2:5000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0D0F12',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D0F12',
    },
  },
};

export default config;
