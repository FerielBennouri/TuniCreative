import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner"; // Import the Spinner component
import newRequest from "../../utils/newRequest";
import "./Orders.scss";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

   // Fetch orders for the current user
  const {
    isLoading,
    error,
    data = [],
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  // Mutation to cancel an order
  const cancelMutation = useMutation({
    mutationFn: (orderId) => {
      return newRequest.put(`/orders/cancel/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);// Invalidate orders query to refetch data
    },
  });

  // Handle contact between buyer and creator
  const handleContact = async (order) => {
    const creatorId = order.creatorId;
    const buyerId = order.buyerId;

     // Create a unique ID for the conversation
    const id = currentUser._id === order.buyerId ? order.creatorId + buyerId : creatorId + order.buyerId

    try {
      // Try to get existing conversation
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
         // If conversation doesn't exist, create a new one
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser._id === order.buyerId ? creatorId : buyerId,
          from: currentUser._id,
          id: id,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

   // Handle order cancellation
  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelMutation.mutate(orderId);
    }
  };

   // Handle campaign click to navigate to the campaign page
  const handleCampaignClick = async (campaignId) => {
    try {
      await newRequest.get(`/campaigns/single/${campaignId}`);
      navigate(`/campaign/${campaignId}`);
    } catch (err) {
      if (err.response.status === 404) {
        alert("The campaign you are trying to access has been deleted.");
      } else {
        console.error("Error checking campaign existence:", err);
      }
    }
  };

   // Separate orders into received and made orders
  const receivedOrders = data.filter(
    (order) => order.creatorId === currentUser._id
  );
  const madeOrders = data.filter((order) => order.buyerId === currentUser._id);

  return (
    <div className="orders">
      {isLoading ? (
        <Spinner /> // Use Spinner component here
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
            <hr class="custom-hr" />
          </div>
          {data.length === 0 && !currentUser.isCreator ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            <div
              className={`orders-content ${
                currentUser.isCreator ? "creator-layout" : ""
              }`}
            >
              {currentUser.isCreator && (
                <div className="orders-column">
                  <h2>Received Orders</h2>
                  {receivedOrders.length === 0 ? (
                    <p className="no-orders">No received orders yet.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Price</th>
                          <th>Contact</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedOrders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <span
                                className="link"
                                onClick={() =>
                                  handleCampaignClick(order.campaignId)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img className="image" src={order.img} alt="" />
                              </span>
                            </td>
                            <td>
                              <span
                                className="link"
                                onClick={() =>
                                  handleCampaignClick(order.campaignId)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {order.title}
                              </span>
                            </td>
                            <td>{order.price}</td>
                            <td className="center">
                              <img
                                className="message"
                                src="./img/message.png"
                                alt=""
                                onClick={() => handleContact(order)}
                              />
                            </td>
                            <td>
                              {order.status === "active" ? (
                                <button
                                  className="cancel-button"
                                  onClick={() => handleCancel(order._id)}
                                >
                                  Cancel Order
                                </button>
                              ) : (
                                <span>Order Cancelled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              <div className="orders-column">
                <h2>{currentUser.isCreator ? "Made Orders" : "Made Orders"}</h2>
                {madeOrders.length === 0 ? (
                  <p className="no-orders">
                    No {currentUser.isCreator ? "made" : ""} orders found.
                  </p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Contact</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {madeOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <span
                              className="link"
                              onClick={() =>
                                handleCampaignClick(order.campaignId)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <img className="image" src={order.img} alt="" />
                            </span>
                          </td>
                          <td>
                            <span
                              className="link"
                              onClick={() =>
                                handleCampaignClick(order.campaignId)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {order.title}
                            </span>
                          </td>
                          <td>{order.price}</td>
                          <td className="center">
                            <img
                              className="message"
                              src="./img/message.png"
                              alt=""
                              onClick={() => handleContact(order)}
                            />
                          </td>
                          <td>
                            {order.status === "active" ? (
                              <button
                                className="cancel-button"
                                onClick={() => handleCancel(order._id)}
                              >
                                Cancel Order
                              </button>
                            ) : (
                              <span>Order Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
