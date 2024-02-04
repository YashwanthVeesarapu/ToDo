module.exports = {
  packagerConfig: {
    asar: true,
    icon: "src/assets/icon",
  },
  rebuildConfig: {},
  makers: [],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
