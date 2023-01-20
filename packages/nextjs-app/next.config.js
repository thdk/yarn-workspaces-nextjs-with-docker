/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
};


module.exports = nextConfig
