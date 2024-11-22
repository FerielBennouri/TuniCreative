import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner"; // Import the Spinner component
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import "./MyCampaigns.scss";

Modal.setAppElement("#root"); // Set the app root element for accessibility

// Component to manage user's campaigns
function MyCampaigns() {
  const currentUser = getCurrentUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);// State to manage modal visibility
  const [campaignToDelete, setCampaignToDelete] = useState(null); // State to manage which campaign to delete
  const navigate = useNavigate();

  const queryClient = useQueryClient();

    // Fetch user's campaigns
  const { isLoading, error, data } = useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () =>
      newRequest.get(`/campaigns?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

    // Mutation to delete a campaign
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCampaigns"]);
    },
  });

  // Handle delete confirmation
  const handleDelete = () => {
    mutation.mutate(campaignToDelete);
    closeModal();
  };

  // Open the modal for confirmation
  const openModal = (id) => {
    setCampaignToDelete(id);
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setCampaignToDelete(null);
  };

   // Navigate to the campaign detail page
  const handleCampaignClick = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <div className="myCampaigns">
      {isLoading ? (
        <Spinner /> // Use Spinner component here
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Campaigns</h1>
            {currentUser.isCreator && (
              <Link to="/add">
                <button>Add New Campaign</button>
              </Link>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4">No campaigns found</td>
                </tr>
              ) : (
                data.map((campaign) => (
                  <tr key={campaign._id}>
                    <td>
                      <span
                        className="link"
                        onClick={() => handleCampaignClick(campaign._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img className="image" src={campaign.cover} alt="" />
                      </span>
                    </td>
                    <td>
                      <span
                        className="link"
                        onClick={() => handleCampaignClick(campaign._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {campaign.title}
                      </span>
                    </td>
                    <td>{campaign.price}</td>
                    <td>
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt=""
                        onClick={() => openModal(campaign._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Delete"
            className="Modal"
            overlayClassName="Overlay"
          >
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this campaign?</p>
            <div className="button-container">
              <button onClick={handleDelete}>Yes</button>
              <button onClick={closeModal}>No</button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default MyCampaigns;
