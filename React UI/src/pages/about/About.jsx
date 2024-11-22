import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <h1>About Us</h1>
        <div className="section">
          <div className="text">
            <p>
              TuniCreatives is a web platform designed to match content creators with businesses or brands in Tunisia. We aim to organize the influencer marketing field in Tunisia by providing a structured and efficient way for brands to find and collaborate with local talent.
            </p>
          </div>
          <div className="image">
            <img src="/img/about1.png" alt="About TuniCreatives" />
          </div>
        </div>

        <div className="section reverse">
          <div className="text">
            <p>
              Our platform features a consistent and user-friendly interface, ensuring seamless navigation for both creators and businesses. From graphic design to digital marketing, TuniCreatives covers a wide range of creative services to meet your needs.
            </p>
          </div>
          <div className="image">
            <img src="/img/about3.png" alt="Our Services" />
          </div>
        </div>

        <div className="section">
          <div className="text">
            <p>
              At TuniCreatives, we prioritize secure transactions, timely project completion, and a robust review system to maintain high standards. Join us today and start your journey with TuniCreatives!
            </p>
          </div>
          <div className="image">
            <img src="/img/about4.jpg" alt="Join Us" />
          </div>
        </div>

        <div className="faq">
          <h2 id="faq">Frequently Asked Questions:</h2>
          <h3>What is TuniCreatives?</h3>
          <p>
            TuniCreatives is a platform that connects businesses with talented
            content creators in Tunisia.
          </p>

          <h3>How do I join TuniCreatives?</h3>
          <p>
            You can join TuniCreatives by signing up on our website and creating
            a profile.
          </p>

          <h3>How can I contact support?</h3>
          <p>
            You can contact support by using the contact form on our homepage.
          </p>

          <h3>Can I become a creator on TuniCreatives?</h3>
          <p>
            Yes, you can become a creator by clicking on 'Become a Creator' in
            your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
