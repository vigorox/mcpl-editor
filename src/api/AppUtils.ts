import electron from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';
import iconv from 'iconv-lite';
import ElectronUtils from './ElectronUtils';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class AppUtils {
  static isAscii = (str: string) => {
    return /^[\x00-\x7F]*$/.test(str);
  };

  static bytesToHexString = (bytes) => {
    var hexString = '';
    for (let i = 0; i < bytes.length; i++) {
      hexString += bytes[i].toString(16).padStart(2, '0');
    }
    return hexString;
  };

  static decodeFileName = (fileName: string) => {
    const firstChar = fileName.substring(0, 1);
    if (firstChar == 'f' || firstChar == 's' || firstChar == 'i') {
      var specialChar = '';

      if (fileName.indexOf('_') == 1) {
        specialChar = '';
      } else {
        specialChar = fileName.substring(1, 2);
      }

      var re = new RegExp(specialChar + '[a-fA-F0-9]{2}', 'g');

      const realName = fileName
        .replace(re, (matched) => {
          var hexString = matched.substring(1, 3);
          var dec = parseInt(hexString, 16);
          var char = String.fromCharCode(dec);
          return char;
        })
        .replace(new RegExp(firstChar + specialChar + '_'), '');

      return realName;
    }
    return '';
  };

  static utf8StringToEncodedAsciiString = (utf8String: string) => {
    const reg = new RegExp(/[^\x00-\x7F]/, 'g');

    const encodedAscii = utf8String.replace(reg, (matched) => {
      const buffers = iconv.encode(matched, 'utf-8');
      const bytes = Array.from(buffers);
      return '\\u{' + AppUtils.bytesToHexString(bytes) + '}';
    });

    return encodedAscii;
  };

  static encodedAsciiStringToUtf8String = (encodedAsciiString: string) => {
    const reg = new RegExp(/\\u\{[0-9a-fA-F]+\}/, 'g');

    const utf8String = encodedAsciiString.replace(reg, (matched) => {
      var temp = matched.replace('\\u{', '').replace('}', '');
      const bytes: number[] = [];
      for (let c = 0; c < temp.length; c += 2)
        bytes.push(parseInt(temp.substring(c, c + 2), 16));

      return iconv.decode(Buffer.from(bytes), 'utf-8');
    });

    return utf8String;
  };

  static getConfigFilePath = () => {
    return path.join(
      ElectronUtils.getAppDataFolder('', 'mcpl-editor'),
      'mcpl-editor.json'
    );
  };

  static createDefaultConfigFileIfNotExisted = () => {
    const configFilePath = this.getConfigFilePath();

    if (fs.existsSync(configFilePath) == false) {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({
          studiesPath: 'C:/ProgramData/TS Support/MultiCharts64/StudyServer',
          themeMode: 'dark',
        }),
        'utf8'
      );
    }
  };

  static readConfig = () => {
    const configFilePath = this.getConfigFilePath();

    if (fs.existsSync(configFilePath)) {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
      return config;
    } else {
      return null;
    }
  };

  static writeConfig = (config) => {
    const configFilePath = this.getConfigFilePath();
    fs.writeFileSync(configFilePath, JSON.stringify(config), 'utf8');
  };
}
