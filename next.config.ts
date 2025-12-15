import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: {
        position: "bottom-right",
    },
    experimental: {
        optimizeCss: true,
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
