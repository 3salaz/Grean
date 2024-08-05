import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grean.greanapp',
  appName: 'grean',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    "url": "http://localhost:3000", // or your custom server URL
    "cleartext": true
  }
};

export default config;
