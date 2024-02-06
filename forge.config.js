module.exports = {
  packagerConfig: {
    asar: true,
    icon: "src/assets/icon",
  },
  rebuildConfig: {},
  makers: [
    // {
    //   name: "@electron-forge/maker-dmg",
    //   config: {
    //     icon: "src/assets/icon.icns",
    //   },
    // },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        icon: "src/assets/icon.icns",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "YashwanthReddyVeesarapu",
          name: "ToDo",
        },
      },
    },
  ],
};
