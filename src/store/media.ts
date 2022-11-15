import { defineStore } from "pinia";
import { useDevicesList } from "@vueuse/core";
export const useMediaStore = defineStore("mediaStore", () => {
  const {
    devices,
    videoInputs: cameras,
    audioInputs: microphones,
    audioOutputs: speakers,
  } = useDevicesList({
    requestPermissions: true,
  });
  console.log("devices: %O, cameras: %O, microphones: %O, speakers: %O", devices, cameras, microphones, speakers);
  return { devices, cameras, microphones, speakers };
});
