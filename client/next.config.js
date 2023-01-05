/**
 * @type {import('next').NextConfig}
 */

const { ModuleResolutionKind } = require("typescript");

const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    { key: "Referrer-Policy", value: "origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
    },
];

const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["res.cloudinary.com", "images.unsplash.com"],
    },
    devIndicators: {
        buildActivityPosition: "bottom-right",
    },
    generateBuildId: async () => {
        // You can, for example, get the latest git commit hash here
        return "my-build-id";
    },
    // poweredByHeader: false,
    // Use the CDN in production and localhost for development.
    // assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
    // async rewrites() {
    //   return []}
    // compiler: {
    // removeConsole: true,
    // },
    // apply HTTP response headers to all routes in your application

    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
};

module.exports = nextConfig;
