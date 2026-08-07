import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Header from "./Components/header";
// import Home from "./Components/home";
// import Signup from "./Components/signup/Signup";
// import Login from "./Components/login/Login";
// import Otp from "./Components/otp/Otp";
import Footer from "./Components/footer";
import Onlinepuja from "./Components/onlinepuja/onlinepuja";
import About from "./Components/about/about";
import PanditForm from "./Components/form/pandit_form";
import Kalsharpdosh from "./Components/kalsharpdosh/kalsharpdosh";
import Rahuketupooja from "./Components/rahuketupooja/rahuketupooja";
import Pitradoshpooja from "./Components/pitradoshpooja/pitradoshpooja";
import Shrimahamritunejayjaap from "./Components/shrimahamritunejayjaap/shrimahamritunejayjaap";
import Temple from "./Components/temple/temple";
import Navgrah from "./Components/navgrah/navgrah";
import Mangaldosh from "./Components/mangaldosh/mangaldosh";
import Satyanarayan from "./Components/satyanarayan/satyanarayan";
import Khajranatemple from "./Components/khajranatemple/khajranatemple";
import Sundarkand from "./Components/sundarkand/sundarkand";
import Rudraabhishek from "./Components/rudraabhishek/rudraabhishek";
import Siddhivinayak from "./Components/siddhivinayak/siddhivinayak";
import Rinmukti from "./Components/rinmukti/rinmukti";
import Vastushanti from "./Components/vastudosh/vastudosh";
import Ujjaintemple from "./Components/ujjaintemple/ujjaintemple";
import Prasaddelivery from "./Components/prasaddelivery/prasaddelivery";
import Khajranaprasad from "./Components/khajranaprasadonline/khajranaprasad";
import Ujjainprasad from "./Components/ujjainprasadonline/ujjainprasad";
import Astrology from "./Components/astrology/astrology";
import Astrologyprofile from "./Components/astrology/astrologyprofile";
import Checkout from "./Components/checkout/checkout";
// import Ecomerce from "./Components/ecomerce/ecomerce";
import Pandit from "./Components/pandit/pandit";
import Yoga from "./Components/yoga/yoga";
import Astrologyprofileman from "./Components/astrology/astrologyprofile";
import Membership from "./Components/membership/membership";
import Enquiryform from "./Components/pandit/enquiryform";
import Panditprofile from "./Components/pandit/panditprofile";
import Booknowform from "./Components/temple/booknowform";
import Muhurat from "./Components/muhurat/muhurat";
import Panditprofilemuhurat from "./Components/muhurat/panditprofilemuhurat";
import Panditaboutprofile from "./Components/muhurat/panditaboutprofile";
import Productdetails from "./Components/ecomerce/productdetails";
import Buymembership from "./Components/membership/buymembership";
// import callComponent from "./Components/calling/callComponenst"
import Astrologyform from "./Components/astrology/astrologyform";
import Recharge from "./Components/astrology/recharge";
import Chat from "./Components/astrology/chat";
import VideoCall from "./Components/astrology/videoCall";
import Privacypolicy from "./Components/privacypolicy";
import UpdateDetailsUser from "./Components/membership/updatedetailsuser";
import Termsandcondition from "./Components/termsandcondition";
import BuyNowForm from "./Components/ecomerce/buynowform";
import Cart from "./Components/cart";
import Navbar from "./Components/navbar";
import Bookpoojaform from "./Components/onlinepuja/bookpoojaform";
import FeedbackForm from "./Components/onlinepuja/feedbackform";
import Prasadcheckout from "./Components/prasaddelivery/prasadcheckout";
import Ecomerceookingpage from "./Components/ecommercebookingpage/bookingpage";
import Prasadbookingpage from "./Components/prasadbookingpage/prasadbookingpage";
import Templebookingpage from "./Components/templebooking/Templebookingpage";
import Yogabookingpage from "./Components/yogabooking/yogabookingpage";
import Bookingdetailspage from "./Components/ecommercebookingpage/bookingdetailspage";
import ScrollToTop from "./Components/scrolltotop";
import Blog from "./Components/Blog/blog";
import Pricing from "./Components/pricing";
import ProblemDetail from "./Components/problem/problemDetail";
import ProblemPooja from "./Components/problem/problemPooja";
import Refundpolicy from "./Components/refundpolicy";
import Shipingpolicy from "./Components/shipingpolicy";
import Disclaimler from "./Components/disclaimler";
import PaymentPolicy from "./Components/payment";
import Blogs from "./Components/Blog/blogs";
import Poojabooking from "./Components/poojabooking/poojabooking";
import Onlineboojabooking from "./Components/poojabooking/onlineboojabooking";
import Problempoojabooking from "./Components/poojabooking/problempoojabooking";
import BookProblemPooja from "./Components/problem/bookproblempooja";
import Faq from "./Components/faq";
import Ourteam from "./Components/ourteam";
import Editprofile from "./Components/editprofile";
import Testimonial from "./Components/testimonial";
import useAuthStore from "./Store/UserStore/userAuthStore";
import NetworkError from "./Components/NetworkError/NetworkError";
import OrderTracking from "./Components/OrderTracking/OrderTracking";
import NotFound from "./Components/NotFoundPage";
import Registrationsuccess from "./Components/form/registrationsuccess";
import Rejectedpage from "./Components/form/rejectedpage";
import Vivahmuhuratform from "./Components/muhurat/vivahmuhuratform";
import Grihaparaveshmuhuratform from "./Components/muhurat/grihaparaveshmuhuratform";
import Vehiclepurchasemuhurat from "./Components/muhurat/vehiclepurchasemuhurat";
import Propertypurchasemuhuratform from "./Components/muhurat/propertypurchasemuhuratform";
import Pujanmuhurat from "./Components/muhurat/pujanmuhurat";
import Chathistorypandits from "./Components/astrology/chathistorypandits";
import Chatshistoryuser from "./Components/astrology/chatshistoryuser";
import CustomerSupport from "./Components/SupportForUser/CustomerSupport";
import SupportHome from "./Components/SupportForUser/SupportHome";
import ViewSupportTicket from "./Components/SupportForUser/ViewSupportTicket";
import ViewSingleTicket from "./Components/SupportForUser/ViewSingleTicket";
import Productreview from "./Components/ecommercebookingpage/productreview";
// import EcommerceNew from "./Components/ecomerce/ecommerceNew";
import NewLoader from "./Components/NewLoader/NewLoader";

import EcommerceNew2 from "./Components/ecomerce/ecommerceNew2";

import NewHome from "./Components/NewHome/NewHome";
import CustomCursor from "./Components/NewHome/CustomCursor";

import PanchmukhiShaniHanumanMandir from "./Components/PanchmukhiShaniHanumanMandir/PanchmukhiShaniHanumanMandir";
// import HanumanPopup from "./Components/HanumanPopup/HanumanPopup";.

import NewEventPage from "./Components/UpCommingEvents/NewEventPage";
function App() {
  const { setIsLoggin, userGet } = useAuthStore();
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getUser = async () => {
    try {
      await userGet();
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.info("Notification permission granted.");
          } else {
            console.error("Notification permission denied.");
          }
        });
      }
      setHasNetworkError(false);
    } catch (error) {
      if (error.message === "Network Error") {
        setHasNetworkError(true);
      }
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggin(true);
      getUser();
    } else {
      setIsLoggin(false);
      localStorage.removeItem("token");
    }
  }, [setIsLoggin]);

  if (hasNetworkError) {
    return <NetworkError />;
  }

  return (
    <div>
      <div>{loading && <NewLoader />}</div>

      <div className="cursoneContainer">
        <CustomCursor />
      </div>

      <BrowserRouter>
        <Navbar />

        <a
          href="https://wa.me/917225016699"
          target="_blank"
          rel="noreferrer noopener"
          className="whatsapp-icon"
        >
          <i className="fa-brands fa-whatsapp" />
        </a>

        {/*<HanumanPopup />*/}

        <ScrollToTop />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<NewHome />} />

          <Route path = "/sawan-festival" element={<NewEventPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/onlinepooja" element={<Onlinepuja />} />
          <Route path="/bookpoojaform" element={<Bookpoojaform />} />
          <Route path="/feedbackform" element={<FeedbackForm />} />
          <Route path="/kaalsarppooja/:id" element={<Kalsharpdosh />} />
          <Route path="/rahuketupooja/:id" element={<Rahuketupooja />} />
          <Route path="/pitradoshpooja/:id" element={<Pitradoshpooja />} />
          <Route path="/navgrahpooja/:id" element={<Navgrah />} />
          <Route path="/mangaldoshpooja/:id" element={<Mangaldosh />} />
          <Route path="/satyanarayankatha/:id" element={<Satyanarayan />} />
          <Route path="/sundarkandpooja/:id" element={<Sundarkand />} />
          <Route path="/rudraabhishekpooja/:id" element={<Rudraabhishek />} />
          <Route path="/vastushantipooja/:id" element={<Vastushanti />} />
          <Route path="/rinmuktipooja/:id" element={<Rinmukti />} />
          <Route path="/sidhivinayakpooja/:id" element={<Siddhivinayak />} />
          <Route
            path="/mahamrityunjayajaap/:id"
            element={<Shrimahamritunejayjaap />}
          />
          <Route path="/temple" element={<Temple />} />
          <Route path="/booknowform" element={<Booknowform />} />
          <Route path="/temple/1" element={<Khajranatemple />} />
          <Route path="/temple/2" element={<Ujjaintemple />} />
          <Route path="/temple/3" element={<PanchmukhiShaniHanumanMandir />} />

          <Route path="/prasaddelivery" element={<Prasaddelivery />} />
          <Route path="/prasad/1" element={<Khajranaprasad />} />
          <Route path="/prasad/2" element={<Ujjainprasad />} />
          <Route path="/astrology" element={<Astrology />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/astrologyform" element={<Astrologyform />} />
          <Route path="/astrologyprofile" element={<Astrologyprofile />} />
          <Route
            path="/astrologyprofileman"
            element={<Astrologyprofileman />}
          />
          <Route path="/astrologyprofile/:id" element={<Astrologyprofile />} />
          <Route path="/panditform" element={<PanditForm />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* <Route path="/e-commerce" element={<EcommerceNew />} /> */}
          <Route
            path="/productdetails/:productId"
            element={<Productdetails setIsLoginPopup />}
          />
          <Route path="/buynowform/:productId" element={<BuyNowForm />} />
          <Route path="/pandit" element={<Pandit />} />
          <Route path="/panditprofile/:id" element={<Panditprofile />} />
          <Route path="/enquiryform" element={<Enquiryform />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/buymembership" element={<Buymembership />} />
          <Route path="/updatedetailsuser" element={<UpdateDetailsUser />} />
          <Route path="/muhurat" element={<Muhurat />} />
          <Route
            path="/panditmuhuratprofile/:id"
            element={<Panditprofilemuhurat />}
          />
          <Route path="/privacypolicy" element={<Privacypolicy />} />
          <Route path="/termsandcondition" element={<Termsandcondition />} />

          <Route path="/support" element={<SupportHome />} />
          <Route path="/support/create" element={<CustomerSupport />} />
          <Route path="/support/view" element={<ViewSupportTicket />} />
          <Route
            path="/support/view/:ticketId"
            element={<ViewSingleTicket />}
          />

          {/* </Route> */}
          <Route path="/privacypolicy" element={<Privacypolicy />} />
          <Route path="/termsandcondition" element={<Termsandcondition />} />

          <Route
            path="/panditaboutprofile/:id"
            element={<Panditaboutprofile />}
          />
          <Route path="/muhurat" element={<Muhurat />} />
          <Route path="/panditaboutprofile" element={<Panditaboutprofile />} />
          <Route
            path="/chat/:astrologerId/:price/:requestId"
            element={<Chat />}
          />
          <Route path="/videoCall/:roomName/:token" element={<VideoCall />} />
          <Route path="/videoCall" element={<VideoCall />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/prasadcheckout" element={<Prasadcheckout />} />
          <Route path="/myorders" element={<Ecomerceookingpage />} />
          <Route path="/prasadbookingpage" element={<Prasadbookingpage />} />
          <Route path="/templebookingpage" element={<Templebookingpage />} />
          <Route path="/yogabookingpage" element={<Yogabookingpage />} />
          <Route path="/poojabooking" element={<Poojabooking />} />
          <Route path="/onlineboojabooking" element={<Onlineboojabooking />} />
          <Route
            path="/problempoojabooking"
            element={<Problempoojabooking />}
          />
          <Route path="/bookproblempooja" element={<BookProblemPooja />} />
          <Route path="/bookproblempooja" element={<BookProblemPooja />} />
          <Route
            path="/bookingdetailspage/:id"
            element={<Bookingdetailspage />}
          />
          <Route path="/refund&cancle" element={<Refundpolicy />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogss" element={<Blogs />} />
          <Route path="/blog/:title/:id" element={<Blogs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/problems/:problem" element={<ProblemPooja />} />
          <Route path="/problemDetail/:id" element={<ProblemDetail />} />
          <Route path="/shipingpolicy" element={<Shipingpolicy />} />
          <Route path="/disclaimer" element={<Disclaimler />} />
          <Route path="/paymentpolicy" element={<PaymentPolicy />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/ourteam" element={<Ourteam />} />
          <Route path="/editprofile" element={<Editprofile />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/track-order/:orderId" element={<OrderTracking />} />
          <Route
            path="/registrationsuccess"
            element={<Registrationsuccess />}
          />
          <Route path="/rejectedpage" element={<Rejectedpage />} />

          <Route path="/vivahmuhuratform" element={<Vivahmuhuratform />} />
          <Route
            path="/grihaparaveshmuhuratform"
            element={<Grihaparaveshmuhuratform />}
          />
          <Route
            path="/vehiclepurchasemuhurat"
            element={<Vehiclepurchasemuhurat />}
          />
          <Route
            path="/propertypurchasemuhuratform"
            element={<Propertypurchasemuhuratform />}
          />
          <Route path="/pujanmuhurat" element={<Pujanmuhurat />} />
          <Route path="/chathistorypandits" element={<Chathistorypandits />} />
          <Route path="/chatshistoryuser" element={<Chatshistoryuser />} />
          <Route path="/productreview" element={<Productreview />} />

          <Route path="/e-commerce" element={<EcommerceNew2 />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
