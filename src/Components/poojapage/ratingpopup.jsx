import StarRatings from "react-star-ratings";
import usePujaStore from "../../Store/PoojaStore/PoojaStore";

const RatingsPopup = ({ id, onClose }) => {
  const { feedbackData } = usePujaStore();

  // console.log(feedbackData.length);

  // useEffect(() => {
  //   fetchComments();
  // }, [id]);

  // const fetchComments = async () => {
  //   try {
  //     const problem_name='normal';
  //     const response = await api.get(`/feedback/rating/${id}/${problem_name}`);
  //     console.log(response.data.data.feedbacks);
  //     if (response.data.success) {
  //       setComments(response.data.data.feedbacks || []);
  //     } else {
  //       console.error("Failed to fetch comments");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   }
  // };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Ratings & Comments</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="ratings-comments-section">
          {feedbackData.length > 0 ? (
            feedbackData.map((comment, index) => {
              const rating = Number(comment.rating);
              return (
                <div key={index} className="comment-box">
                  <p>
                    <strong>{comment.name}:</strong> {comment.comment}
                  </p>
                  <StarRatings
                    rating={isNaN(rating) ? 0 : rating}
                    starRatedColor="gold"
                    starDimension="15px"
                    starSpacing="2px"
                    numberOfStars={5}
                  />
                </div>
              );
            })
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingsPopup;
