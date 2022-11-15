<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { useDevicesList } from "@vueuse/core";
// import { useMediaStore } from "../store/media";
import { useSocketStore } from "../store/socket";
import { createLocalStream } from "../utils/localStream";
import { createRemoteStream } from "../utils/remoteStream"
const {
  videoInputs: cameras,
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentCamera = computed(() => cameras.value[0]?.deviceId)
const currentMicrophone = computed(() => microphones.value[0]?.deviceId)
const roomId = ref("rtc");
const { initial } = useSocketStore();
// const {} = useMediaStore();
const socket = initial();
const uid = ref("");
const joining = ref(true);
// const remoteUsers = ref([]);
const local: Ref<HTMLVideoElement> = ref("local");
const remote: Ref<HTMLVideoElement> = ref("remote");
const peer: Ref<RTCPeerConnection> = ref(null);
const remotePeer: Ref<RTCPeerConnection> = ref(null);
const remoteTrack: Ref<RTCTrackEvent> = ref(null);
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);
socket.on("joined", onJoined);
socket.on("logout", onLogout);
socket.on("online", onOnline);
function onConnect() {
  emit("login", roomId.value);
  uid.value = socket.id;
  console.log("rtc, uid: %O, roomId: %O", uid.value, roomId.value);
}
function onDisconnect() {
  console.log("rtc disconnect: %O", socket.disconnected);
}
function onJoined(room: string, id: string) {
  console.info("rtc joined: %O, %O", room, id);
  playRemoteStream(id);
}
function onLogout(room: string, id: string) {
  console.info("rtc logout: %O, %O", room, id);
}
function onOnline(room: string, users: string[]) {
  console.info("rtc online: %O, %O", room, users);
  users.forEach((id) => {
    if (id !== uid.value) {
      playRemoteStream(id);
    }
  });
}
function emit(name: string, ...msg: any) {
  socket.emit(name, ...msg);
}
async function joined() {
  joining.value = false;
  const { pc, stream } = await createLocalStream({
    constraints: {
      width: 320,
      height: 240,
      autoSwitch: true,
      videoDeviceId: currentCamera,
      audioDeviceId: currentMicrophone,
    },
    streamUrl: uid.value
  });
  if (stream.value) {
    peer.value = pc;
    joining.value = false;
    local.value.srcObject = stream.value;
  }
  emit("join", roomId.value);
  console.log("加入连麦", roomId.value, pc, stream.value);
}
function logout() {
  const senders = peer.value.getSenders();
  senders.forEach((sender) => {
    sender.track?.stop();
  });
  peer.value.close();
  local.value.srcObject = null;
  joining.value = true;
  console.log("结束连麦", roomId.value);
  emit("logout", roomId.value);
}
async function playRemoteStream(id: string) {
  if (remote.value.srcObject) {
    const senders = remotePeer.value.getSenders();
    senders.forEach((sender) => {
      sender.track?.stop();
    });
    remotePeer.value.close();
    remote.value.srcObject = null;
  }
  const pc = await createRemoteStream({
    streamUrl: id,
    onconnectionstatechange: (peerEvent: Event) => {
      console.log("RTC peer connection event: %O", peerEvent)
    },
    ontrack: (trackEvent: RTCTrackEvent) => {
      remoteTrack.value = trackEvent;
      console.log("RTC peer track event: %O", trackEvent)
    }
  });
  remotePeer.value = pc;
}
function playRemoteVideo() {
  if (!remote.value.srcObject && remoteTrack.value.streams && remoteTrack.value.streams[0]) {
    remote.value.srcObject = remoteTrack.value.streams[0];
  }
}
</script>
<template>
  <div>
    <div>
      <button v-if="joining" @click.stop="joined">加入连麦</button>
      <button v-else @click.stop="logout">结束连麦</button>
      <button v-if="remoteTrack" @click.stop="playRemoteVideo">播放远端视频</button>
    </div>
    <div>
      <video ref="local" id="local" class="stream" autoplay muted></video>
    </div>
    <div>
      <video ref="remote" id="remote" class="stream" autoplay></video>
    </div>
  </div>
</template>
<style>
.stream {
  width: 320px;
  object-fit: contain;
}
</style>