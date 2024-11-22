import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!input.trim()) {
      setErrorMessage("No keywords entered. Please enter something to search.");
    } else {
      setErrorMessage("");
      navigate(`/campaigns?search=${input}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Empowering Your <span>Brand</span> with Local Talent
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder="Search for campaigns, categories, or creators…"
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="popular">
            <button>
              Use our search tool to find the perfect match to enhance your
              brand’s presence and reach.
            </button>
          </div>
        </div>
        <div className="right">
          <img src="./img/influencer.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
