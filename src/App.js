import React, { useState, useEffect } from "react";
import axios from "axios";
import RedditPost from "./Components/RedditPost";
import Sidebar from "./Components/Sidebar";
import NavBar from "./Components/NavBar";
import PostDetail from "./Components/PostDetail";
import PopularSubreddits from "./Components/PopularSubreddits";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("hot");
  const [subreddit, setSubreddit] = useState("100gecs");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [after, setAfter] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [favoriteSubreddits, setFavoriteSubreddits] = useState(
    JSON.parse(localStorage.getItem("favoriteSubreddits")) || []
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/${sortOption}.json?limit=10${
          after ? `&after=${after}` : ""
        }`
      );
      setPosts(response.data.data.children);
      setAfter(response.data.data.after);
    };

    fetchPosts();
  }, [subreddit, sortOption, page]);

  useEffect(() => {
    const fetchPostsOnSubredditChange = async () => {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/${sortOption}.json?limit=10`
      );
      setPosts(response.data.data.children);
      setAfter(response.data.data.after);
    };

    fetchPostsOnSubredditChange();
  }, [subreddit, sortOption]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost, subreddit, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubreddit(search);
    setSearch("");
    setPage(1);
    setSelectedPost(null);
  };

  const handleGoBack = () => {
    setSelectedPost(null);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePageClick = (pageNumber) => {
    const newIndex = (pageNumber - 1) * 10;
    if (newIndex > 0 && newIndex < posts.length) {
      setAfter(posts[newIndex - 1].data.name);
    } else if (newIndex === 0) {
      setAfter(null);
    }
    setPage(pageNumber);
  };

  const handleAddFavoriteSubreddit = () => {
    if (!favoriteSubreddits.includes(subreddit)) {
      const updatedFavorites = [...favoriteSubreddits, subreddit];
      setFavoriteSubreddits(updatedFavorites);
      localStorage.setItem(
        "favoriteSubreddits",
        JSON.stringify(updatedFavorites)
      );
    }
  };

  const handleRemoveFavoriteSubreddit = (index) => {
    const updatedFavorites = favoriteSubreddits.filter((_, i) => i !== index);
    setFavoriteSubreddits(updatedFavorites);
    localStorage.setItem(
      "favoriteSubreddits",
      JSON.stringify(updatedFavorites)
    );
  };

  const handleFavoriteClick = (favoriteSubreddit) => {
    setSubreddit(favoriteSubreddit);
    setPage(1);
    setSelectedPost(null);
  };

  const renderView = () => {
    if (selectedPost) {
      return (
        <>
          <NavBar
            search={search}
            handleSearchChange={handleSearchChange}
            handleSearchSubmit={handleSearchSubmit}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
          />
          <div className="content">
            <div className="sidebar-wrapper">
              <Sidebar
                favorites={favoriteSubreddits}
                onFavoriteClick={handleFavoriteClick}
                subreddit={subreddit}
                handleAddFavoriteSubreddit={handleAddFavoriteSubreddit}
                handleRemoveFavoriteSubreddit={handleRemoveFavoriteSubreddit}
              />
              <PopularSubreddits onSubredditClick={handleFavoriteClick} />
            </div>
            <div className="posts">
              <PostDetail post={selectedPost} onGoBack={handleGoBack} />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <NavBar
          search={search}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />
        <div className="content">
          <div className="sidebar-wrapper">
            <div className="sidebar-section">
              <Sidebar
                favorites={favoriteSubreddits}
                onFavoriteClick={handleFavoriteClick}
                subreddit={subreddit}
                handleAddFavoriteSubreddit={handleAddFavoriteSubreddit}
                handleRemoveFavoriteSubreddit={handleRemoveFavoriteSubreddit}
              />
              <PopularSubreddits onSubredditClick={handleFavoriteClick} />
            </div>
          </div>
          <div className="posts">
            {posts.map((post) => (
              <RedditPost
                key={post.data.id}
                title={post.data.title}
                author={post.data.author}
                url={post.data.url}
                onclick={handlePostClick}
                selftext={post.data.selftext}
                post={post}
                created_utc={post.data.created_utc}
              />
            ))}
          </div>
        </div>
        <div className="pagnums">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`page-number ${pageNumber === page ? "selected" : ""}`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </>
    );
  };

  return <div className="app">{renderView()}</div>;
};

export default App;
