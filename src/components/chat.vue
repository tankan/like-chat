<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue"
import { useSocketStore } from "../store/socket";
interface message {
  id: string;
  message: string;
}
const roomId = ref("chat");
const { initial } = useSocketStore();
const socket = initial();
const uid = ref("");
const msg = ref("");
const chat: Ref<message[]> = ref([]);
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("joined", onJoined);
socket.on("logged", onLogged);
socket.on("msg", onMsg);
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
function onMsg(id: string, message: string) {
  console.info("id: %s, msg: %s", id, message);
  chat.value.push({
    id: id,
    message: message
  })
}
function emit(name: string, ...msg: any) {
  socket.emit(name, ...msg);
}
function joined() {
  emit("join", roomId.value);
  console.log("加入群聊", roomId.value);
}
function logout() {
  emit("logout", roomId.value);
}
function send(){
  if (msg.value) {
    emit("msg", roomId.value, msg.value);
    msg.value = "";
  }
}
// function change(e: Event) {
//   console.info("change: %O", e.target);
//   msg.value = e.target?.value;
// }
</script>

<template>
  <div class="card">
    <div>
      <div v-for="group in chat" :key="group.id">
        <span>【{{ group.id }}】：</span>
        <span>{{ group.message }}</span>
      </div>
    </div>
    <div>
      <textarea v-model="msg" spellcheck="false" draggable="false" placeholder="请输入你要发送的消息内容" name="chat" id="chat" cols="30" rows="3" autocapitalize="none" autocomplete="off" autofocus="true"></textarea>
    </div>
    <!-- contenteditable -->
    <button @click.stop="joined">加入群聊</button>
    <button @click.stop="logout">退出群聊</button>
    <button @click="send">发送</button>
  </div>
</template>
