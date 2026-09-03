import React, { useEffect, useState } from "react";
import "../../styles/blog.css";
import { Link } from "react-router-dom";
import useHomeStore from "../../Store/dataStore/homeStore";
import moment from "moment";
import CryptoJS from "crypto-js";
import NewLoader from "../NewLoader/NewLoader";
import {
  FaCalendarAlt,
  FaUserEdit,
  FaArrowRight,
  FaPrayingHands,
  FaBookOpen,
} from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

function Blog() {
  const { gettinyblog, tinybloglist } = useHomeStore();
  const { isLoading } = useHomeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      await gettinyblog();
    } catch (err) {
      console.warn("Failed to fetch blogs:", err);
    }
  };

  const encryptId = (blogId) => {
    const encrypted = CryptoJS.AES.encrypt(
      (blogId || "").toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const blogsList = Array.isArray(tinybloglist) ? tinybloglist : [];
  const totalPages = Math.max(1, Math.ceil(blogsList.length / blogsPerPage));
  const paginatedBlogs = blogsList.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pages = [];
    let dotShown = false;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            className={`modern-page-btn ${i === currentPage ? "active" : ""}`}
            onClick={() => changePage(i)}
          >
            {i}
          </button>
        );
        dotShown = false;
      } else {
        if (!dotShown) {
          pages.push(
            <span key={`dots-${i}`} className="dots">
              ...
            </span>
          );
          dotShown = true;
        }
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div>
        <NewLoader />
      </div>
    );
  }

  return (
    <div className="blog-page-wrapper">
      {/* 🌟 Modern Hero Banner */}
      <div className="modern-blog-hero">
        <div className="container">
          <div className="blog-hero-content">
            <span className="blog-hero-badge">
              <FaPrayingHands /> Vedic Wisdom & Spiritual Insights
            </span>
            <h1 className="blog-hero-title">Spiritual & Vedic Blogs</h1>
            <p className="blog-hero-subtitle">
              Explore sacred rituals, astrology guidance, festivals, and Sanatan
              Dharma wisdom curated by experienced Vedic pandits and scholars.
            </p>
            <div className="blog-hero-breadcrumbs">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <span className="current">Spiritual Blogs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📖 Blog Catalog Section */}
      <div className="blog-catalog-container">
        <div className="container">
          {/* Header row with count and filter */}
          <div className="blog-catalog-header">
            <div className="catalog-count-wrap">
              <FaBookOpen className="catalog-icon" />
              <span>
                Showing <strong>{blogsList.length}</strong> Sacred Articles
              </span>
            </div>

            <div className="catalog-perpage-wrap">
              <label>Articles Per Page:</label>
              <select
                value={blogsPerPage}
                onChange={(e) => {
                  setBlogsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="perpage-select"
              >
                {[6, 9, 12, 18, 24].map((num) => (
                  <option key={num} value={num}>
                    {num} Articles
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🎴 Modern Blog Cards Grid */}
          <div className="modern-blog-grid">
            {paginatedBlogs && paginatedBlogs.length > 0 ? (
              paginatedBlogs.map((post) => {
                const firstImage =
                  post?.image ||
                  "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
                const encryptedId = encryptId(post?.id || "");
                const safeTitle = post?.title || "Untitled Sacred Blog";
                const safeSlug = (post?.title || "blog").replace(/\s+/g, "-");
                const safeExcerpt = post?.pera
                  ? post.pera
                      .replace(/<img[^>]*>/g, "")
                      .replace(/<\/?[^>]+(>|$)/g, "")
                      .split(" ")
                      .slice(0, 22)
                      .join(" ") + "..."
                  : "Discover Vedic knowledge, rituals, and divine spiritual insights...";

                return (
                  <article
                    className="modern-blog-card"
                    key={post?.id || Math.random()}
                  >
                    <Link
                      to={`/blog/${safeSlug}/${encryptedId}`}
                      className="blog-card-img-wrap"
                    >
                      <img
                        src={firstImage}
                        alt={safeTitle}
                        className="blog-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <span className="blog-card-tag">Vedic Wisdom</span>
                    </Link>

                    <div className="blog-card-body">
                      <div className="blog-card-meta-row">
                        <span className="meta-item">
                          <FaUserEdit className="meta-icon" /> Prabhu Pooja
                        </span>
                        <span className="meta-item">
                          <FaCalendarAlt className="meta-icon" />{" "}
                          {moment(post?.timestamp).format("MMM DD, YYYY")}
                        </span>
                      </div>

                      <h3 className="blog-card-title">
                        <Link
                          to={`/blog/${safeSlug}/${encryptedId}`}
                          title={safeTitle}
                        >
                          {safeTitle}
                        </Link>
                      </h3>

                      <p className="blog-card-excerpt">{safeExcerpt}</p>

                      <div className="blog-card-footer">
                        <Link
                          to={`/blog/${safeSlug}/${encryptedId}`}
                          className="modern-read-more-btn"
                        >
                          <span>Read Full Article</span>
                          <FaArrowRight className="btn-arrow" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="no-blogs-found-card">
                <FaBookOpen className="no-blog-icon" />
                <h3>No Sacred Blogs Available</h3>
                <p>New articles will be published shortly. Stay tuned!</p>
              </div>
            )}
          </div>

          {/* 📄 Pagination Controls */}
          {totalPages > 1 && (
            <div className="modern-pagination-row">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-nav-btn prev"
                aria-label="Previous Page"
              >
                <MdKeyboardArrowLeft />
              </button>

              <div className="page-numbers-wrap">{renderPageNumbers()}</div>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-nav-btn next"
                aria-label="Next Page"
              >
                <MdKeyboardArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
