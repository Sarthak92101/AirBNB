const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  image: {
    filename: {
      type: String,
      default: "default-image"
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/cozy-living-room-with-elegant-furniture-and-decor-AO6BYTEnlMo"
    }
  },

  price: Number,
  location: String, // corrected typo
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
