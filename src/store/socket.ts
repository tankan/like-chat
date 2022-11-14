import { defineStore } from "pinia";
import { io } from "socket.io-client";
import type { Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

export const useSocketStore = defineStore("socketStore", () => {
  const url: string = import.meta.env.VITE_API_IM_URL;
  const options: Partial<ManagerOptions & SocketOptions> = {
    path: import.meta.env.VITE_API_IM_PATH,
    // autoConnect: true,
  }
  function initial(): Socket<DefaultEventsMap, DefaultEventsMap> {
    return io(url, options);
  }
  // socket.emit(name, message);
  // socket.on(name, handler);
  return { initial };
});
