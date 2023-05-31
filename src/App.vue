<template>
  <!-- <div></div> -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import ElectronUtils from './api/ElectronUtils';

export default {
  name: 'LayoutDefault',
  components: {
    // HelloWorld,
  },
  setup() {
    onMounted(() => {
      // mounted
      if (ElectronUtils.isElectron()) {
        ElectronUtils.forceDeviceScaleFactorToOneOnWin32();
        ElectronUtils.setZoomFactor(1);
        ElectronUtils.disableManualZoom();
      }
    });
    return {
      index: ref(1),
    };
  },
};
</script>
