import mongoose from "mongoose"; // Library for MongoDB object modeling
const { Schema } = mongoose;

// Define the schema for the user
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String, //cause we're going to store the image url
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String, 
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isCreator: {
      type: Boolean,
      default: false, // Default value is false
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save hook to convert email and username to lowercase before saving
userSchema.pre('save', function(next) {
  this.email = this.email.toLowerCase();
  this.username = this.username.toLowerCase();
  next();
});

// Export the user model
export default mongoose.model("User", userSchema);
