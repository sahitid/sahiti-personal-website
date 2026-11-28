module.exports = {
  async redirects() {
    return [
      { source: '/about', destination: '/puzzle', permanent: true },
      { source: '/sum-of-parts', destination: '/puzzle', permanent: true },
    ];
  },
};
