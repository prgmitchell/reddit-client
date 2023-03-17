import React from "react";
import "./NavBar.css";

const NavBar = ({
  search,
  handleSearchChange,
  handleSearchSubmit,
  sortOption,
  handleSortChange,
}) => {
  return (
    <div className="nav-bar">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Enter subreddit name"
        />
        <button type="submit">Search</button>
      </form>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="dropdown"
      >
        <option value="hot">Hot</option>
        <option value="new">New</option>
        <option value="rising">Rising</option>
        <option value="top">Top</option>
        <option value="controversial">Controversial</option>
      </select>
    </div>
  );
};

export default NavBar;
