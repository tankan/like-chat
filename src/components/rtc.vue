<script setup lang="ts">
import { ref } from "vue";
import { useSocketStore } from "../store/socket";
const roomId = ref("rtc");
const { initial } = useSocketStore();
const socket = initial();
const uid = ref("");
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("joined", onJoined);
socket.on("logged", onLogged);
socket.on("leaved", onLeaved);
socket.on("logout", onLogout);
socket.on("online", onOnline);
function onConnect() {
  emit("login", roomId.value);
  uid.value = socket.id;
  console.log("uid: %O, roomId: %O", uid.value, roomId.value);
}
function onDisconnect() {
  console.log("disconnect: %O", socket.disconnected);
}
function onJoined(room: string, id: string) {
  console.info("joined: %O, %O", room, id);
}
function onLeaved(room: string, id: string) {
  console.info("leaved: %O, %O", room, id);
}
function onLogout(room: string, id: string) {
  console.info("logout: %O, %O", room, id);
}
function onOnline(room: string, users: object[]) {
  console.info("online: %O, %O", room, users);
}
function onLogged(room: string, id: string) {
  console.info("onLogged: %O, %O", room, id);
}
function emit(name: string, msg: any) {
  socket.emit(name, msg);
}
function joined() {
  emit("join", roomId.value);
  console.log("加入房间", roomId.value);
}
function logout() {
  emit("logout", roomId.value);
}
</script>
<template>
  <div>
    <p>uid: {{ uid }}</p>
    <p>roomId: {{ roomId }}</p>
    <div>
      <button @click.stop="joined">加入房间</button>
      <button @click.stop="logout">退出房间</button>
    </div>
  </div>
</template>