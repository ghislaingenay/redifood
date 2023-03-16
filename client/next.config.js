/** @type {import('next').NextConfig} */
const path = require("path");
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  i18n,
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"],
  },
  future: {
    webpack5: true,
  },
};

module.exports = nextConfig;
