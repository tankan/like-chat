import { postData } from "./fetch";
interface remoteData { 
  onconnectionstatechange: Function;
  ontrack: Function;
  streamUrl: string;
}
export async function createRemoteStream(obj: remoteData) {
  const {
    onconnectionstatechange,
    ontrack,
    streamUrl
  } = obj;
  const pc = new RTCPeerConnection(null);
  // 监听连接变化
  pc.onconnectionstatechange = function (peerEvent) {
    onconnectionstatechange && onconnectionstatechange(peerEvent);
  };
  // 监听远端流事件
  pc.ontrack = function (trackEvent) {
    ontrack && ontrack(trackEvent);
  };
  // 创建收发器
  pc.addTransceiver("audio", {
    direction: "recvonly"
  });
  pc.addTransceiver("video", {
    direction: "recvonly"
  });
  // 创建本地 offer
  const offer = await pc.createOffer();
  // 本地连接属性 description
  offer && (await pc.setLocalDescription(offer));
  // 获取远端 offer
  const answer = await postData("https://tv.canicode.cn/play/", {
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
  // return pc;
}
