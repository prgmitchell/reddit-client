import React, { useState } from "react";
import "./RedditPost.css";

const RedditPost = ({
  title,
  author,
  url,
  selftext,
  onclick,
  post,
  created_utc,
}) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const postExcerpt = selftext.slice(0, 100) + (selftext ? "..." : "");
  const thumbnail = post.data.thumbnail;

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  const isImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  const timeSincePosted = () => {
    const now = new Date();
    const createdDate = new Date(created_utc * 1000);
    const seconds = Math.floor((now - createdDate) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  return (
    <div className="reddit-post">
      <h3 onClick={() => onclick(post)} style={{ cursor: "pointer" }}>
        {title}
      </h3>
      <p>
        by {author} {timeSincePosted()}
      </p>
      <p className="post-postExcerpt">{postExcerpt}</p>
      <p className="post-time"></p>
      {isImageUrl(url) && (
        <img
          src={url}
          alt="Post Thumbnail"
          className={`post-thumbnail ${thumbnailLoaded ? "visible" : "hidden"}`}
          onLoad={handleThumbnailLoad}
        />
      )}
    </div>
  );
};

export default RedditPost;
