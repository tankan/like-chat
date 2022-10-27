import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";
export const useIMStore = defineStore("im", () => {
  const im = ref(null);
  return { im };
});
// 热更新
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIMStore, import.meta.hot));
}
