import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_STATE, campaignReducer } from "../../reducers/campaignReducer";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import "./Add.scss";

// Component to add a new campaign
const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);// State for single file upload
  const [files, setFiles] = useState([]);// State for multiple files upload
  const [uploading, setUploading] = useState(false); // State to show uploading status
  const [errors, setErrors] = useState({}); // State to manage validation errors
  const [state, dispatch] = useReducer(campaignReducer, INITIAL_STATE); // Reducer to manage campaign state

// Handle input changes and dispatch actions to the reducer
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name, value },
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle adding features
  const handleFeature = (e) => {
    e.preventDefault();
    const feature = e.target[0].value.trim();
    if (!feature) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        features: "Key Feature cannot be empty",
      }));
      return;
    }
    dispatch({
      type: "ADD_FEATURE",
      payload: feature,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    if (!singleFile) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        upload: "Please upload a campaign cover image",
      }));
      return;
    }
    setUploading(true);
    setErrors((prevErrors) => ({ ...prevErrors, upload: "" })); // Clear previous upload error
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
      setUploading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        upload: "Upload failed. Please try again.",
      }));
    }
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  
  // Mutation to create a new campaign
  const mutation = useMutation({
    mutationFn: (campaign) => {
      return newRequest.post("/campaigns", campaign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myCampaigns"]);
      navigate("/mycampaigns");
    },
    onError: (error) => {
      console.error("Error adding campaign:", error); // Log any errors
      if (error.response && error.response.data) {
        alert(
          `Error adding campaign: ${
            error.response.data.message
          }\nDetails: ${JSON.stringify(error.response.data.details)}`
        );
      } else {
        alert(`Error adding campaign: ${error.message}`);
      }
    },
  });
 // Validate input fields
  const validate = () => {
    const newErrors = {};
    if (!state.title) newErrors.title = "Campaign Name is required";
    if (!state.cat) newErrors.cat = "Category is required";
    if (!state.cover) newErrors.upload = "Please upload Campain Images";
    if (!state.desc) newErrors.desc = "Description is required";
    if (!state.shortTitle) newErrors.shortTitle = "Content Type is required";
    if (!state.shortDesc)
      newErrors.shortDesc = "Client Requirement is required";
    if (!state.deliveryTime || state.deliveryTime <= 0)
      newErrors.deliveryTime = "Completion time need to be greater than 0";
    if (!state.revisionNumber || state.revisionNumber < 0)
      newErrors.revisionNumber = "Revision number cannot be negative";
    if (!state.price || state.price <= 0)
      newErrors.price = "Campaign costs need to be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(state);
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Campaign</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="title">Campaign Name</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Boost your Brand with Instagram"
              onChange={handleChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
            <label htmlFor="cat">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="beauty-fashion">Beauty and Fashion</option>
              <option value="travel-adventure">Travel and Adventure</option>
              <option value="health-fitness">Health and Fitness</option>
              <option value="tech-gadgets">Tech and Gadgets</option>
              <option value="food-cooking">Food and Cooking</option>
              <option value="lifestyle-development">
                Lifestyle and Development
              </option>
              <option value="reviews-unboxings">Reviews and Unboxings</option>
              <option value="education-tutorials">
                Education and Tutorials
              </option>
            </select>
            {errors.cat && <p className="error">{errors.cat}</p>}
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="cover">Campaign Cover Photo</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="images">Additional Supporting Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {uploading && <div className="spinner"></div>}{" "}
              {/* Spinner while uploading */}
              {errors.upload && <p className="error">{errors.upload}</p>}
            </div>
            <label htmlFor="desc">Campaign Description</label>
            <textarea
              name="desc"
              id="desc"
              placeholder="Elaborately describe the content and value of your campaign, how would the client benefit, and what are the potential outcomes and goals drawn from the campaign"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            {errors.desc && <p className="error">{errors.desc}</p>}
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="shortTitle">Content Type</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. Instagram Post, Youtube Video, Tiktok Challenge, etc..."
              onChange={handleChange}
            />
            {errors.shortTitle && <p className="error">{errors.shortTitle}</p>}
            <label htmlFor="shortDesc">Client Requirements</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id="shortDesc"
              placeholder="Specify any information or materials needed from the client to complete the campaign, such as products to review, content guidelines, or specific requests."
              cols="30"
              rows="10"
            ></textarea>
            {errors.shortDesc && <p className="error">{errors.shortDesc}</p>}
            <label htmlFor="deliveryTime">Completion Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            {errors.deliveryTime && (
              <p className="error">{errors.deliveryTime}</p>
            )}
            <label htmlFor="revisionNumber">Revisions Included</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            {errors.revisionNumber && (
              <p className="error">{errors.revisionNumber}</p>
            )}
            <label htmlFor="features">Key Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input
                type="text"
                placeholder="e.g. High Engagement, High ROI, Professional Editing, Fast Turnaround, etc.."
              />
              <button type="submit">add</button>
            </form>
            {errors.features && <p className="error">{errors.features}</p>}
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="price">Cost</label>
            <input type="number" onChange={handleChange} name="price" />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
