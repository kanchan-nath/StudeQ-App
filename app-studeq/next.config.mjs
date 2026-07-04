const nextConfig = {
  trailingSlash: true, // This ensures index.html is served correctly
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|ico|woff|woff2|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;