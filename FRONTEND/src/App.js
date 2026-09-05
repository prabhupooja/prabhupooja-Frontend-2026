import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import ScrollToTop from "./Components/scrolltotop";
import CustomCursor from "./Components/NewHome/CustomCursor";
import NewLoader from "./Components/NewLoader/NewLoader";
import useAuthStore from "./Store/UserStore/userAuthStore";
import NetworkError from "./Components/NetworkError/NetworkError";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";

// ⚡ Lazy Loaded Pages & Components (Code Splitting for Fast Loading)
const NewHome = lazy(() => import("./Components/NewHome/NewHome"));
const About = lazy(() => import("./Components/about/about"));
const Onlinepuja = lazy(() => import("./Components/onlinepuja/onlinepuja"));
const Bookpoojaform = lazy(() => import("./Components/onlinepuja/bookpoojaform"));
const FeedbackForm = lazy(() => import("./Components/onlinepuja/feedbackform"));
const PoojaDetailMasterPage = lazy(() => import("./Components/poojapage/PoojaDetailMasterPage"));

const Temple = lazy(() => import("./Components/temple/temple"));
const TempleDetail = lazy(() => import("./Components/temple/TempleDetail"));
const Booknowform = lazy(() => import("./Components/temple/booknowform"));

const Prasaddelivery = lazy(() => import("./Components/prasaddelivery/prasaddelivery"));
const Khajranaprasad = lazy(() => import("./Components/khajranaprasadonline/khajranaprasad"));
const Ujjainprasad = lazy(() => import("./Components/ujjainprasadonline/ujjainprasad"));
const Prasadcheckout = lazy(() => import("./Components/prasaddelivery/prasadcheckout"));

const Astrology = lazy(() => import("./Components/astrology/astrology"));
const Astrologyprofile = lazy(() => import("./Components/astrology/astrologyprofile"));
const Astrologyform = lazy(() => import("./Components/astrology/astrologyform"));
const Recharge = lazy(() => import("./Components/astrology/recharge"));
const Chat = lazy(() => import("./Components/astrology/chat"));
const VideoCall = lazy(() => import("./Components/astrology/videoCall"));
const Chathistorypandits = lazy(() => import("./Components/astrology/chathistorypandits"));
const Chatshistoryuser = lazy(() => import("./Components/astrology/chatshistoryuser"));

const Pandit = lazy(() => import("./Components/pandit/pandit"));
const PanditForm = lazy(() => import("./Components/form/pandit_form"));
const Panditprofile = lazy(() => import("./Components/pandit/panditprofile"));
const Enquiryform = lazy(() => import("./Components/pandit/enquiryform"));
const Registrationsuccess = lazy(() => import("./Components/form/registrationsuccess"));
const Rejectedpage = lazy(() => import("./Components/form/rejectedpage"));

const Yoga = lazy(() => import("./Components/yoga/yoga"));
const Membership = lazy(() => import("./Components/membership/membership"));
const Buymembership = lazy(() => import("./Components/membership/buymembership"));
const UpdateDetailsUser = lazy(() => import("./Components/membership/updatedetailsuser"));

const Muhurat = lazy(() => import("./Components/muhurat/muhurat"));
const Panditprofilemuhurat = lazy(() => import("./Components/muhurat/panditprofilemuhurat"));
const Panditaboutprofile = lazy(() => import("./Components/muhurat/panditaboutprofile"));
const Vivahmuhuratform = lazy(() => import("./Components/muhurat/vivahmuhuratform"));
const Grihaparaveshmuhuratform = lazy(() => import("./Components/muhurat/grihaparaveshmuhuratform"));
const Vehiclepurchasemuhurat = lazy(() => import("./Components/muhurat/vehiclepurchasemuhurat"));
const Propertypurchasemuhuratform = lazy(() => import("./Components/muhurat/propertypurchasemuhuratform"));
const Pujanmuhurat = lazy(() => import("./Components/muhurat/pujanmuhurat"));

const EcommerceNew2 = lazy(() => import("./Components/ecomerce/ecommerceNew2"));
const Productdetails = lazy(() => import("./Components/ecomerce/productdetails"));
const BuyNowForm = lazy(() => import("./Components/ecomerce/buynowform"));
const Cart = lazy(() => import("./Components/cart"));
const Checkout = lazy(() => import("./Components/checkout/checkout"));

const Ecomerceookingpage = lazy(() => import("./Components/ecommercebookingpage/bookingpage"));
const Prasadbookingpage = lazy(() => import("./Components/prasadbookingpage/prasadbookingpage"));
const Templebookingpage = lazy(() => import("./Components/templebooking/Templebookingpage"));
const Yogabookingpage = lazy(() => import("./Components/yogabooking/yogabookingpage"));
const Poojabooking = lazy(() => import("./Components/poojabooking/poojabooking"));
const Onlineboojabooking = lazy(() => import("./Components/poojabooking/onlineboojabooking"));
const Problempoojabooking = lazy(() => import("./Components/poojabooking/problempoojabooking"));
const BookProblemPooja = lazy(() => import("./Components/problem/bookproblempooja"));
const Bookingdetailspage = lazy(() => import("./Components/ecommercebookingpage/bookingdetailspage"));
const Productreview = lazy(() => import("./Components/ecommercebookingpage/productreview"));
const OrderTracking = lazy(() => import("./Components/OrderTracking/OrderTracking"));

const Blog = lazy(() => import("./Components/Blog/blog"));
const Blogs = lazy(() => import("./Components/Blog/blogs"));
const Pricing = lazy(() => import("./Components/pricing"));
const ProblemPooja = lazy(() => import("./Components/problem/problemPooja"));
const ProblemDetail = lazy(() => import("./Components/problem/problemDetail"));

const SupportHome = lazy(() => import("./Components/SupportForUser/SupportHome"));
const CustomerSupport = lazy(() => import("./Components/SupportForUser/CustomerSupport"));
const ViewSupportTicket = lazy(() => import("./Components/SupportForUser/ViewSupportTicket"));
const ViewSingleTicket = lazy(() => import("./Components/SupportForUser/ViewSingleTicket"));

const Privacypolicy = lazy(() => import("./Components/privacypolicy"));
const Termsandcondition = lazy(() => import("./Components/termsandcondition"));
const Refundpolicy = lazy(() => import("./Components/refundpolicy"));
const Shipingpolicy = lazy(() => import("./Components/shipingpolicy"));
const Disclaimler = lazy(() => import("./Components/disclaimler"));
const PaymentPolicy = lazy(() => import("./Components/payment"));
const Faq = lazy(() => import("./Components/faq"));
const Ourteam = lazy(() => import("./Components/ourteam"));
const Editprofile = lazy(() => import("./Components/editprofile"));
const Testimonial = lazy(() => import("./Components/testimonial"));

const PastEventsPage = lazy(() => import("./Components/UpCommingEvents/PastEventsPage"));
const PastEventDetailPage = lazy(() => import("./Components/UpCommingEvents/PastEventDetailPage"));
const LatestEventsPage = lazy(() => import("./Components/UpCommingEvents/LatestEventsPage"));
const LatestEventDetailPage = lazy(() => import("./Components/UpCommingEvents/LatestEventDetailPage"));

const NotFound = lazy(() => import("./Components/NotFoundPage"));

function App() {
  const { setIsLoggin, userGet } = useAuthStore();
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
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
      if (error?.message === "Network Error") {
        setHasNetworkError(true);
      }
      console.warn("User data fetch notice:", error?.message || error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsLoggin]);

  if (hasNetworkError) {
    return <NetworkError />;
  }

  return (
    <div>
      {loading && <NewLoader />}

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

        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<NewLoader />}>
            <Routes>
            <Route path="/" element={<NewHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/onlinepooja" element={<Onlinepuja />} />
            <Route path="/online-pooja" element={<Onlinepuja />} />
            <Route path="/bookpoojaform" element={<Bookpoojaform />} />
            <Route path="/feedbackform" element={<FeedbackForm />} />
            
            {/* Master Online Pooja Detail Dynamic Routes */}
            <Route path="/online-pooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/onlinepooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/pooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/pooja/:slug/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/poojadetail/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/pooja-detail/:id" element={<PoojaDetailMasterPage />} />

            {/* Legacy Pooja Routes mapped to Master Template for backward compatibility */}
            <Route path="/kaalsarppooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/rahuketupooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/pitradoshpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/navgrahpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/mangaldoshpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/satyanarayankatha/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/sundarkandpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/rudraabhishekpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/vastushantipooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/rinmuktipooja/:id" element={<PoojaDetailMasterPage />} />
            <Route path="/sidhivinayakpooja/:id" element={<PoojaDetailMasterPage />} />
            <Route
              path="/mahamrityunjayajaap/:id"
              element={<PoojaDetailMasterPage />}
            />
            <Route
              path="/mahamrityunjayjaap/:id"
              element={<PoojaDetailMasterPage />}
            />
            <Route
              path="/:poojaSlug/:id"
              element={<PoojaDetailMasterPage />}
            />
            
            {/* Universal Dynamic Temple Routes */}
            <Route path="/temple" element={<Temple />} />
            <Route path="/booknowform" element={<Booknowform />} />
            <Route path="/temple/:id" element={<TempleDetail />} />
            <Route path="/temple/1" element={<TempleDetail />} />
            <Route path="/temple/2" element={<TempleDetail />} />
            <Route path="/temple/3" element={<TempleDetail />} />
            <Route path="/khajranatemple" element={<TempleDetail />} />
            <Route path="/ujjaintemple" element={<TempleDetail />} />
            <Route path="/panchmukhishanihanumanmandir" element={<TempleDetail />} />

            <Route path="/prasaddelivery" element={<Prasaddelivery />} />
            <Route path="/prasad/:id" element={<Khajranaprasad />} />
            <Route path="/prasad/1" element={<Khajranaprasad />} />
            <Route path="/prasad/2" element={<Ujjainprasad />} />
            <Route path="/astrology" element={<Astrology />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/astrologyform" element={<Astrologyform />} />
            <Route path="/astrologyprofile" element={<Astrologyprofile />} />
            <Route
              path="/astrologyprofileman"
              element={<Astrologyprofile />}
            />
            <Route path="/astrologyprofile/:id" element={<Astrologyprofile />} />
            <Route path="/panditform" element={<PanditForm />} />
            <Route path="/checkout" element={<Checkout />} />
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

            <Route
              path="/panditaboutprofile/:id"
              element={<Panditaboutprofile />}
            />
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
            <Route path="/ecommerce" element={<EcommerceNew2 />} />
            <Route path="/shop" element={<EcommerceNew2 />} />
            <Route path="/pooja-samagri" element={<EcommerceNew2 />} />
            <Route path="/contact" element={<Enquiryform />} />
            <Route path="/contactus" element={<Enquiryform />} />

            <Route path="/past-events" element={<PastEventsPage />} />
            <Route path="/past-events/:id" element={<PastEventDetailPage />} />
            <Route path="/latest-events" element={<LatestEventsPage />} />
            <Route path="/latest-events/:id" element={<LatestEventDetailPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
