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
            '@rn-toolkit/auth': '../../packages/auth/src',
            '@rn-toolkit/analytics': '../../packages/analytics/src',
            '@rn-toolkit/i18n': '../../packages/i18n/src',
            '@rn-toolkit/performance': '../../packages/performance/src',
            '@rn-toolkit/notifications': '../../packages/notifications/src',
            '@rn-toolkit/security': '../../packages/security/src',
          },
        },
      ],
    ],
  };
};
