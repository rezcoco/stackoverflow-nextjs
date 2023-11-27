/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        mdxRs: true,
        serverComponentsExternalPackages: ["mongoose"]
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "*"
            },
            {
                protocol: "https",
                hostname: "img.clerk.com"
            }
        ]
    }
}

module.exports = nextConfig
