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
const joining = ref(true);
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
  joining.value = false;
  console.log("加入群聊", roomId.value);
}
function logout() {
  emit("logout", roomId.value);
  joining.value = true;
}
function send(){
  if (msg.value) {
    emit("msg", roomId.value, msg.value);
    msg.value = "";
  }
}
</script>

<template>
  <div class="flex flex-col justify-items-center chat-card chat-wd">
    <div class="text-left chat-content">
      <div v-for="group in chat" :key="group.id">
        <p class="text-gray-700  pl-2 pr-2 break-all">{{uid === group.id ? "我" : `用户${group.id}`}}: {{ group.message }}</p>
      </div>
    </div>
    <div class="chat-wd">
      <textarea class="chat-wd" :disabled="joining" v-model="msg" spellcheck="false" draggable="false" placeholder="请输入你要发送的消息内容" name="chat" rows="4" autocapitalize="none" autocomplete="off" autofocus="true"></textarea>
    </div>
    <div class="chat-wd">
      <button v-if="joining" @click.stop="joined">加入群聊</button>
      <button v-else @click.stop="logout">退出群聊</button>
      <button class="ml-4" :disabled="!msg" @click="send">发送消息</button>
    </div>
  </div>
</template>
<style>
.chat-wd {
  width: 280px;
}
.chat-card {
  overflow: hidden;
}
.chat-content {
  width: 280px;
  height: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #f9f9f9;
}
</style>