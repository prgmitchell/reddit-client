import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PopularSubreddits.css";

const PopularSubreddits = ({ onSubredditClick }) => {
  const [popularSubreddits, setPopularSubreddits] = useState([]);

  useEffect(() => {
    const fetchPopularSubreddits = async () => {
      const response = await axios.get(
        "https://www.reddit.com/subreddits/popular.json?limit=10"
      );
      setPopularSubreddits(response.data.data.children);
    };

    fetchPopularSubreddits();
  }, []);

  return (
    <div className="popular-subreddits">
      <div className="popular-subreddits-container">
        <div className="popular-subreddits-header">
          <h2>Popular</h2>
        </div>
        {popularSubreddits.length === 0 ? (
          <p>Loading popular subreddits...</p>
        ) : (
          <ul>
            {popularSubreddits.map((subreddit, index) => (
              <li
                key={index}
                className="popular-subreddit"
                onClick={() => onSubredditClick(subreddit.data.display_name)}
              >
                r/{subreddit.data.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PopularSubreddits;
