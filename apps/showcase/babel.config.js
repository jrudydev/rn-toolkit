module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@rn-toolkit/theming': '../../packages/theming/src',
            '@rn-toolkit/primitives': '../../packages/primitives/src',
            '@rn-toolkit/sdui': '../../packages/sdui/src',
            '@rn-toolkit/deeplink': '../../packages/deeplink/src',
            '@rn-toolkit/testing': '../../packages/testing/src',
          },
        },
      ],
    ],
  };
};
