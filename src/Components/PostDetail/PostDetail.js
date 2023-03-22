import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PostDetail.css";
import ReactMarkdown from "react-markdown";

const PostDetail = ({ post, onGoBack }) => {
  const [comments, setComments] = useState([]);
  const [isImageFullSize, setIsImageFullSize] = useState(false);
  const { title, author, selftext, url, created_utc } = post.data;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(
        `https://www.reddit.com${post.data.permalink}.json`
      );
      const fetchedComments = response.data[1].data.children;
      setComments(fetchedComments.filter((comment) => comment.kind !== "more"));
      setIsLoading(false);
    };

    fetchComments();
  }, [post]);

  const isImagePost = /\.(jpg|jpeg|png|gif)$/i.test(url);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const toggleImageSize = () => {
    setIsImageFullSize(!isImageFullSize);
  };

  return (
    <div className="post-detail">
      <div className="headercombo">
        <div>
          <button onClick={onGoBack} className="back-arrow">
            &larr;
          </button>
          <h2>{title}</h2>
        </div>
        <div>
          <p>by {author}</p>
          <p>Posted on {formatTimestamp(created_utc)}</p>
        </div>
      </div>
      <div className="post-content">
        {selftext ? (
          <ReactMarkdown>{selftext}</ReactMarkdown>
        ) : isImagePost ? (
          <img
            src={url}
            alt={title}
            onClick={toggleImageSize}
            className={`post-image ${
              isImageFullSize ? "full-size" : "small-size"
            }`}
          />
        ) : (
          <p>This post does not have any text content.</p>
        )}
      </div>
      <div className="comments">
        <h3>Comments:</h3>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.data.id} className="comment">
                <p>
                  <strong>{comment.data.author}:</strong>{" "}
                  <ReactMarkdown>{comment.data.body}</ReactMarkdown>
                </p>
                <p className="comment-time">
                  Posted on {formatTimestamp(comment.data.created_utc)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
