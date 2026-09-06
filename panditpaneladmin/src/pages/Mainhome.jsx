import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../components/sidenavbar/sidenavbar";
import useAuthStore from "../components/Store/AuthStore/AuthStore";
import VerificationPending from "../components/VerificationPending/VerificationPending";

// ⚡ Lazy Loaded Pandit Admin Components
const Userlistrequest = lazy(() => import("../components/alluserrequestlist/alluserrequestlistrequest"));
const PanditProfile = lazy(() => import("../components/panditprofile/panditprofile"));
const Chatrequest = lazy(() => import("../components/chatrequest/chatrequest"));
const Callrequest = lazy(() => import("../components/callrequest/callrequest"));
const Videocallrequest = lazy(() => import("../components/videocallrequest/videocallrequest"));
const PanditVideoCall = lazy(() => import("../components/videocallrequest/PanditVideoCall"));
const EditProfileForm = lazy(() => import("../components/panditprofile/editprofileform"));
const Home = lazy(() => import("../components/home/home"));
const Panditchat = lazy(() => import("../components/panditchat/Panditchat"));
const Chathistoryusers = lazy(() => import("../components/chathistoryusersname/chathistoryusers"));
const Chathistory = lazy(() => import("../components/chathistory/chathistory"));
const AssignedBookings = lazy(() => import("../components/AssignedBookings/AssignedBookings"));

const AdminLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
    <div style={{ width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #ff7a00", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

function Mainhome() {
  const navigate = useNavigate();
  const { pandit, panditGet, loading1 } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("Pandittoken");
    if (!token || token === "undefined" || token === "null") {
      navigate("/");
      return;
    }
    panditGet().then((res) => {
      if (!res && !localStorage.getItem("panditUser")) {
        localStorage.removeItem("Pandittoken");
        localStorage.removeItem("pandit_id");
        navigate("/");
      }
    });
  }, [navigate]); // Run once on mount

  const token = localStorage.getItem("Pandittoken");
  if (!token || token === "undefined" || token === "null") {
    navigate("/");
    return null;
  }

  // Only block with AdminLoader if initial pandit profile is actively loading and not yet available
  if (loading1 && !pandit) {
    return <AdminLoader />;
  }

  // Verification check:
  // If pandit is explicitly unverified/pending
  const isPendingVerification =
    pandit &&
    (pandit.verified === 0 ||
      pandit.verified === "0" ||
      pandit.verified === false ||
      pandit.status === "pending" ||
      pandit.status === "rejected" ||
      pandit.is_verified === 0 ||
      pandit.is_verified === "0");

  if (isPendingVerification) {
    return <VerificationPending />;
  }

  return (
    <>
      <div>
        <Navbar />
      </div>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chatrequest" element={<Chatrequest />} />
          <Route path="/callrequest" element={<Callrequest />} />
          <Route path="/videocallrequest" element={<Videocallrequest />} />
          <Route path="/panditchat" element={<Panditchat />} />
          <Route path="/panditvideocall" element={<PanditVideoCall />} />
          <Route path="/assignedbookings" element={<AssignedBookings />} />
          <Route path="/assigned-pujas" element={<AssignedBookings />} />
          <Route path="/bookings" element={<AssignedBookings />} />
          <Route path="/userlistrequest" element={<Userlistrequest />} />
          <Route path="/panditprofile" element={<PanditProfile />} />
          <Route path="/profile" element={<PanditProfile />} />
          <Route path="/editprofileform" element={<EditProfileForm />} />
          <Route path="/chathistoryusers" element={<Chathistoryusers />} />
          <Route path="/chathistory" element={<Chathistory />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default Mainhome;


