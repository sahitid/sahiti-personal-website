module.exports = {
  async redirects() {
    return [{ source: '/about', destination: '/sum-of-parts', permanent: true }];
  },
};
