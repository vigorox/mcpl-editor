import i18n from '@/i18n/i18n';
const { t } = i18n.global;
import { Loading, Dialog, BottomSheet } from 'quasar';

export default class DlgUtils {
  static alert = async (message: string): Promise<void> => {
    this.hidePreloader();

    return new Promise((resolve) => {
      Dialog.create({
        message: message,
        persistent: true,
        html: true,
        ok: t('OK'),
      }).onOk(() => {
        resolve();
      });
    });
  };

  static dialog = null;
  // let dialogTimer = null;
  static showPreloader = async (message?: string, waitTimeout?: number) => {
    message = message || '';
    (waitTimeout = waitTimeout || 0),
      Loading.show({
        message: message,
        html: true,
        delay: 0,
        // boxClass: 'bg-grey-2 text-grey-9',
        // customClass: 'bg-grey-2 text-grey-9',
        // spinnerColor: 'primary',
      });

    if (typeof waitTimeout === 'number' && waitTimeout > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTimeout));
    }
  };

  static hidePreloader = () => {
    Loading.hide();

    try {
      if (this.dialog != null) {
        this.dialog.hide();
      }
    } catch (ex) {
      console.log(ex, 'ex');
    }
  };

  static showPreloaderWithExit = (params: {
    message: string;
    exitText?: string;
    exitCallback?: () => void;
  }) => {
    this.hidePreloader();
    const message = params.message;
    this.dialog = Dialog.create({
      message: message,
      progress: true,
      persistent: true,
      ok: params.exitText ? params.exitText : t('Cancel'),
      cancel: false,
      transitionHide: 'fade',
      transitionShow: 'fade',
    }).onOk(() => {
      this.dialog.hide();
      if (params.exitCallback != null) {
        params.exitCallback();
      }
    });
  };

  static updateShowPreloaderWithExit = (msg: string) => {
    if (this.dialog != null) {
      this.dialog.update({
        message: msg,
      });
    }
  };

  static confirm = async (params: {
    message: string;
    okText?: string | boolean;
    cancelText?: string | boolean;
  }): Promise<boolean> => {
    const ok = typeof params.okText !== 'undefined' ? params.okText : t('Yes');
    const cancel =
      typeof params.cancelText !== 'undefined' ? params.cancelText : t('No');
    this.hidePreloader();
    return new Promise((resolve, reject) => {
      Dialog.create({
        message: params.message,
        persistent: true,
        html: true,
        ok: ok,
        cancel: cancel,
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        });
    });
  };

  static bottomSheet = async (params: {
    message: string;
    actions: Array<{
      label: string;
      icon: string;
      classes?: string;
      click: () => void;
    }>;
  }) => {
    return new Promise((resolve, reject) => {
      const actions = params.actions.map((itm, itmIndex) => {
        return { ...itm, id: itmIndex, avatar: true };
      });
      BottomSheet.create({
        message: params.message,
        actions: actions,
      }).onOk((action) => {
        actions[action.id].click();
      });
    });
  };

  static prompt = (params: {
    title?: string;
    message: string;
    type?: any;
    cancelText?: string | boolean;
  }): Promise<string> => {
    const cancelText =
      typeof params.cancelText !== 'undefined'
        ? params.cancelText
        : t('Cancel');
    return new Promise((resolve, reject) => {
      Dialog.create({
        title: params.title,
        message: params.message,
        prompt: {
          model: '',
          type: typeof params.type !== 'undefined' ? params.type : 'text',
        },
        cancel: cancelText,
        persistent: true,
      })
        .onOk((data) => {
          // console.log('>>>> OK, received', data)
          resolve(data);
        })
        .onCancel(() => {
          resolve(null);
        })
        .onDismiss(() => {
          resolve(null);
        });
    });
  };
}
