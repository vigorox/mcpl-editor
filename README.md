# MCPL Editor

A workaround to support UTF-8 comments in MultiCharts's PL Editor.

## WARNING
* Use at your own risk!
* Make sure you backup/export all your scripts before using this app!

## Download
[Go to release page to download](https://github.com/vigorox/mcpl-editor/releases)

## Known Issues
* The opened script in PL Editor will not automatically reload/refresh after saving in MCPL Editor. It is required to manually close and re-open the script in PL Editor to update.
* A simple app takes about 200MB space of the disk.
* Only tested on Windows 11.
* Limited keyword highlighting support.
* Unable to compile or debug the script in MCPL Editor.
* Other potential issues.


## Project setup

```
npm install
```

### Debug in Electron

```
npm run electron:serve
```

### Build Electron

```
npm run electron:build
```


# 中文說明

MultiCharts的PL Editor無法使用中文註解的折衷方案

![image](https://raw.githubusercontent.com/vigorox/mcpl-editor/master/images/mcpl-editor-demo.png)

## 警告
***使用此軟體風險請自負，建議使用前先備份匯出所有的程式!***

## 安裝
請到[Release頁面](https://github.com/vigorox/mcpl-editor/releases)下載MCPL-Editor.exe並點擊即會安裝

## 說明
中文註解在PL Editor中會顯示為編碼過的文字，如 "報價" 會顯示為以下文字
``` 
\u{e5a0b1}\u{e583b9}
```

## 已知問題
* 程式碼若已經在PLE中開啟，之後在此工具中修改並儲存該程式碼，PLE上已開啟的程式碼必需先關掉並再打開一次才會更新。若沒有先重載，就在PLE中進行編譯或存檔，那麼之前在本工具中修改的內容都會消失!
* 此程式佔用約200MB的硬碟空間。
* 只在Windows 11上測試過。
* 有限的關鍵字高亮度支援。
* 無法在MCPL Editor中編譯或除錯程式碼。
* 可能會被防毒軟體誤判為惡意程式。
* 其他潛在問題。
