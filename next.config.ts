import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: blob: https:; " +
      "font-src 'self' https: data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self' https:; " +
      "upgrade-insecure-requests",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "vfftpuqtdhkpfeiourat.supabase.co" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
