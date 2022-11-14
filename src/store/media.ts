import { defineStore } from "pinia";
import { useDevicesList, useUserMedia, useDisplayMedia } from "@vueuse/core";
import { ref } from "vue";
export const useMediaStore = defineStore("mediaStore", () => {
  const {
    devices,
    videoInputs: cameras,
    audioInputs: microphones,
    audioOutputs: speakers,
  } = useDevicesList({
    requestPermissions: true,
  });
  return { };
});