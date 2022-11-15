import { useUserMedia } from "@vueuse/core";
import { postData } from "./fetch";
interface localSteam {
  constraints: object;
  streamUrl: string;
}
export async function createLocalStream({
  constraints, streamUrl,
}: localSteam) {
  // {videoDeviceId,
  //   audioDeviceId,}
  const pc = new RTCPeerConnection(undefined);
  const { stream, start } = await useUserMedia(constraints);
  await start();
  if (stream.value) {
    // 创建收发器
    pc.addTransceiver("audio", {
      direction: "sendonly",
    });
    pc.addTransceiver("video", {
      direction: "sendonly",
    });
    const tracks = stream.value.getTracks();
    // 添加视频轨或音频轨
    tracks.forEach((track) => {
      pc.addTrack(track);
    });
    // 创建本地 offer
    const offer = await pc.createOffer();
    // 本地连接属性
    offer && (await pc.setLocalDescription(offer));
    // 获取远端 offer
    const answer = await postData("https://tv.canicode.cn/publish/", {
      streamurl: `webrtc://118.193.36.25/${streamUrl}`,
      sdp: offer.sdp,
    });
    // 远端连接属性
    answer &&
      (await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp: answer.sdp,
        })
      ));
  }
  return { pc, stream };
}