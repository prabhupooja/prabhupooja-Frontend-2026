import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Axios/api";
import "../../styles/blogpost.css";

function Blogposts() {
  const { title } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blog/getbyId/${title}`);
        // console.log("API Response:", response.data);
        if (response.data.success) {
          setBlog(response.data.blog);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [title]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error_blog">{error}</div>;
  }

  return (
    <div className="blogpost-container">
      {blog && (
        <div className="blogpost">
          <h1 className="blogpost-title">{blog.title}</h1>
          {blog.images && blog.images[0] && (
            <div className="blogpost-featured-image">
              <img
                src={blog.images[0]}
                alt="Featured Blog"
                className="featured-image"
              />
            </div>
          )}
          <p className="blogpost-description">{blog.description}</p>
          {[...Array(7)].map(
            (_, index) =>
              blog[`pera${index + 1}`] && (
                <div key={index} className="blogpost-content">
                  {blog[`pera${index + 1}`]
                    .split("\n")
                    .map((line, lineIndex) => (
                      <p key={lineIndex} className="blogpost-paragraph">
                        {line}
                      </p>
                    ))}
                  {blog.images && blog.images[index + 1] && (
                    <div className="blogpost-featured-image">
                      <img
                        src={blog.images[index + 1]}
                        alt="Blog"
                        className="featured-image"
                      />
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}

export default Blogposts;
