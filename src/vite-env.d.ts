/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ImportMetaEnv {
  readonly VITE_API_IM_URL: string;
  readonly VITE_API_IM_PATH: string;
  // 更多环境变量...
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}