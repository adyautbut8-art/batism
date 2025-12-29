declare module 'next' {
  interface NextConfig {
    eslint?: { ignoreDuringBuilds?: boolean };
    typescript?: { ignoreBuildErrors?: boolean };
    images?: {
      remotePatterns?: Array<{
        protocol?: string;
        hostname?: string;
        port?: string;
        pathname?: string;
      }>;
    };
  }
}
