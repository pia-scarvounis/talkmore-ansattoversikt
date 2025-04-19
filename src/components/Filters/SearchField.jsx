import React, { useState } from "react";
import "../../styles/SearchField.css";
import searchIcon from "../../assets/icons/search.svg";

const SearchField = ({
  onSearch,
  placeholder = "Søk etter fornavn, epost, stilling, mail, permisjon",
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="search-container">
      <img src={searchIcon} alt="Search icon" className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
      />
      {searchValue && (
        <button className="clear-button" onClick={clearSearch}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchField;
