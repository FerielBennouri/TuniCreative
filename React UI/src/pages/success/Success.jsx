//Displays a success message and updates the order status after a successful payment.
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss"; // Import the new stylesheet
import Spinner from "../../components/spinner/Spinner"; // Import Spinner

const Success = () => {
  const { search } = useLocation(); // Hook to access the query parameters from the URL
  const navigate = useNavigate();  // Hook to programmatically navigate between routes
  const params = new URLSearchParams(search);  // Create a URLSearchParams instance to parse the query parameters
  const payment_intent = params.get("payment_intent"); // Get the payment_intent parameter from the URL

  useEffect(() => {
    const makeRequest = async () => {
      try {
        // Make a request to the backend to update the order status using the payment_intent
        await newRequest.put("/orders", { payment_intent });
         // Redirect to the orders page after 5 seconds
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  return (
    <div className="success">
      <Spinner /> {/* Show spinner while processing*/}
      <div className="message">
        Payment successful. You are being redirected to the orders page. Please do not close the page.
      </div>
    </div>
  );
};

export default Success;
