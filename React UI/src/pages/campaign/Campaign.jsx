import { useQuery } from "@tanstack/react-query";
import { Slider } from "infinite-react-carousel/lib";
import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";
import Spinner from "../../components/spinner/Spinner"; // Import Spinner
import newRequest from "../../utils/newRequest";
import "./Campaign.scss";

// Set the app element for accessibility
Modal.setAppElement("#root");

// Component to display detailed information about a single campaign
function Campaign() {
  const { id } = useParams();  // Get the campaign ID from URL parameters
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);// State to handle modal open/close
  const [isNavigating, setIsNavigating] = useState(false); // State to show spinner while navigating

   // Fetch campaign data using the campaign ID
  const {
    isLoading: isLoadingCampaign,
    error,
    data,
  } = useQuery({
    queryKey: ["campaign"],
    queryFn: () =>
      newRequest.get(`/campaigns/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  // Fetch user data based on userId from the campaign data
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${data.userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

   // Handle order click
  const handleOrderClick = () => {
    if (!currentUser) {
      setIsModalOpen(true);// Open modal if user is not logged in
    } else if (currentUser._id === data.userId) {
      alert("You cannot purchase your own campaign.");
    } else {
      setIsNavigating(true); // Show spinner
      navigate(`/pay/${id}`);// Navigate to payment page
    }
  };

    // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="campaign">
      {isLoadingCampaign || isLoadingUser ? (
        <Spinner /> // Use Spinner component
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs"></span>
            <h1>{data.title}</h1>

            <div className="user">
              <img
                className="pp"
                src={dataUser.img || "/img/noavatar.jpg"}
                alt=""
              />
              <span>{dataUser.username}</span>
              {!isNaN(data.totalStars / data.starNumber) && (
                <div className="stars">
                  {Array(Math.round(data.totalStars / data.starNumber))
                    .fill()
                    .map((item, i) => (
                      <img src="/img/star.png" alt="" key={i} />
                    ))}
                  <span>{Math.round(data.totalStars / data.starNumber)}</span>
                </div>
              )}
            </div>

            {data.images && data.images.length > 0 && (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data.images.map((img) => (
                  <img src={img} key={img} alt="" />
                ))}
              </Slider>
            )}

            <h2>About This Campaign</h2>
            <p>{data.desc}</p>

            <div className="creator">
              <h2>About The Creator</h2>
              <div className="user">
                <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                <div className="info">
                  <span>{dataUser.username}</span>

                  {!isNaN(data.totalStars / data.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(data.totalStars / data.starNumber))
                        .fill()
                        .map((item, i) => (
                          <img src="/img/star.png" alt="" key={i} />
                        ))}
                      <span>
                        {Math.round(data.totalStars / data.starNumber)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{dataUser.country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Email</span>
                    <span className="desc">{dataUser.email}</span>
                  </div>
                  <div className="item">
                    <span className="title">Phone</span>
                    <span className="desc">{dataUser.phone}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">
                      {new Date(dataUser.createdAt).toDateString()}
                    </span>
                  </div>
                </div>
                <hr />
                <p>{dataUser.desc}</p>
              </div>
            </div>
            <Reviews campaignId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>{data.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>

            {data.features && data.features.length > 0 && (
              <div className="features">
                {data.features.map((feature) => (
                  <div className="item" key={feature}>
                    <img src="/img/greencheck.png" alt="" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleOrderClick}>Continue to Purchase </button>
          </div>
        </div>
      )}
      {isNavigating && <Spinner />} {/* Show spinner while navigating */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Login Required"
        className="campaign-modal" /* Use unique class names */
        overlayClassName="campaign-overlay" /* Use unique class names */
      >
        <h2>Login Required</h2>
        <p>You need to be logged in to place an order.</p>
        <div className="button-container">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Campaign;
