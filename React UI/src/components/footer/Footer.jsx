import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  const handleContactUsClick = (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("contact-form");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  const handleAboutUsClick = () => {
    navigate("/about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="footer">
      <div className="container">
      <hr className="navbar-line" />
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <Link className="link" to="/campaigns?cat=beauty-fashion">
              Beauty & Fashion
            </Link>
            <Link className="link" to="/campaigns?cat=travel-adventure">
              Travel & Adventure
            </Link>
            <Link className="link" to="/campaigns?cat=health-fitness">
              Health & Fitness
            </Link>
            <Link className="link" to="/campaigns?cat=tech-gadgets">
              Technology & Gadgets
            </Link>
            <Link className="link" to="/campaigns?cat=food-cooking">
              Food & Cooking
            </Link>
          </div>

          <div className="item">
            <h2>Support</h2>
            <span onClick={handleAboutUsClick} style={{ cursor: "pointer" }}>
              About Us
            </span>
            <span onClick={handleContactUsClick} style={{ cursor: "pointer" }}>
              Contact Us
            </span>
            <Link className="link" to="/about#faq">
              FAQ
            </Link>
            <Link className="link" to="/campaigns">
              All campaigns
            </Link>
          </div>
          <div className="item">
            <h2>Socials</h2>
            <a
              className="link"
              href="https://www.instagram.com/tunicreatives/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Instagram
            </a>
            <a
              className="link"
              href="https://www.facebook.com/profile.php?id=61560819160078"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Facebook
            </a>
            <a
              className="link"
              href="https://x.com/TuniCreatives"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Twitter
            </a>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>TuniCreatives</h2>
            <span>© TuniCreatives International 2024</span>
          </div>
          <div className="right">
            <div className="social">
              <a
                href="https://x.com/TuniCreatives"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/twitter.png" alt="Twitter" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61560819160078"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/facebook.png" alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/tunicreatives/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/instagram.png" alt="Instagram" />
              </a>
            </div>
            <div className="link">
              <img src="/img/language.png" alt="Language" />
              <span>English</span>
            </div>
            <div className="link">
              <img src="/img/coin.png" alt="Currency" />
              <span>Tunisian Dinar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
