// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Video from "twilio-video";

// import { FaPhoneSlash } from "react-icons/fa6";
// import { FaMicrophone } from "react-icons/fa6";
// import { FaMicrophoneSlash } from "react-icons/fa6";
// import { BsCameraVideoFill } from "react-icons/bs";
// import { BsCameraVideoOffFill } from "react-icons/bs";

// const VideoCall = () => {
//   const { roomName, token } = useParams();
//   const [room, setRoom] = useState(null);
//   const [streaming, setStreaming] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [videoDevice, setVideoDevice] = useState(null);
//   const [audioDevice, setAudioDevice] = useState(null);
//   const localVideoRef = useRef();
//   const remoteVideoRef = useRef();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (token && roomName) {
//       getMediaDevices();
//     } else {
//       console.error("Missing token or roomName");
//     }

//     return () => {
//       if (room) {
//         room.disconnect();
//         cleanupVideoElements();
//       }
//     };
//   }, [token, roomName]);

//   const getMediaDevices = async () => {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const videoDevices = devices.filter(device => device.kind === "videoinput");
//       const audioDevices = devices.filter(device => device.kind === "audioinput");

//       if (videoDevices.length > 0) {
//         setVideoDevice(videoDevices[0].deviceId); // Choose first available video device
//       } else {
//         console.error("No video device found");
//       }

//       if (audioDevices.length > 0) {
//         setAudioDevice(audioDevices[0].deviceId); // Choose first available audio device
//       } else {
//         console.error("No audio device found");
//       }

//       // Proceed to connect to the room after setting devices
//       if (videoDevice && audioDevice) {
//         connectToRoom();
//       }
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//     }
//   };

//   const connectToRoom = async () => {
//     try {
//       const room = await Video.connect(token, {
//         name: roomName,
//         audio: { deviceId: audioDevice },
//         video: { deviceId: videoDevice, width: 640 },
//       });

//       setRoom(room);

//       const localParticipant = room.localParticipant;
//       cleanupVideoElements();
//       attachParticipantTracks(localParticipant, localVideoRef.current);

//       room.on("participantConnected", (participant) => {
//         participant.tracks.forEach((publication) => {
//           if (publication.isSubscribed) {
//             attachTrack(publication.track, remoteVideoRef.current);
//           }
//         });

//         participant.on("trackSubscribed", (track) => {
//           attachTrack(track, remoteVideoRef.current);
//         });

//         participant.on("trackUnsubscribed", (track) => {
//           detachTrack(track, remoteVideoRef.current);
//         });
//       });

//       room.participants.forEach((participant) => {
//         participant.tracks.forEach((publication) => {
//           if (publication.isSubscribed) {
//             attachTrack(publication.track, remoteVideoRef.current);
//           }
//         });

//         participant.on("trackSubscribed", (track) => {
//           attachTrack(track, remoteVideoRef.current);
//         });

//         participant.on("trackUnsubscribed", (track) => {
//           detachTrack(track, remoteVideoRef.current);
//         });
//       });
//     } catch (error) {
//       console.error("Failed to connect to room:", error);
//     }
//   };

//   const cleanupVideoElements = () => {
//     if (localVideoRef.current) {
//       localVideoRef.current.innerHTML = "";
//     }
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.innerHTML = "";
//     }
//   };

//   const attachParticipantTracks = (participant, container) => {
//     participant.tracks.forEach((publication) => {
//       if (publication.track) {
//         attachTrack(publication.track, container);
//       }
//     });
//   };

//   const attachTrack = (track, container) => {
//     if (track.kind === "video") {
//       container.appendChild(track.attach());
//     }
//   };

//   const detachTrack = (track, container) => {
//     if (track.kind === "video") {
//       track.detach().forEach((element) => element.remove());
//     }
//   };

//   const handleEndCall = () => {
//     if (room) {
//       room.disconnect();
//       cleanupVideoElements();
//     }
//     setStreaming(false);
//     navigate("/astrology");
//   };

//   // const toggleMute = () => {
//   //   const localParticipant = room.localParticipant;
//   //   localParticipant.audioTracks.forEach((publication) => {
//   //     if (isMuted) {
//   //       publication.track.enable();
//   //     } else {
//   //       publication.track.disable();
//   //     }
//   //   });
//   //   setIsMuted(!isMuted);
//   // };

//   // const toggleVideo = () => {
//   //   const localParticipant = room.localParticipant;
//   //   localParticipant.videoTracks.forEach((publication) => {
//   //     if (isVideoOff) {
//   //       publication.track.enable();
//   //     } else {
//   //       publication.track.disable();
//   //     }
//   //   });
//   //   setIsVideoOff(!isVideoOff);
//   // };
//   const toggleMute = () => {
//     if (!room || !room.localParticipant) {
//       console.error("Room or localParticipant is not available");
//       return;
//     }
  
//     const localParticipant = room.localParticipant;
//     localParticipant.audioTracks.forEach((publication) => {
//       if (isMuted) {
//         publication.track.enable();
//       } else {
//         publication.track.disable();
//       }
//     });
//     setIsMuted(!isMuted);
//   };
  
//   const toggleVideo = () => {
//     if (!room || !room.localParticipant) {
//       console.error("Room or localParticipant is not available");
//       return;
//     }
  
//     const localParticipant = room.localParticipant;
//     localParticipant.videoTracks.forEach((publication) => {
//       if (isVideoOff) {
//         publication.track.enable();
//       } else {
//         publication.track.disable();
//       }
//     });
//     setIsVideoOff(!isVideoOff);
//   };
  
//   return (
//     <div className="video_box">
//       <div className="container">
//         <div className="localContainer">
//           <div ref={localVideoRef}></div>
//         </div>
//         <div className="remoteContainer">
//           <div ref={remoteVideoRef}></div>
//         </div>
//         {streaming && (
//           <div className="buttonContainer">
//             <button onClick={toggleMute} className="endcall">
//               {isMuted ? <FaMicrophone /> : <FaMicrophoneSlash />}
//             </button>
//             <button onClick={toggleVideo} className="endcall">
//               {isVideoOff ? <BsCameraVideoOffFill /> : <BsCameraVideoFill />}
//             </button>
//             <button onClick={handleEndCall} className="endcall">
//               <FaPhoneSlash />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Video from "twilio-video";

import { FaPhoneSlash } from "react-icons/fa6";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import { BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs";

const VideoCall = () => {
  const { roomName, token } = useParams();
  const [room, setRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && roomName) {
      connectToRoom();
    } else {
      console.error("Missing token or roomName");
    }

    return () => {
      if (room) {
        room.disconnect();
        cleanupVideoElements();
      }
    };
  }, [token, roomName]);

  const connectToRoom = async () => {
    try {
      const room = await Video.connect(token, {
        name: decodeURIComponent(roomName), // Decode any URL-encoded spaces
        audio: true,
        video: { width: 640 },
      });

      setRoom(room);
      cleanupVideoElements();

      // Attach local participant tracks
      attachParticipantTracks(room.localParticipant, localVideoRef.current);

      // Handle remote participants
      room.on("participantConnected", (participant) => {
        // console.log(`Participant connected: ${participant.identity}`);
        attachParticipantTracks(participant, remoteVideoRef.current);

        participant.on("trackSubscribed", (track) => {
          attachTrack(track, remoteVideoRef.current);
        });

        participant.on("trackUnsubscribed", (track) => {
          detachTrack(track, remoteVideoRef.current);
        });
      });

      room.participants.forEach((participant) => {
        // console.log(`Participant already connected: ${participant.identity}`);
        attachParticipantTracks(participant, remoteVideoRef.current);

        participant.on("trackSubscribed", (track) => {
          attachTrack(track, remoteVideoRef.current);
        });

        participant.on("trackUnsubscribed", (track) => {
          detachTrack(track, remoteVideoRef.current);
        });
      });
    } catch (error) {
      console.error("Failed to connect to the room:", error);
    }
  };

  const cleanupVideoElements = () => {
    if (localVideoRef.current) localVideoRef.current.innerHTML = "";
    if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
  };

  const attachParticipantTracks = (participant, container) => {
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        attachTrack(publication.track, container);
      }
    });
  };

  const attachTrack = (track, container) => {
    if (track.kind === "video") {
      const videoElement = track.attach();
      container.appendChild(videoElement);
      videoElement.play();
    }
  };

  const detachTrack = (track, container) => {
    if (track.kind === "video") {
      track.detach().forEach((element) => element.remove());
    }
  };

  const toggleMute = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (isMuted) {
          publication.track.enable();
        } else {
          publication.track.disable();
        }
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((publication) => {
        if (isVideoOff) {
          publication.track.enable();
        } else {
          publication.track.disable();
        }
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    if (room) {
      room.disconnect();
      cleanupVideoElements();
    }
    navigate("/astrology");
  };

  return (
    <div className="video_box">
      <div className="container">
        <div className="localContainer">
          <div ref={localVideoRef}></div>
        </div>
        <div className="remoteContainer">
          <div ref={remoteVideoRef}></div>
        </div>
        <div className="buttonContainer">
          <button onClick={toggleMute} className="endcall">
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button onClick={toggleVideo} className="endcall">
            {isVideoOff ? <BsCameraVideoOffFill /> : <BsCameraVideoFill />}
          </button>
          <button onClick={handleEndCall} className="endcall">
            <FaPhoneSlash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
