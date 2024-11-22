// This function is typically used in the frontend to upload user-selected files 
// (e.g., profile pictures) to Cloudinary and get back the URL of the uploaded image
// , which can then be used or stored as needed.
import axios from "axios";// Import axios for making HTTP requests to the Cloudinary API

// Asynchronous function to handle file upload
const upload = async (file) => {
   // Create a new FormData object to hold the file data
  const data = new FormData();
  data.append("file", file); // Append the file to the FormData object
  data.append("upload_preset", "tunicreatives");// Append the upload preset (a configuration in Cloudinary)

  try {
    // Make a POST request to Cloudinary's upload endpoint with the FormData
    const res = await axios.post(
        "https://api.cloudinary.com/v1_1/feriel/image/upload", 
        data // The FormData containing the file and upload preset
    );
    // Extract the URL of the uploaded image from the response
    const { url } = res.data;
    return url;// Return the URL of the uploaded image

  } catch (err) {
        // Log any errors that occur during the upload

    console.log(err);
  }
};

export default upload;// Export the upload function as the default export