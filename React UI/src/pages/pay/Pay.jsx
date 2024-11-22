//Handles the payment process for a campaign.
import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import Spinner from "../../components/spinner/Spinner"; // Import Spinner

// Initialize Stripe with the public key
const stripePromise = loadStripe(
  "pk_test_51PGiLUIkwJ5hwC5K8Vyf8fF0MRYXKmGcEPq2rAsfl7YQ9YCkfN2itWGsaXe097aFv4LQDloLoYEZloYEt7QRc9O600MX4jBFH9"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const { id } = useParams();

   // Effect to create payment intent on component mount
  useEffect(() => {
    const makeRequest = async () => {
      try {
        // Request to create payment intent
        const res = await newRequest.post(
          `/orders/create-payment-intent/${id}`
        );
        // Set client secret from response
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false); // Set loading to false after request
      }
    };
    makeRequest();
  }, []);

  const appearance = {// Set Stripe theme
    theme: "stripe",
  };
  const options = {
    clientSecret, // Provide client secret
    appearance,// Provide appearance options
  };

  return (
    <div className="pay">
      {isLoading ? (
        <Spinner /> // Use Spinner component
      ) : (
        clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )
      )}
    </div>
  );
};

export default Pay;
