module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    async rewrites() {
        const fallbackApiUrl = 'https://athletic-victory-production-b8f6.up.railway.app'
        const apiBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || fallbackApiUrl).replace(/\/+$/, '')
        return [
            {
                source: '/api/:path*',
                destination: `${apiBaseUrl}/api/:path*`,
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '**', // allows all https domains
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**', // allows all https domains
                pathname: '/**',
            },
        ],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
};
