import React, { useState, useEffect } from "react";
import "../../styles/blogs.css";
import { Link, useParams } from "react-router-dom";
import useHomeStore from "../../Store/dataStore/homeStore";
import {
  FaComment,
  FaCalendarAlt,
  FaUserEdit,
  FaArrowLeft,
  FaArrowRight,
  FaPrayingHands,
  FaBookOpen,
} from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NewLoader from "../NewLoader/NewLoader";
import moment from "moment";

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    className="detail-slider-arrow prev"
    onClick={onClick}
    aria-label="Previous"
  >
    <FaArrowLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className="detail-slider-arrow next"
    onClick={onClick}
    aria-label="Next"
  >
    <FaArrowRight />
  </button>
);

function Blogs() {
  const {
    isLoading,
    getRecomendetionBlogs,
    likeBlog,
    Postcomment,
    getComment,
    error,
    getTinyBlogById,
  } = useHomeStore();
  const { id, title } = useParams();
  const [blog, setBlog] = useState({});
  const [reletedBlog, setReletedBlog] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommnetCount] = useState(0);
  const [getComments, setGetComments] = useState([]);
  const { user1 } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const commentsArray = Array.isArray(getComments) ? getComments : [];
  const displayedComments = showAll ? commentsArray : commentsArray.slice(0, 3);
  const [expandedComments, setExpandedComments] = useState({});
  const maxLength = 100;
  const [blogError, setBlogError] = useState(false);

  const decryptId = (encryptedIdFromUrl) => {
    if (!encryptedIdFromUrl) return "";
    try {
      const decodedId = decodeURIComponent(encryptedIdFromUrl);
      const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedIdFromUrl;
    } catch (e) {
      return encryptedIdFromUrl || "";
    }
  };

  const toggleReadMore = (index) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleCommentSubmit = async (id) => {
    const finalName = name || user1?.name || "";
    const finalEmail = email || user1?.email || "";
    if (!finalName || !finalEmail || !comment) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields!",
        text: "Please fill in all fields before submitting your thought.",
      });
      return;
    }

    const payload = { name: finalName, email: finalEmail, comment };
    try {
      const response = await Postcomment(payload, decryptId(id));
      if (response?.data?.success) {
        setName("");
        setEmail("");
        setComment("");

        Swal.fire({
          icon: "success",
          title: "Comment Submitted!",
          text: "Your thought has been successfully added to this sacred blog.",
        });
        fetchCommnets();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response?.data?.message || "Something went wrong!",
        });
      }
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error || "An error occurred while submitting the comment.",
      });
    }
  };

  const fetchCommnets = async () => {
    if (id) {
      try {
        const response = await getComment(decryptId(id));
        const fetchedComments = response?.data?.data?.comments;
        setGetComments(Array.isArray(fetchedComments) ? fetchedComments : []);
        setCommnetCount(response?.data?.data?.total_comments || 0);
      } catch (err) {
        setGetComments([]);
      }
    }
  };

  useEffect(() => {
    fetchOneBlog();
    fetchRecomedtionBlog();
    fetchCommnets();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const fetchOneBlog = async () => {
    try {
      const decryptedId = decryptId(id);
      if (!decryptedId) return;
      const response = await getTinyBlogById(decryptedId);
      const raw = response?.data?.data ?? response?.data;
      const item = Array.isArray(raw) ? raw[0] : raw;
      if (item && (item.id || item.title || item.blog_title || item.name)) {
        setBlog(item);
        setLikeCount(item.like_count || item.likes || 0);
        setBlogError(false);
      } else {
        setBlogError(true);
      }
    } catch (error) {
      setBlogError(true);
    }
  };

  const fetchRecomedtionBlog = async () => {
    try {
      const normalTitle = (title || "").replace(/-/g, " ");
      const decryptedId = decryptId(id);
      if (!normalTitle && !decryptedId) return;
      const response = await getRecomendetionBlogs(normalTitle, decryptedId);
      if (response?.data?.success && Array.isArray(response?.data?.blogs)) {
        setReletedBlog(response.data.blogs);
      }
    } catch (err) {
      console.warn("Error fetching recommendations:", err);
    }
  };

  const handlelike = async (id) => {
    const decryptedId = decryptId(id);
    if (!decryptedId) return;
    const response = await likeBlog(decryptedId);
    if (response?.data?.success) {
      setLikeCount((prev) => prev + 1);
    }
  };

  const encryptId = (blogId) => {
    const encrypted = CryptoJS.AES.encrypt(
      (blogId || "").toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  if (isLoading) {
    return (
      <div>
        <NewLoader />
      </div>
    );
  }

  const sliderSettings = {
    dots: false,
    infinite: Array.isArray(reletedBlog) && reletedBlog.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="blog-detail-page-wrapper">
      {/* 🌟 Top Navigation Bar */}
      <div className="detail-breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/blogs">Blogs</Link>
            <span className="sep">/</span>
            <span className="current-crumb">
              {blog?.title || "Article Detail"}
            </span>
          </div>
        </div>
      </div>

      {blogError ? (
        <div className="container py-5 text-center">
          <div className="blog-not-found-card">
            <h2>Blog Article Not Found</h2>
            <p>The requested article could not be loaded or does not exist.</p>
            <Link to="/blogs" className="back-to-blogs-btn">
              <FaArrowLeft /> Back to All Blogs
            </Link>
          </div>
        </div>
      ) : (
        <div className="detail-main-content">
          <div className="container">
            <div className="row g-4">
              {/* 📰 Main Article Column (Left 8 cols) */}
              <div className="col-lg-8">
                <article className="main-article-card">
                  {/* Category & Title */}
                  <div className="article-header-area">
                    <span className="article-category-badge">
                      <FaPrayingHands /> Vedic Wisdom
                    </span>
                    <h1 className="article-main-heading">
                      {blog?.title || "Sacred Article"}
                    </h1>

                    {/* Meta Row */}
                    <div className="article-meta-bar">
                      <div className="meta-left">
                        <span className="meta-author">
                          <FaUserEdit className="meta-ic" /> Prabhu Pooja
                          Editorial
                        </span>
                        <span className="meta-date">
                          <FaCalendarAlt className="meta-ic" />{" "}
                          {moment(blog?.timestamp).format("MMMM DD, YYYY")}
                        </span>
                      </div>
                      <div className="meta-right">
                        <span className="meta-likes">
                          <GoHeartFill className="heart-ic" /> {likeCount} Likes
                        </span>
                        <span className="meta-comments">
                          <FaComment className="comment-ic" /> {commentCount}{" "}
                          Thoughts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Featured Hero Image */}
                  {blog?.image && (
                    <div className="article-hero-image-wrap">
                      <img
                        src={blog.image}
                        alt={blog.title || "Blog Image"}
                        className="article-hero-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>
                  )}

                  {/* Article HTML Content */}
                  <div
                    className="article-prose-body"
                    dangerouslySetInnerHTML={{ __html: blog.pera || "" }}
                  />

                  {/* Engagement / Like Button */}
                  <div className="article-engagement-card">
                    <div className="engagement-info">
                      <h3>Did you find this wisdom inspiring?</h3>
                      <p>
                        Show your support for authentic Vedic & spiritual
                        knowledge.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="devotee-like-btn"
                      onClick={() => handlelike(id)}
                    >
                      <GoHeartFill className="like-pulse-icon" />
                      <span>Like Article ({likeCount})</span>
                    </button>
                  </div>

                  {/* 💬 Devotee Discussion & Comments Section */}
                  <section className="article-comments-section">
                    <div className="comments-header">
                      <h3>
                        Devotee Reflections & Thoughts ({commentsArray.length})
                      </h3>
                      <p>
                        Share your spiritual perspective and join the discussion.
                      </p>
                    </div>

                    {/* Reply Form */}
                    <div className="leave-reply-card">
                      <h4>Leave a Sacred Reflection</h4>
                      <p className="form-subtext">
                        Your email will remain private. Required fields are
                        marked *
                      </p>

                      <div className="reply-form-group">
                        <textarea
                          placeholder="Share your spiritual thoughts or questions..."
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="modern-comment-textarea"
                          required
                        />
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="input-label">Devotee Name *</label>
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={name || user1?.name || ""}
                            onChange={(e) => setName(e.target.value)}
                            className="modern-comment-input"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="input-label">Email Address *</label>
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={email || user1?.email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                            className="modern-comment-input"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="post-reflection-btn"
                        onClick={() => handleCommentSubmit(id)}
                      >
                        {isLoading ? "Submitting Thought..." : "Post Thought"}
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="devotee-comments-list">
                      {commentsArray.length > 0 ? (
                        displayedComments.map((c, index) => {
                          const commenterName = c?.name || "Devotee";
                          const initial = commenterName
                            .charAt(0)
                            .toUpperCase();
                          const commentText = c?.comment || "";
                          const isLong = commentText.length > maxLength;
                          const isExpanded = expandedComments[index];

                          return (
                            <div key={index} className="single-devotee-comment">
                              <div className="devotee-avatar">{initial}</div>
                              <div className="comment-bubble">
                                <div className="commenter-meta">
                                  <span className="commenter-name">
                                    {commenterName}
                                  </span>
                                  <span className="comment-badge">Devotee</span>
                                </div>
                                <p className="comment-message">
                                  {isExpanded || !isLong
                                    ? commentText
                                    : `${commentText.slice(0, maxLength)}...`}
                                </p>
                                {isLong && (
                                  <button
                                    type="button"
                                    onClick={() => toggleReadMore(index)}
                                    className="comment-readmore-toggle"
                                  >
                                    {isExpanded ? (
                                      <>
                                        Show Less <IoIosArrowUp />
                                      </>
                                    ) : (
                                      <>
                                        Read More <IoIosArrowDown />
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-comments-prompt">
                          <FaComment className="no-comm-ic" />
                          <p>
                            Be the first devotee to share a thought on this
                            article!
                          </p>
                        </div>
                      )}

                      {commentsArray.length > 3 && (
                        <button
                          type="button"
                          className="view-all-comments-toggle-btn"
                          onClick={() => setShowAll(!showAll)}
                        >
                          {showAll ? (
                            <>
                              Show Fewer Comments <IoIosArrowUp />
                            </>
                          ) : (
                            <>
                              View All ({commentsArray.length}) Comments{" "}
                              <IoIosArrowDown />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </section>
                </article>
              </div>

              {/* 📑 Recommended Articles Sidebar (Right 4 cols) */}
              <div className="col-lg-4">
                <aside className="sticky-recommended-sidebar">
                  <div className="sidebar-card">
                    <div className="sidebar-card-header">
                      <FaBookOpen className="sidebar-header-ic" />
                      <h3>Trending Reads</h3>
                    </div>

                    <div className="recommended-items-list">
                      {Array.isArray(reletedBlog) && reletedBlog.length > 0 ? (
                        reletedBlog.map((article, idx) => {
                          const encryptedId = encryptId(article?.id || "");
                          const safeTitle =
                            article?.title || "Spiritual Article";
                          const safeSlug = safeTitle.replace(/\s+/g, "-");
                          const safeExcerpt = article?.pera
                            ? article.pera
                                .replace(/<img[^>]*>/g, "")
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .split(" ")
                                .slice(0, 10)
                                .join(" ") + "..."
                            : "";

                          return (
                            <Link
                              key={idx}
                              to={`/blog/${safeSlug}/${encryptedId}`}
                              className="recommended-mini-card"
                            >
                              <div className="mini-thumb-wrap">
                                <img
                                  src={
                                    article?.image ||
                                    "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=200&q=80"
                                  }
                                  alt={safeTitle}
                                  className="mini-thumb-img"
                                  loading="lazy"
                                />
                              </div>
                              <div className="mini-card-content">
                                <span className="mini-cat-label">
                                  Vedic Insight
                                </span>
                                <h4 className="mini-card-title">{safeTitle}</h4>
                                <span className="mini-read-cta">
                                  Read Article &rarr;
                                </span>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="no-recommendations-text">
                          No additional recommendations at this time.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sacred Promo Card */}
                  <div className="sacred-store-banner">
                    <span className="banner-tag">Pooja Store</span>
                    <h4>Energized Vedic Idols & Gemstones</h4>
                    <p>
                      Explore 100% authentic temple-sanctified spiritual items.
                    </p>
                    <Link to="/e-commerce" className="banner-shop-btn">
                      Visit Pooja Store &rarr;
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* 🌟 Bottom Related Blogs Carousel */}
          {Array.isArray(reletedBlog) && reletedBlog.length > 0 && (
            <section className="detail-related-blogs-section">
              <div className="container">
                <div className="related-section-header">
                  <h2>Related Sacred Articles</h2>
                  <p>
                    Deepen your spiritual journey with these curated
                    recommendations
                  </p>
                </div>

                <div className="related-slider-container">
                  <Slider {...sliderSettings}>
                    {reletedBlog.map((article, index) => {
                      const encryptedId = encryptId(article?.id || "");
                      const safeTitle =
                        article?.title || "Spiritual Article";
                      const safeSlug = safeTitle.replace(/\s+/g, "-");
                      const safeExcerpt = article?.pera
                        ? article.pera
                            .replace(/<img[^>]*>/g, "")
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .split(" ")
                            .slice(0, 16)
                            .join(" ") + "..."
                        : "";

                      return (
                        <div key={index} className="related-slide-item">
                          <div className="related-blog-card">
                            <Link
                              to={`/blog/${safeSlug}/${encryptedId}`}
                              className="related-card-img-wrap"
                            >
                              <img
                                src={
                                  article?.image ||
                                  "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=500&q=80"
                                }
                                alt={safeTitle}
                                className="related-card-img"
                              />
                            </Link>

                            <div className="related-card-body">
                              <span className="related-card-badge">
                                Vedic Insights
                              </span>
                              <h3 className="related-card-title">
                                <Link to={`/blog/${safeSlug}/${encryptedId}`}>
                                  {safeTitle}
                                </Link>
                              </h3>
                              <p className="related-card-excerpt">
                                {safeExcerpt}
                              </p>
                              <Link
                                to={`/blog/${safeSlug}/${encryptedId}`}
                                className="related-read-btn"
                              >
                                Read Article &rarr;
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Blogs;
