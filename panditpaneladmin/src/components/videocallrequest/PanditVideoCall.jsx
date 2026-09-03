import React, { useState, useEffect, useRef } from "react";
import "./PanditVideoCall.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../Store/AuthStore/AuthStore";
import api from "../Axios/api";
import Swal from "sweetalert2";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaRupeeSign,
  FaUserCircle,
} from "react-icons/fa";
import { MdTimer } from "react-icons/md";

function PanditVideoCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pandit } = useAuthStore();

  const { requestId, userId, user_name, user_mobile, astroId } = location.state || {};

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [stream, setStream] = useState(null);

  const localVideoRef = useRef(null);
  const timerRef = useRef(null);
  const ratePerMinute = Number(pandit?.video_price || pandit?.videoPrice || pandit?.price || 25);
  const currentMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
  const currentEarnings = currentMinutes * ratePerMinute;

  // Initialize Camera & Live Timer
  useEffect(() => {
    startLocalCamera();

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopLocalCamera();
    };
  }, []);

  const startLocalCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      }
    } catch (err) {
      console.warn("Could not access webcam/microphone:", err);
    }
  };

  const stopLocalCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOff(!videoTracks[0].enabled);
      }
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopLocalCamera();

    const totalMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
    const totalEarned = totalMinutes * ratePerMinute;

    try {
      if (requestId) {
        await api.put(`/request/${requestId}`, {
          status: "completed",
          duration_minutes: totalMinutes,
          earned_amount: totalEarned,
        });
      }

      await Swal.fire({
        title: "🕉️ Video Consultation Completed!",
        html: `
          <div style="text-align: left; padding: 10px; font-size: 0.95rem; line-height: 1.6;">
            <p><strong>Devotee:</strong> ${user_name || "Yajman"}</p>
            <p><strong>Total Talk-Time:</strong> ${formatTimer(elapsedSeconds)} (${totalMinutes} mins)</p>
            <p><strong>Video Rate:</strong> ₹${ratePerMinute}/min</p>
            <hr style="border: 0.5px solid #e2e8f0; margin: 10px 0;" />
            <p style="font-size: 1.15rem; color: #16a34a; font-weight: bold;">
              <strong>Total Credited to Wallet:</strong> ₹${totalEarned.toLocaleString()}
            </p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Return to Dashboard",
        confirmButtonColor: "#ff7a00",
      });

      navigate("/home");
    } catch (error) {
      console.error("End call error:", error);
      navigate("/home");
    }
  };

  return (
    <div className="pandit_video_call_page">
      <div className="video_call_container">
        {/* Top Floating Header */}
        <div className="video_top_bar">
          <div className="devotee_call_info">
            <FaUserCircle className="devotee_icon" />
            <div>
              <h3>{user_name || "Devotee / Yajman"}</h3>
              <span className="live_call_badge">● Live Video Consultation</span>
            </div>
          </div>

          <div className="video_timer_badge">
            <MdTimer className="timer_icon" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="video_earning_badge">
            <FaRupeeSign className="rupee_icon" />
            <span>Rate: ₹{ratePerMinute}/min | Earned: ₹{currentEarnings}</span>
          </div>
        </div>

        {/* Video Area Grid */}
        <div className="video_screens_grid">
          {/* Main Remote Video Placeholder */}
          <div className="remote_video_box">
            <div className="remote_avatar_placeholder">
              <FaUserCircle className="big_user_icon" />
              <p>{user_name || "Devotee"}</p>
              <span>Connecting encrypted video stream...</span>
            </div>
          </div>

          {/* Picture-in-Picture Local Self Video */}
          <div className="local_video_box">
            <video ref={localVideoRef} autoPlay playsInline muted className="local_video_feed" />
            {isVideoOff && (
              <div className="camera_off_overlay">
                <FaVideoSlash />
                <span>Camera Off</span>
              </div>
            )}
            <span className="self_badge">You (Pandit Ji)</span>
          </div>
        </div>

        {/* Bottom Floating Controls Bar */}
        <div className="video_controls_bar">
          <button
            className={`control_circle_btn ${isMuted ? "active_off" : ""}`}
            onClick={toggleMute}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          <button
            className={`control_circle_btn ${isVideoOff ? "active_off" : ""}`}
            onClick={toggleVideo}
            title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </button>

          <button className="control_circle_btn btn_end_call" onClick={handleEndCall} title="End Video Call">
            <FaPhoneSlash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PanditVideoCall;
