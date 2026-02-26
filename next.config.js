module.exports = {
    reactStrictMode: true,
    output: 'standalone',
    env: {
        NEXT_PUBLIC_GOOGLE_MAP_KEY: (
            process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ||
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
            process.env.GOOGLE_MAP_KEY ||
            process.env.GOOGLE_MAP_API_KEY ||
            ''
        ).trim(),
    },
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
