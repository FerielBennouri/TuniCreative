import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ item }) {
  return (
    <Link to={`/campaigns?cat=${item.cat}`}>
      <div className="catCard">
        <img src={item.img} alt="" />
        <span className="desc">{item.desc}</span>
        <span className="title">{item.title}</span>
      </div>
    </Link>
  );
}

export default CatCard;
