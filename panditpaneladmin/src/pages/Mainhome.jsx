import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/sidenavbar/sidenavbar";

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
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
    <div style={{ width: "36px", height: "36px", border: "3px solid #f3f3f3", borderTop: "3px solid #ff7a00", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

function Mainhome() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
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
