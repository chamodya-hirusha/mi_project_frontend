/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add any specific Next.js config here
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
