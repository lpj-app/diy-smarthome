/*
/** @type {import('next').NextConfig} */
//const nextConfig = {};
//export default nextConfig;

import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default withMDX()(nextConfig);
