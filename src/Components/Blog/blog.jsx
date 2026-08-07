import React, { useEffect, useState } from "react";
import "../../styles/blog.css";
import { Link } from "react-router-dom";
import useHomeStore from "../../Store/dataStore/homeStore";
import moment from "moment";
import CryptoJS from "crypto-js";
import NewLoader from "../NewLoader/NewLoader";
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
    await gettinyblog();
  };

  const encryptId = (blogId) => {
    const encrypted = CryptoJS.AES.encrypt(
      blogId.toString(),
      "prabhupooja2024"
    ).toString();
    return encodeURIComponent(encrypted);
  };

  const totalPages = Math.ceil(tinybloglist.length / blogsPerPage);
  const paginatedBlogs = tinybloglist.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
            className={`page-btn ${i === currentPage ? "active" : ""}`}
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
      <>
        <div>
          <NewLoader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sub_header_blog">
        <div className="container">
          <div className="subheader_inner_blog">
            <div className="subheader_text_blog">
              <h1>Spiritual - Blogs</h1>
            </div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="btn-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active">Blogs</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-layout">
          {paginatedBlogs && paginatedBlogs?.length > 0 ? (
            paginatedBlogs?.map((post) => {
              let firstImage = post.image;
              const encryptedId = encryptId(post.id);

              return (
                <div className="post-card" key={post.id}>
                  <Link
                    to={`/blog/${post.title.replace(
                      /\s+/g,
                      "-"
                    )}/${encryptedId}`}
                  >
                    <div
                      className="post-image"
                      style={{
                        backgroundImage: `url(${
                          firstImage || "default-image-url.jpg"
                        })`,
                      }}
                    ></div>
                  </Link>
                  <div className="post-content">
                    <h2 className="post-title">
                      {post.title || "Untitled Blog"}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          post.pera
                            .replace(/<img[^>]*>/g, "")
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .split(" ")
                            .slice(0, 25)
                            .join(" ") + " ...",
                      }}
                    ></div>

                    <div className="author_name_time">
                      <p>By: Prabhu Pooja</p>
                      <p className="blog_time">
                        {moment(post.timestamp).fromNow()}
                      </p>
                    </div>

                    <Link
                      to={`/blog/${post.title.replace(
                        /\s+/g,
                        "-"
                      )}/${encryptedId}`}
                      className="read-more1"
                    >
                      <span>Read More</span>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="post-card">No Blog Found</div>
          )}
        </div>
        <div className="pagination-controls">
          <div className="dropdown-container">
            Show Results:
            <select
              value={blogsPerPage}
              onChange={(e) => {
                setBlogsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="pagination_res"
            >
              {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="page-buttons">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn-left"
            >
              <MdKeyboardArrowLeft />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn-right"
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
