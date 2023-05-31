import { createI18n } from 'vue-i18n';

const checkLocale = () => {
  let _locale: string = 'en';

  // 判斷 手機/瀏覽器 的語言，顯示對應的語言介面
  if (typeof localStorage.locale !== 'undefined') {
    _locale = localStorage.locale;
  } else {
    try {
      switch (window.navigator.language) {
        case 'zh-TW':
          _locale = 'cht';
          break;
        case 'zh-HK':
          _locale = 'cht';
          break;
        default:
          _locale = 'en';
          break;
      }
    } catch (ex) {
      _locale = 'en';
    }
  }
  return _locale;
};

// Languages
// const EnBasicJson = require('@/assets/js/lptr-ts/src/languages/en-basic.json');
// const ChtBasicJson = require('@/assets/js/lptr-ts/src/languages/cht-basic.json');
// const ChsBasicJson = require('@/assets/js/lptr-ts/src/languages/chs-basic.json');
const EnJson = require('./en.json');
const ChtJson = require('./cht.json');

const LangJson = {
  en: EnJson,
  cht: ChtJson,
};
let locale = 'en';
locale = checkLocale();

const i18n = createI18n({
  locale: locale,
  messages: LangJson,
});

export default i18n;
