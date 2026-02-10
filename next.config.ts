import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable image optimization for external URLs if needed
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // Google profile pictures
            },
        ],
    },
};

export default nextConfig;
