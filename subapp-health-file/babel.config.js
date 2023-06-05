let transformRemoveConsolePlugin = [];
if (process.env.NODE_ENV === 'production') {
  transformRemoveConsolePlugin = [
    ["transform-remove-console", {
      "exclude": ["info"]
    }]
  ]
};
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    ...transformRemoveConsolePlugin
  ]
}