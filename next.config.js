const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    turbopack: {
        // ...
    },

    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname);
        return config;
    }
};

module.exports = nextConfig;