declare module 'next-pwa' {
    import { NextConfig } from 'next';
  
    interface PWAOptions {
      dest: string;
      register?: boolean;
      skipWaiting?: boolean;
      disable?: boolean;
      // Add more options as needed
    }
  
    export default function withPWA(config: NextConfig & { pwa?: PWAOptions }): NextConfig;
  }
  