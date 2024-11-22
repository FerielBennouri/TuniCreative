import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import ErrorModal from "../errorModal/ErrorModal"; // Import the new ErrorModal component
import Review from "../review/Review";
import "./Reviews.scss";

const Reviews = ({ campaignId }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews", campaignId],
    queryFn: () =>
      newRequest.get(`/reviews/${campaignId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", campaignId]);
      setErrorMsg(null); // Clear error message on success
      setFormData({ desc: "", star: "" }); // Reset form fields
    },
    onError: (err) => {
      setErrorMsg(err.response?.data || "An error occurred");
      setIsModalOpen(true); // Open modal on error
    },
  });

  const [formData, setFormData] = useState({ desc: "", star: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ campaignId, desc, star });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading
        ? "loading"
        : error
        ? "Something went wrong!"
        : data.map((review) => <Review key={review._id} review={review} />)}
      <div className="add">
        <h3>Add a review</h3>
        <form action="" className="addForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="desc"
            placeholder="write your opinion"
            value={formData.desc}
            onChange={handleChange}
          />
          <select
            name="star"
            id="star"
            value={formData.star}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select rating
            </option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button>Send</button>
        </form>
      </div>
      <ErrorModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        message={errorMsg}
      />
    </div>
  );
};

export default Reviews;
