import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const socket = io.connect("https://chatserver-mu.vercel.app/"); // Assuming your server is running on port 5001

const CallComponent = () => {
  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("yourID", (id) => {
      setYourID(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  };

  return (
    <div>
      <div>
        <video playsInline muted ref={userVideo} autoPlay />
        <video playsInline ref={partnerVideo} autoPlay />
      </div>
      <button onClick={() => callUser("user-id-to-call")}>Call</button>
      {receivingCall && !callAccepted ? (
        <div>
          <h1>Someone is calling...</h1>
          <button onClick={acceptCall}>Accept</button>
        </div>
      ) : null}
    </div>
  );
};

export default CallComponent;
