import React, { useState, useEffect } from "react";
import "../../styles/blogs.css";
import { Link, useParams } from "react-router-dom";
import useHomeStore from "../../Store/dataStore/homeStore";
import { FaComment } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import useAuthStore from "../../Store/UserStore/userAuthStore";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TailSpin } from "react-loader-spinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NewLoader from "../NewLoader/NewLoader";

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow custom-prev" onClick={onClick}>
    <FaArrowLeft className="customeicon_left" />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow custom-next" onClick={onClick}>
    <FaArrowRight className="customeicon_right" />
  </div>
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
  const [getComments, setGetComments] = useState(0);
  const { user1 } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const commentsArray = Array.isArray(getComments) ? getComments : [];
  const displayedComments = showAll ? commentsArray : commentsArray.slice(0, 3);
  const [expandedComments, setExpandedComments] = useState({});
  const maxLength = 100;
  const [blogError, setBlogError] = useState(false);

  const decryptId = (encryptedIdFromUrl) => {
    const decodedId = decodeURIComponent(encryptedIdFromUrl);
    const bytes = CryptoJS.AES.decrypt(decodedId, "prabhupooja2024");
    return bytes.toString(CryptoJS.enc.Utf8);
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
        text: "Please fill in all fields before submitting.",
      });
      return;
    }

    const payload = { name: finalName, email: finalEmail, comment };
    try {
      const response = await Postcomment(payload, decryptId(id));
      if (response.data.success) {
        setName("");
        setEmail("");
        setComment("");

        Swal.fire({
          icon: "success",
          title: "Comment Submitted!",
          text: "Your comment has been successfully added.",
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
      const response = await getComment(decryptId(id));
      setGetComments(response?.data?.data?.comments);
      setCommnetCount(response?.data?.data?.total_comments);
    }
  };

  useEffect(() => {
    fetchOneBlog();
    fetchRecomedtionBlog();
    fetchCommnets();
  }, [id]);

  const fetchOneBlog = async () => {
    try {
      const decryptedId = decryptId(id);
      const response = await getTinyBlogById(decryptedId);
      if (response.data.success && response.data.data.length > 0) {
        setBlog(response.data.data[0]);
        setLikeCount(response.data.data[0]?.like_count || 0);
      } else {
        setBlogError(true);
      }
    } catch (error) {
      setBlogError(true);
    }
  };

  const fetchRecomedtionBlog = async () => {
    const normalTitle = title.replace(/-/g, " ");
    console.log(normalTitle, "title");
    const response = await getRecomendetionBlogs(normalTitle, decryptId(id));
    // console.log(response, "kjljklllllllllllll");
    if (response?.data?.success) {
      setReletedBlog(response.data.blogs);
    }
  };

  const handlelike = async (id) => {
    const response = await likeBlog(decryptId(id));
    // console.log(response.data);
    if (response.data.success) {
      fetchOneBlog();
    }
  };

  const encryptId = (blogId) => {
    const encrypted = CryptoJS.AES.encrypt(
      blogId?.toString(),
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

  const settings = {
    dots: false,
    infinite: true,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {blogError ? (
        <h2 style={{ textAlign: "center", margin: "20px 0" }}>
          No blog exists
        </h2>
      ) : (
        <>
          <div className="blogs_container">
            <div className="container">
              <div className="row">
                <div className="col-sm-8">
                  <h1 className="blog_main_title">{blog.title || ""}</h1>

                  <div className="blogimg-container">
                    {blog?.image && (
                      <div className="paragraph-item">
                        <img
                          src={blog?.image}
                          alt={`blogimg`}
                          className="blog_img"
                        />
                      </div>
                    )}
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: blog.pera }}></div>

                  <div className="article-comment-like">
                    <div className="comment-section">
                      <h2 className="comment_text">Leave a Reply</h2>
                      <p className="comment-submit">
                        Your email address will not be published!
                      </p>

                      <textarea
                        placeholder="Write a comment..."
                        rows="4"
                        cols="50"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="blog_comment_section"
                        required
                      />

                      <div className="comment-post-box">
                        <div className="comment-input-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={name || user1?.name}
                            onChange={(e) => setName(e.target.value)}
                            className="comment_input"
                            required
                          />
                        </div>

                        <div className="comment-input-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={email || user1?.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="comment_input"
                            required
                          />
                        </div>
                      </div>

                      <button
                        className="post_comment_btn"
                        onClick={() => handleCommentSubmit(id)}
                      >
                        {isLoading ? "Posting.." : "Post Comment"}
                      </button>
                    </div>

                    <div className="comment-like-section">
                      <div className="comment-like-header">
                        <div className="comment-header">
                          <h2 className="comment-text_main">
                            ({commentCount}) Comments{" "}
                            <FaComment className="icon" />
                          </h2>
                        </div>
                        <div
                          className="like-header"
                          onClick={() => handlelike(id)}
                        >
                          <h2 className="comment-text_main">
                            ({likeCount}) Likes{" "}
                            <GoHeartFill className="icon like-icon" />
                          </h2>
                        </div>
                      </div>

                      <div className="comment-list-container">
                        <h3 className="list-title">All Comments</h3>
                        <div className="comment-list">
                          {Array.isArray(getComments) &&
                          getComments?.length > 0 ? (
                            displayedComments?.map((comment, index) => (
                              <div key={index} className="single-comment">
                                <h4 className="commenter-name">
                                  {comment.name}
                                </h4>
                                <p className="comment-text">
                                  {expandedComments[index] ||
                                  comment?.comment?.length <= maxLength
                                    ? comment.comment
                                    : `${comment?.comment?.slice(
                                        0,
                                        maxLength
                                      )}...`}
                                </p>
                                {comment?.comment?.length > maxLength && (
                                  <button
                                    onClick={() => toggleReadMore(index)}
                                    className="read-more-btn"
                                  >
                                    {expandedComments[index] ? (
                                      <IoIosArrowUp className="upicon" />
                                    ) : (
                                      <IoIosArrowDown className="downicon" />
                                    )}
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="no-comments">No comments available</p>
                          )}
                          {getComments.length > 3 && (
                            <button
                              className="toggle-btn"
                              onClick={() => setShowAll(!showAll)}
                            >
                              {showAll ? (
                                <IoIosArrowUp className="upicon" />
                              ) : (
                                <IoIosArrowDown className="downicon" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="articles">
                    <h1>Recommended articles</h1>
                    {reletedBlog?.length > 0 ? (
                      reletedBlog?.map((article, index) => {
                        const encryptedId = encryptId(article.id);

                        const truncatedTitle =
                          article.title.split(" ").slice(0, 5).join(" ") +
                          (article.title.split(" ").length > 5 ? "..." : "");

                        const truncatedPera =
                          article.pera.split(" ").slice(0, 10).join(" ") +
                          (article.pera.split(" ").length > 10 ? "..." : "");

                        return (
                          <div key={index}>
                            <Link
                              to={`/blog/${truncatedTitle.replace(
                                /\s+/g,
                                "-"
                              )}/${encryptedId}`}
                              className="articles_box"
                            >
                              <div className="articles_img">
                                <img src={article.image} alt="blogimg" />
                              </div>
                              <div className="articles_content">
                                <h2>{truncatedTitle}</h2>{" "}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: truncatedPera,
                                  }}
                                ></div>
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <p>No blogs available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="related_blogs">
            <div className="container">
              <h1 className="related_blog_main_title">Related Blogs</h1>
              {reletedBlog?.length > 0 ? (
                <Slider {...settings}>
                  {reletedBlog.map((article, index) => {
                    const encryptedId = encryptId(article.id);
                    const truncatedTitle =
                      article.title.split(" ").slice(0, 5).join(" ") +
                      (article.title.split(" ").length > 5 ? "..." : "");

                    const truncatedPera =
                      article.pera.split(" ").slice(0, 20).join(" ") +
                      (article.pera.split(" ").length > 20 ? "..." : "");

                    return (
                      <div key={index}>
                        <Link
                          to={`/blog/${article.title.replace(
                            /\s+/g,
                            "-"
                          )}/${encryptedId}`}
                        >
                          <div className="blogs_box">
                            <img
                              src={article.image}
                              alt="blog_img"
                              className="related_blog_img"
                            />
                            <h2 className="related_blog_title">
                              {truncatedTitle}
                            </h2>
                            <div
                              className="related_blog_para"
                              dangerouslySetInnerHTML={{
                                __html: truncatedPera,
                              }}
                            ></div>
                            <button className="related_blog_btn">
                              Read More
                            </button>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <p>No blogs available</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Blogs;
