module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    // this is to fix pinia issue
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
  devServer: {
    port: 8082,
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        // extraMetadata: {}, // Dont's use extraMetadata becuase electron-builder doesn't respect extraMetadata fully. Instead, please edit package.json by script such as npm-before-build-electron.js
        productName: 'MCPL Editor',
        asar: true, // 是否使用 asar 壓縮檔案
        appId: 'cc.mcpl', // 認證的 appId
        artifactName: 'MCPL-Editor-${version}.${ext}', // 檔案名稱樣板，有 ESLint 記得關掉
        copyright: 'NA', // 版權
        // Windows 相關設定
        win: {
          legalTrademarks: 'NA', // 商標
          // publisherName: 'PUBLISHER_NAME', // Don't use publisherName otherwise electron-updater will fail (signed issue)
          icon: 'src/icons/mcpl.ico', // 安裝檔圖示
          target: [
            {
              target: 'nsis', // 檔案類型
              arch: ['x64'], // 檔案位元，越多類型檔案越大
            },
          ],
        },
        mac: {
          icon: 'src/icons/mcpl.icns', // 安裝檔圖示
        },
        nsis: {
          oneClick: true, // 是否一鍵安裝
          perMachine: false, // 是否安裝給本機的所有使用者(安裝到C:\Program Files)
          installerIcon: 'src/icons/mcpl.ico', // 安裝圖示
          uninstallerIcon: 'src/icons/mcpl.ico', // 卸載圖示
          installerHeaderIcon: 'src/icons/mcpl.ico', // 安裝頂部圖示
          allowToChangeInstallationDirectory: false, // 是否可更改安裝目錄
          createDesktopShortcut: true, // 是否建立桌面捷徑
          createStartMenuShortcut: true, // 是否建立開始捷徑
        },
      },
    },
  },
  transpileDependencies: ['quasar'],
};
