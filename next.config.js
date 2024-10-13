/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */


import generated from "@next/mdx";

const withMDX = generated()

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include MDX files
    pageExtensions: ['ts', 'tsx', 'mdx', 'js', 'jsx']
    // Optionally, add any other Next.js config below
}
await import("./src/env.js");

export default withMDX(nextConfig)



