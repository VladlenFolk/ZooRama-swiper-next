/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.mds.yandex.net", "i.pinimg.com"], // Добавляем доверенный домен
  },
};

export default nextConfig;
