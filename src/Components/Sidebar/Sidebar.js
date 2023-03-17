import React, { useState, useEffect } from "react";

import "./Sidebar.css";

const Sidebar = ({
  favorites,
  onFavoriteClick,
  subreddit,
  handleAddFavoriteSubreddit,
  handleRemoveFavoriteSubreddit,
}) => {
  const [subredditDetails, setSubredditDetails] = useState(null);

  useEffect(() => {
    const fetchSubredditDetails = async () => {
      try {
        const response = await fetch(
          `https://www.reddit.com/r/${subreddit}/about.json`
        );
        const data = await response.json();
        setSubredditDetails(data.data);
      } catch (error) {
        console.error("Error fetching subreddit details:", error);
      }
    };

    fetchSubredditDetails();
  }, [subreddit]);

  const subredditIcon =
    subredditDetails &&
    (subredditDetails.icon_img || subredditDetails.community_icon);

  return (
    <div className="sidebar">
      <div className="sidebar-reddit">
        <img
          src={subredditIcon}
          alt={`r/${subreddit} icon`}
          className="subreddit-icon"
        />
        <h1>r/{subreddit}</h1>
        <button onClick={handleAddFavoriteSubreddit}>+</button>
      </div>

      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2>Favorites</h2>
        </div>
        {favorites.length === 0 ? (
          <p>No favorite subreddits added yet.</p>
        ) : (
          <ul>
            {favorites.map((favorite, index) => (
              <li key={index} className="favorite-subreddit">
                <span onClick={() => onFavoriteClick(favorite)}>
                  r/{favorite}
                </span>
                <button
                  onClick={() => handleRemoveFavoriteSubreddit(index)}
                  className="remove-favorite-btn"
                >
                  -
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
