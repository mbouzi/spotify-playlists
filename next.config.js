/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env : {
      MORALIS_ID: 'moralisId',
      MORALIS_SERVER: 'moralisServer',
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
      SPOTIFY_AUTH_ENDPOINT: process.env.SPOTIFY_AUTH_ENDPOINT,
      SPOTIFY_RESPONSE_TYPE: process.env.SPOTIFY_RESPONSE_TYPE
    }
  }

module.exports = nextConfig
