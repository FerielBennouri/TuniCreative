import React from "react";
import "./TrustedBy.scss";
import facebook from "/img/brand-facebook.png";
import google from "/img/brand-google.png";
import netflix from "/img/brand-netflix.png";
import pandg from "/img/brand-pandg.png";
import paypal from "/img/brand-paypal.png";
const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>TrustedBy</span>
        <img src={facebook} alt="Facebook Logo" />
        <img src={google} alt="Google Logo" />
        <img src={netflix} alt="Netflix Logo" />
        <img src={pandg} alt="P and G Logo" />
        <img src={paypal} alt="Paypal Logo" />
      </div>
    </div>
  );
};
export default TrustedBy;
