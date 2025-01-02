import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  compress: true,
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
    };
    return config;
  },
});

export default nextConfig;
