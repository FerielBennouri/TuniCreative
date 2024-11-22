import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faInbox, faPlus, faThLarge, faInfoCircle, faListAlt, faUserShield, faEnvelope, faShoppingCart, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

Modal.setAppElement("#root");

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { pathname } = useLocation();

  const isActive = () => {
    if (window.scrollY > 0) {
      setActive(true);
    } else {
      setActive(false);
    }
    if (open) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", isActive);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleBecomeCreator = async () => {
    try {
      await newRequest.post("/users/become-creator");
      const updatedUser = { ...currentUser, isCreator: true };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const confirmBecomeCreator = () => {
    handleBecomeCreator();
    closeModal();
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showCategories = active;

  return (
    <div className={active ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/" onClick={handleLogoClick}>
            <span className="text">TuniCreatives</span>
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/about">
            <FontAwesomeIcon icon={faInfoCircle} /> About us
          </Link>
          <Link className="link" to="/campaigns">
            <FontAwesomeIcon icon={faListAlt} /> All Campaigns
          </Link>
          {currentUser && !currentUser.isCreator && (
            <span onClick={openModal} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faUserShield} /> Become a Creator
            </span>
          )}
          {currentUser ? (
            <div
              className="user"
              ref={dropdownRef}
              onClick={() => setOpen(!open)}
            >
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>
                {currentUser.username} <span style={{ marginLeft: '8px' }}><FontAwesomeIcon icon={faUser} /></span>
              </span>
              {open && (
                <div className="options">
                  {currentUser.isCreator && (
                    <>
                      <Link className="link" to="/mycampaigns">
                        <FontAwesomeIcon className="icon-spacing" icon={faClipboardList} /> My Campaigns
                      </Link>
                      <Link className="link" to="/add">
                        <FontAwesomeIcon className="icon-spacing" icon={faPlus} /> Add New Campaign
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    <FontAwesomeIcon className="icon-spacing" icon={faShoppingCart} /> Orders
                  </Link>
                  <Link className="link" to="/messages">
                    <FontAwesomeIcon className="icon-spacing" icon={faEnvelope} /> Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    <FontAwesomeIcon className="icon-spacing" icon={faSignOutAlt} /> Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button className={pathname !== "/" ? "white-text" : ""}>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {showCategories && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/campaigns?cat=beauty-fashion">
              Beauty & Fashion
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=travel-adventure">
              Travel & Adventure
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=health-fitness">
              Health & Fitness
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=tech-gadgets">
              Technology & Gadgets
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=food-cooking">
              Food & Cooking
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=lifestyle-development">
              Lifestyle & Personal Development
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=reviews-unboxings">
              Reviews & Unboxings
            </Link>
            <Link className="link menuLink" to="/campaigns?cat=education-tutorials">
              Education & Tutorials
            </Link>
          </div>
          <hr />
        </>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Become Creator"
        className="confirm-modal"
        overlayClassName="confirm-overlay"
      >
        <h2>Confirm Becoming a Creator</h2>
        <p>Are you sure you want to become a creator?</p>
        <div className="button-container">
          <button onClick={confirmBecomeCreator}>Yes</button>
          <button onClick={closeModal}>No</button>
        </div>
      </Modal>
    </div>
  );
}

export default Navbar;
