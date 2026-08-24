import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../Axios/api";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import Swal from "sweetalert2";
import NewLoader from "../NewLoader/NewLoader";
import "./TempleDetail.css";

const TempleDetail = () => {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user1 } = useAuthStore();

  // Resolve temple ID from params or route location state or URL path
  const pathId = location.pathname.split("/").filter(Boolean).pop();
  const templeId = paramId || location.state?.id || location.state?.templeId || pathId || "1";

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTempleDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/temple/gettemple/${templeId}`);
        if (response?.data?.data) {
          const data = response.data.data;
          setTemple(data);
          
          // Parse gallery images to find initial active image
          let initialImgs = [];
          if (Array.isArray(data.gallery_images)) {
            initialImgs = data.gallery_images;
          } else if (typeof data.gallery_images === "string") {
            try {
              const parsed = JSON.parse(data.gallery_images);
              if (Array.isArray(parsed)) initialImgs = parsed;
              else initialImgs = data.gallery_images.split(",").map((s) => s.trim()).filter(Boolean);
            } catch {
              initialImgs = data.gallery_images.split(",").map((s) => s.trim()).filter(Boolean);
            }
          }

          setActiveImage(data.image || (initialImgs.length > 0 ? initialImgs[0] : null));
        }
      } catch (error) {
        console.error("Error fetching temple details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (templeId) {
      fetchTempleDetail();
    }
  }, [templeId]);

  const handleBookNow = () => {
    if (!user1) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to book a temple pooja / VIP darshan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ea580c",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate("/booknowform", {
        state: {
          templeId: temple?.id || templeId,
          price: temple?.price || 501,
        },
      });
    }
  };

  // Safe parsing of gallery images
  const galleryList = useMemo(() => {
    if (!temple) return [];
    let list = [];
    if (Array.isArray(temple.gallery_images)) {
      list = temple.gallery_images;
    } else if (typeof temple.gallery_images === "string") {
      try {
        const parsed = JSON.parse(temple.gallery_images);
        if (Array.isArray(parsed)) list = parsed;
        else list = temple.gallery_images.split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        list = temple.gallery_images.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    if (list.length === 0 && temple.image) {
      list = [temple.image];
    }
    return list;
  }, [temple]);

  if (loading) {
    return <NewLoader />;
  }

  if (!temple) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <h2>Temple Not Found</h2>
        <p>The requested temple details could not be found.</p>
        <Link to="/temple" className="primary_btn_pshm" style={{ display: "inline-block", marginTop: "20px" }}>
          View All Temples
        </Link>
      </div>
    );
  }

  // Format paragraphs
  const aboutParagraphs = (temple.about || temple.description || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // Format significance
  const significanceParagraphs = (temple.significance || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // Format rituals list
  const ritualsList = (temple.rituals || "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  // Format timings list
  const timingsList = (temple.timings || "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  // Format bottom chants
  const bottomChants = (temple.bottom_notes || "")
    .split("\n")
    .map((c) => c.trim())
    .filter(Boolean);

  const rawWa = (temple.whatsapp_number || temple.number || "7225016699").toString().replace(/\D/g, "");
  const whatsappNum = rawWa.length === 10 ? `91${rawWa}` : rawWa;
  const facebookUrl = temple.facebook_url || "https://www.facebook.com/profile.php?id=61565211141697";
  const mapUrl = temple.map_url || (temple.location ? `https://maps.google.com/?q=${encodeURIComponent(temple.name + " " + temple.location)}` : null);

  return (
    <>
      {/* Hero Header Section */}
      <div className="sub_header_pshm">
        <div className="overlay_pshm"></div>

        <div className="container">
          <div className="subheader_inner_pshm">
            <div className="subheader_text_pshm">
              <h1>{temple.name}</h1>
              {temple.subtitle && (
                <p style={{ color: "#ffedd5", fontSize: "22px", marginTop: "10px", fontWeight: "500" }}>
                  {temple.subtitle}
                </p>
              )}
            </div>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/temple">
                    Temples
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  {temple.name}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Temple Details Section */}
      <div className="pshm_section">
        <div className="container">
          <div className="row align-items-start">
            {/* Left Side: Main Photo + Interactive Multi-Image Gallery */}
            <div className="col-lg-5 col-md-12">
              <div className="image_card_pshm">
                <span className="tag_pshm">{temple.tag || "Divine Temple"}</span>

                <img
                  src={activeImage || temple.image}
                  alt={temple.name}
                  className="templeimg_pshm"
                />
              </div>

              {/* Gallery Thumbnails */}
              {galleryList.length > 1 && (
                <div className="image_gallery_pshm">
                  {galleryList.map((imgUrl, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`gallery_thumb_wrapper ${activeImage === imgUrl ? "active_thumb" : ""}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${temple.name} ${index + 1}`}
                        className="gallery_img_pshm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Actions, Content, Rituals, Timings, Location */}
            <div className="col-lg-7 col-md-12">
              <div className="temple_content_pshm">
                {/* Action Buttons */}
                <div className="button_group_pshm">
                  <Link className="primary_btn_pshm" to="/enquiryform">
                    Enquiry Now
                  </Link>

                  <a
                    className="primary_btn_pshm facebook"
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-facebook-f" />
                    Facebook
                  </a>

                  <a
                    className="primary_btn_pshm whatsapp"
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent("Namaste, I want to inquire about " + temple.name)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp" />
                    Whatsapp
                  </a>

                  <button className="primary_btn_pshm orange" onClick={handleBookNow}>
                    Book Now (₹{temple.price || 501})
                  </button>
                </div>

                {/* Title */}
                <h2 className="heading_pshm">
                  {temple.name}
                </h2>

                {/* About Paragraphs */}
                {aboutParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}

                {/* Special Poojas & Rituals Section */}
                {ritualsList.length > 0 && (
                  <div className="info_box_pshm">
                    <h3>विशेष पूजा एवं अनुष्ठान</h3>
                    <ul>
                      {ritualsList.map((ritual, idx) => (
                        <li key={idx}>{ritual}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Temple Significance & History */}
                {significanceParagraphs.length > 0 && (
                  <div className="info_box_pshm">
                    <h3>Temple Significance & History</h3>
                    {significanceParagraphs.map((para, idx) => (
                      <p key={idx} style={{ marginBottom: "10px" }}>{para}</p>
                    ))}
                  </div>
                )}

                {/* Temple Timings */}
                {timingsList.length > 0 && (
                  <div className="info_box_pshm">
                    <h3>Temple Timings</h3>
                    <ul>
                      {timingsList.map((time, idx) => (
                        <li key={idx}>{time}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Temple Location */}
                <div className="location_box_pshm">
                  <h3>Temple Location</h3>
                  <p style={{ margin: "0 0 10px 0", color: "#444", fontWeight: "500" }}>
                    📍 {temple.location || temple.description || "Holy Shrine"}
                  </p>
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Location on Google Maps →
                    </a>
                  )}
                </div>

                {/* Bottom Sacred Chants & Mantras */}
                {bottomChants.length > 0 && (
                  <div className="bottom_text_pshm">
                    {bottomChants.map((chant, idx) => (
                      <h4 key={idx}>{chant}</h4>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TempleDetail;
