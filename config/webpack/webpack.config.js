const { env } = require('shakapacker');
const { existsSync } = require('fs');
const { resolve } = require('path');

const envSpecificConfig = () => {
  const path = resolve(__dirname, `${env.nodeEnv}.js`);
  if (existsSync(path)) {
    console.log(`Loading ENV specific webpack configuration file ${path}`);
    return require(path);
  } else {
    throw new Error(`Could not find file to load ${path}, based on NODE_ENV`);
  }
};

const baseConfig = envSpecificConfig();

module.exports = {
  ...baseConfig,
  resolve: {
    ...baseConfig.resolve,
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: false,
    },
  },
};
