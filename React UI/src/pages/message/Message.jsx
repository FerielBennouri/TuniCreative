import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import Spinner from "../../components/spinner/Spinner"; // Import Spinner

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const {
    isLoading: messagesLoading,
    error: messagesError,
    data: messagesData,
  } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  const {
    isLoading: conversationLoading,
    error: conversationError,
    data: conversationData,
  } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
      receiverId:
        currentUser._id === conversationData.senderId
          ? conversationData.receiverId
          : conversationData.senderId,
    });
    e.target[0].value = "";
  };

  if (messagesLoading || conversationLoading) {
    return <Spinner />; // Use Spinner component
  }

  if (messagesError || conversationError) {
    console.error("Error fetching data", { messagesError, conversationError });
    return <div>Error</div>;
  }

  console.log("Conversation Data: ", conversationData);

  const receiverName =
    currentUser._id === conversationData.senderId
      ? conversationData.receiverName
      : conversationData.senderName;

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link">
            Messages
          </Link>{" "}
          {">"} {receiverName}
        </span>
        <div className="messages">
          {messagesData.map((m) => (
            <div
              className={m.userId === currentUser._id ? "owner item" : "item"}
              key={m._id}
            >
              <img
                src={
                  m.user.img || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                }
                alt=""
              />
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
