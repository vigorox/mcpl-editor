<template>
  <div>
    <q-layout view="lHh lpr lFf" container style="height: 100vh">
      <!--Header-->
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>MCPL Editor</q-toolbar-title>
          <!-- <q-btn flat round icon="info" @click="showVersion()" /> -->
          <q-btn flat round icon="menu">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="showVersion()">
                  <q-item-section>{{ $t('Version') }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="editScriptRootPath()">
                  <q-item-section>{{ $t('Script_Path') }}</q-item-section>
                </q-item></q-list
              >
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <!--Footer-->
      <q-footer>
        <div class="row justify-center">
          <q-btn
            flat
            stack
            no-caps
            class="q-px-lg"
            @click="selectedFileUpdated(selectedFile)"
          >
            <q-icon name="refresh" />
            <div>{{ $t('Reload') }}</div>
          </q-btn>
          <q-btn flat stack no-caps class="q-px-lg" @click="save()">
            <q-icon name="save" />
            <div>{{ $t('Save') }}</div>
          </q-btn>
        </div>
      </q-footer>

      <q-page-container>
        <q-page class="q-pa-lg">
          <div class="row justify-between">
            <div class="row">
              <q-select
                class="q-pa-sm"
                style="min-width: 150px; max-width: 300px"
                :model-value="selectedFolder"
                :options="folderOptions"
                :label="t('Folder')"
                emit-value
                map-options
                @update:model-value="selectedFolderUpdated"
              />
              <q-select
                class="q-pa-sm"
                style="min-width: 500px"
                :model-value="selectedFile"
                @update:model-value="selectedFileUpdated"
                :options="fileOptions"
                emit-value
                map-options
                :label="t('File')"
              />
            </div>

            <div class="row">
              <q-select
                class="q-pa-sm"
                style="min-width: 120px"
                v-model="fontSize"
                :options="fontSizeOptions"
                @update:model-value="fontSizeChanged"
                emit-value
                map-options
                :label="$t('Font_Size')"
              />
              <q-select
                class="q-pa-sm"
                style="min-width: 120px"
                v-model="themeMode"
                @update:model-value="themeModeUpdated"
                :options="themeModeOptions"
                :label="$t('Theme')"
                emit-value
                map-options
              />
            </div>
          </div>
          <div id="aceEditorWrapper">
            <v-ace-editor
              class="q-ma-sm"
              id="aceEditor"
              v-model:value="content"
              @init="aceEditorInit"
              @change="aceEditorChanged"
              lang="powerlang"
              theme="chrome"
              :options="{
                fontSize: fontSize,
                showPrintMargin: false,
                behavioursEnabled: true,
                wrapBehavioursEnabled: true,
                autoScrollEditorIntoView: true,
                wrap: true,
              }"
              style="border: 2px solid #ccc"
            />
          </div>
        </q-page>
        <q-dialog v-model="dlgScriptRootPathIsOpened" persistent>
          <q-card style="width: 500px">
            <q-card-section>
              <q-input v-model="tmpScriptRootPath" :label="t('Script_Path')" />
            </q-card-section>

            <q-card-section>
              <div class="row justify-between">
                <div class="row">
                  <q-btn
                    flat
                    color="red"
                    :label="t('Default')"
                    @click="setScriptRootPathToDefault()"
                  />
                </div>

                <div class="row">
                  <q-btn
                    flat
                    color="warning"
                    :label="t('Cancel')"
                    @click="dlgScriptRootPathIsOpened = false"
                  />
                  <q-btn
                    flat
                    color="warning"
                    :label="t('OK')"
                    @click="saveScriptRootPath()"
                  />
                </div></div
            ></q-card-section>
          </q-card>
        </q-dialog>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style>
#aceEditorWrapper {
  height: calc(100vh - 240px);
}
#aceEditor {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<script lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import DlgUtils from '@/api/DlgUtils';
import AppUtils from '@/api/AppUtils';
import { defineComponent, onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { VAceEditor } from 'vue3-ace-editor';
import * as remote from '@electron/remote';
import { Dark } from 'quasar';

import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-dracula';
import '@/assets/js/ace/mode-powerlang';
import ElectronUtils from '@/api/ElectronUtils';
import fs from 'fs';
import path from 'path';

import { useI18n } from 'vue-i18n';
import { LOGICAL_OPERATORS } from '@babel/types';

export default defineComponent({
  components: { VAceEditor },
  name: 'MainPage',
  setup() {
    const t = useI18n().t;
    const router = useRouter();
    const content = ref('');
    const isContentChanged = ref(false);

    const themeMode = ref('light');
    const themeModeOptions = [
      {
        label: t('Light'),
        value: 'light',
      },
      {
        label: t('Dark'),
        value: 'dark',
      },
    ];

    const fontSize = ref('11pt');
    const fontSizeOptions = [
      {
        label: '10',
        value: '10pt',
      },
      {
        label: '11',
        value: '11pt',
      },
      {
        label: '12',
        value: '12pt',
      },
      {
        label: '14',
        value: '14pt',
      },
    ];

    const fontSizeChanged = (val) => {
      fontSize.value = val;
    };

    onMounted(async () => {
      readConfigs();
      themeModeUpdated();
      selectedFolderUpdated('s');
    });

    const showVersion = () => {
      DlgUtils.alert('App version: ' + ElectronUtils.readPackageJson().version);
    };

    const aceEditorInit = (obj) => {
      // ace editor init
    };

    const readConfigs = () => {
      AppUtils.createDefaultConfigFileIfNotExisted();
      scriptRootPath.value = AppUtils.readConfig()['studiesPath'];
      themeMode.value = AppUtils.readConfig()['themeMode'];
    };

    const procMcFileNames = (fileNames: string[]) => {
      var realFileNames = [];

      for (let i = 0; i < fileNames.length; i++) {
        const realName = AppUtils.decodeFileName(fileNames[i]);
        realFileNames.push({
          label: realName,
          value: fileNames[i],
        });
      }

      // sort by label (name)
      realFileNames = realFileNames.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      return realFileNames;
    };

    const selectedFolder = ref('s');
    const folderOptions = [
      {
        label: 'Functions',
        value: 'f',
      },
      {
        label: 'Indicators',
        value: 'i',
      },
      {
        label: 'Strategies',
        value: 's',
      },
    ];

    const selectedFolderUpdated = async (val) => {
      if (!fs.existsSync(scriptRootPath.value + '/Studies/SrcEl/Strategies')) {
        DlgUtils.alert(t('Script_Path_is_not_correct. Please_check_it!'));
        return;
      }
      if (isContentChanged.value == true) {
        const r = await DlgUtils.confirm({
          message: t(
            'The_content_is_modified. Are_you_sure_you_want_to_discard_the_change?'
          ),
        });

        if (r == false) {
          return;
        }
      }

      selectedFolder.value = val;

      var folderPath = '';

      if (selectedFolder.value === 'f') {
        folderPath = scriptRootPath.value + '/Studies/SrcEl/Functions';
      } else if (selectedFolder.value === 'i') {
        folderPath = scriptRootPath.value + '/Studies/SrcEl/Indicators';
      } else if (selectedFolder.value === 's') {
        folderPath = scriptRootPath.value + '/Studies/SrcEl/Strategies';
      }

      if (folderPath != '') {
        selectedFolderPath.value = folderPath;
        var fcNames = fs.readdirSync(selectedFolderPath.value);
        fileOptions.value = procMcFileNames(fcNames);
        selectedFile.value = fileOptions.value[0].value;
        load();
      }
    };

    const selectedFolderPath = ref('');
    const selectedFile = ref('');
    const fileOptions = ref([]);

    const selectedFileUpdated = async (val) => {
      if (isContentChanged.value == true) {
        const r = await DlgUtils.confirm({
          message: t(
            'The_content_is_modified. Are_you_sure_you_want_to_discard_the_change?'
          ),
        });

        if (r == false) {
          return;
        }
      }

      selectedFile.value = val;
      load();
    };

    const load = async () => {
      var text = fs.readFileSync(
        selectedFolderPath.value + '/' + selectedFile.value,
        {
          encoding: 'ascii',
        }
      );

      text = AppUtils.encodedAsciiStringToUtf8String(text);
      content.value = text;

      var editor = ace.edit('aceEditor');
      editor.resize(true);
      editor.scrollToLine(0, true, true, () => {
        // callback
      });
      setTimeout(() => {
        isContentChanged.value = false;
      }, 500);
    };

    const save = async () => {
      const r = await DlgUtils.confirm({
        message: t('Are_you_sure_you_want_to_save?'),
      });

      if (r != true) {
        return;
      }

      await DlgUtils.showPreloader(t('Saving'), 300);

      const encodedAscii = AppUtils.utf8StringToEncodedAsciiString(
        content.value
      );

      fs.writeFileSync(
        selectedFolderPath.value + '\\' + selectedFile.value,
        encodedAscii,
        'ascii'
      );
      isContentChanged.value = false;
      // DlgUtils.alert(t('Saved'));

      await DlgUtils.showPreloader(t('Saved'), 300);
      await DlgUtils.hidePreloader();
    };

    const aceEditorChanged = () => {
      isContentChanged.value = true;
    };

    const themeModeUpdated = () => {
      var editor = ace.edit('aceEditor');
      var config = AppUtils.readConfig();

      if (themeMode.value == 'dark') {
        Dark.set(true);
        editor.setTheme('ace/theme/dracula');

        config.themeMode = 'dark';
        AppUtils.writeConfig(config);
      } else {
        Dark.set(false);
        editor.setTheme('ace/theme/chrome');
        config.themeMode = 'light';
        AppUtils.writeConfig(config);
      }
    };

    const scriptRootPath = ref('');
    const tmpScriptRootPath = ref('');
    const dlgScriptRootPathIsOpened = ref(false);
    const editScriptRootPath = () => {
      tmpScriptRootPath.value = scriptRootPath.value;
      dlgScriptRootPathIsOpened.value = true;
    };

    const saveScriptRootPath = () => {
      scriptRootPath.value = tmpScriptRootPath.value;
      const appDataPath = ElectronUtils.getAppDataFolder('', 'mcpl-editor');
      fs.writeFileSync(
        appDataPath + '/mcpl-editor.json',
        JSON.stringify({
          studiesPath: scriptRootPath.value,
        }),
        'utf8'
      );
      dlgScriptRootPathIsOpened.value = false;
      selectedFolderUpdated(selectedFolder.value);
    };

    const setScriptRootPathToDefault = () => {
      scriptRootPath.value =
        'C:/ProgramData/TS Support/MultiCharts64/StudyServer';
    };

    return {
      t,
      showVersion,
      content,
      aceEditorInit,
      selectedFolder,
      folderOptions,
      selectedFolderUpdated,
      selectedFile,
      selectedFileUpdated,
      fileOptions,
      selectedFolderPath,
      save,
      fontSize,
      fontSizeOptions,
      fontSizeChanged,
      aceEditorChanged,
      themeMode,
      themeModeOptions,
      themeModeUpdated,
      editScriptRootPath,
      dlgScriptRootPathIsOpened,
      scriptRootPath,
      tmpScriptRootPath,
      saveScriptRootPath,
      setScriptRootPathToDefault,
    };
  },
});
</script>
