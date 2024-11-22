import React from "react";
import { Link } from "react-router-dom";
import Slide from "../../components/Slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ContactForm from "../../components/contactForm/ContactForm";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import { cards } from "../../data";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home">
      <Featured />
      <TrustedBy />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} item={card} />
        ))}
      </Slide>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>
              Access a diverse pool of talented content creators at your
              convenience
            </h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Affordable options for all budgets
            </div>
            <p>
              Find top-notch content creation services that fit any budget.
              Enjoy project-based pricing without worrying about hourly fees.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Swift Project Completion
            </div>
            <p>
              Quickly find the ideal content creator to start your project,
              ensuring timely and efficient delivery.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Secure Payment
            </div>
            <p>
              Experience secure payments with Stripe, ensuring your transactions
              are safe and reliable.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Review System for Campaigns
            </div>
            <p>
              Benefit from a comprehensive review system where businesses can
              rate the campaigns, ensuring quality and reliability.
            </p>
            <Link to="/campaigns">
              <button>View All Campaigns</button>
            </Link>
          </div>
          <div className="item">
            <video src="/img/video.mp4" controls></video>
          </div>
        </div>
      </div>
      <div className="contact-container">
        <ContactForm />
      </div>
    </div>
  );
};

export default Home;
