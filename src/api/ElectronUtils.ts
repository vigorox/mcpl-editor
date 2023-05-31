import electron from 'electron';
import * as remote from '@electron/remote';
import path from 'path';
import os from 'os';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class ElectronUtils {
  static isElectron = () => {
    // Renderer process
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      (window.process as any).type === 'renderer'
    ) {
      return true;
    }

    // Main process
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!process.versions.electron
    ) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0
    ) {
      return true;
    }

    return false;
  };

  static setZoomFactor = (zoomFactor: number) => {
    electron.webFrame.setZoomFactor(zoomFactor);
  };

  static adjustZoom = (params?: {
    originalInnerHeight?: number;
    originalScaleFactor?: number;
    originalDevicePixelRatio?: number;
  }) => {
    params = params || {};
    const originalInnerHeight =
      typeof params.originalInnerHeight !== 'undefined'
        ? params.originalInnerHeight
        : 1080;
    const originalScaleFactor =
      typeof params.originalScaleFactor !== 'undefined'
        ? params.originalScaleFactor
        : 1.0;
    const originalDevicePixelRatio =
      typeof params.originalDevicePixelRatio !== 'undefined'
        ? params.originalDevicePixelRatio
        : 1.0;

    const scaleFactor = remote.screen.getPrimaryDisplay().scaleFactor;

    this.setZoomFactor(
      (window.innerHeight / originalInnerHeight) *
        (window.devicePixelRatio / originalDevicePixelRatio) *
        (originalScaleFactor / scaleFactor)
    );
  };

  static disableManualZoom = () => {
    window.onkeydown = (e: KeyboardEvent) => {
      // e.metaKey = CMD key on macOS
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.code == 'Minus' || e.code == 'Equal')
      ) {
        e.preventDefault();
      }
    };
  };

  static forceDeviceScaleFactorToOneOnWin32 = () => {
    if (os.platform() === 'win32') {
      remote.app.commandLine.appendSwitch('high-dpi-support', '1');
      remote.app.commandLine.appendSwitch('force-device-scale-factor', '1');
    }
  };

  static getAppDataFolder = (companyName: string, appName: string) => {
    const osDataFolder = remote.app.getPath('appData');
    const appDataFolder = path.join(osDataFolder, companyName, appName);
    this.createFolder(appDataFolder);
    return appDataFolder;
  };

  static createFolder = (folderPath: string) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder '${folderPath}' is created`, 'info');
    }
  };

  static readPackageJson = () => {
    if (isDevelopment) {
      return JSON.parse(fs.readFileSync(path.join('./package.json'), 'utf-8'));
    } else {
      return JSON.parse(
        fs.readFileSync(
          path.join(remote.app.getAppPath(), 'package.json'),
          'utf-8'
        )
      );
    }
  };

  static deleteFolderRecursive = (path: string) => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file: string, index: number) => {
        const curPath = `${path}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          this.deleteFolderRecursive(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
}
