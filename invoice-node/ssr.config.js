import path from "path";

module.exports = {
  id: 'invoice-api',
  webpack: (config, env) => {
    config.resolve.alias = {
      "@server": path.resolve(__dirname, "./core/")
    };
    config.devtool = "source-map";
    return config;
  },
};
