<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue"
import { useSocketStore } from "../store/socket";
interface message {
  id: string;
  message: string;
}
interface status {
  id: string;
  message: string;
}
const roomId = ref("chat");
const { initial } = useSocketStore();
const socket = initial();
const uid = ref("");
const msg = ref("");
const chat: Ref<message[]> = ref([]);
const usersStatus: Ref<status[]> = ref([])
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
  joined();
  console.log("uid: %O, roomId: %O", uid.value, roomId.value);
}
function onDisconnect() {
  console.log("disconnect: %O", socket.disconnected);
  usersStatus.value.push({
    id: uid.value,
    message: "断开连接"
  });
}
function onJoined(room: string, id: string) {
  console.info("joined: %O, %O", room, id);
  usersStatus.value.push({
    id,
    message: "加入群聊"
  });
}
function onLeaved(room: string, id: string) {
  console.info("leaved: %O, %O", room, id);
  usersStatus.value.push({
    id,
    message: "离开群聊"
  });
}
function onLogout(room: string, id: string) {
  console.info("logout: %O, %O", room, id);
  usersStatus.value.push({
    id,
    message: "退出群聊"
  });
}
function onOnline(room: string, users: object[]) {
  console.info("online: %O, %O", room, users);
}
function onLogged(room: string, id: string) {
  console.info("onLogged: %O, %O", room, id);
  usersStatus.value.push({
    id,
    message: "登陆房间"
  });
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
    <div class="text-left chat-content overflow-y-auto">
      <div v-if="joining" class="text-xs pl-2 pt-2 text-gray-500">你还没有加入群聊！</div>
      <div v-else-if="!chat.length" class="text-xs pl-2 pt-2 text-gray-500">暂无消息！</div>
      <div v-else v-for="group in chat" :key="group.id">
        <p class="text-gray-800 pl-2 pr-2 break-all"><span class="text-gray-400">{{uid === group.id ? "我" : `${group.id}`}}：</span>{{ group.message }}</p>
      </div>
    </div>
    <div class="chat-wd">
      <textarea class="chat-wd" :disabled="joining" v-model="msg" spellcheck="false" draggable="false" :placeholder="joining ? '你还没有加入群聊！' : '请点击输入你要发送的消息内容'" name="chat" rows="4" autocapitalize="none" autocomplete="off" autofocus="true"></textarea>
    </div>
    <div v-if="usersStatus.length" class="text-left chat-status overflow-y-auto">
      <div v-for="status in usersStatus" :key="status.id" class="text-xs pl-2 pt-2 text-gray-500">
        <span class="text-gray-400">{{ status.id === uid ? "你" : status.id }}</span> {{ status.message }}
      </div>
    </div>
    <div class="flex flex-row content-between justify-between">
      <button class="mr-4" :disabled="!msg" @click.stop="send">发送消息</button>
      <button v-if="joining" @click.stop="joined">加入群聊</button>
      <button v-else @click.stop="logout">退出群聊</button>
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
.chat-status {
  width: 280px;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 6px;
  background: #f9f9f9;
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