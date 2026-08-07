// import React, { useRef, useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import SimplePeer from 'simple-peer';

// const socket = io.connect('http://localhost:3002');

// const CallComponent = () => {

//     const [me, setMe] = useState('');
//     const [stream, setStream] = useState(null);
//     const [receivingCall, setReceivingCall] = useState(false);
//     const [caller, setCaller] = useState('');
//     const [callerSignal, setCallerSignal] = useState();
//     const [callAccepted, setCallAccepted] = useState(false);

//     const myVideo = useRef();
//     const userVideo = useRef();
//     const connectionRef = useRef();

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//             setStream(stream);
//             myVideo.current.srcObject = stream;
//         });

//         socket.on('me', (id) => {
//             setMe(id);
//         });

//         socket.on('receiveCall', (data) => {
//             setReceivingCall(true);
//             setCaller(data.from);
//             setCallerSignal(data.signal);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const callUser = (id) => {
//         const peer = new SimplePeer({
//             initiator: true,
//             trickle: false,
//             stream: stream
//         });

//         peer.on('signal', (data) => {
//             socket.emit('callUser', { userToCall: id, signal: data, from: me });
//         });

//         peer.on('stream', (stream) => {
//             userVideo.current.srcObject = stream;
//         });

//         socket.on('callAccepted', (signal) => {
//             setCallAccepted(true);
//             peer.signal(signal);
//         });

//         connectionRef.current = peer;
//     };

//     const answerCall = () => {
//         setCallAccepted(true);
//         const peer = new SimplePeer({
//             initiator: false,
//             trickle: false,
//             stream: stream
//         });

//         peer.on('signal', (data) => {
//             socket.emit('answerCall', { signal: data, to: caller });
//         });

//         peer.on('stream', (stream) => {
//             userVideo.current.srcObject = stream;
//         });

//         peer.signal(callerSignal);
//         connectionRef.current = peer;
//     };

//     return (
//         <div>
//             <div>
//                 <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
//             </div>
//             <div>
//                 {callAccepted ? (
//                     <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
//                 ) : null}
//             </div>
//             <div>
//                 {receivingCall && !callAccepted ? (
//                     <div>
//                         <h1>{caller} is calling...</h1>
//                         <button onClick={answerCall}>Answer</button>
//                     </div>
//                 ) : (
//                     <button onClick={() => callUser('some-user-id')}>Call</button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CallComponent;