import mongoose from "mongoose";
import { generateTrackingNumber } from "../utils/index.mjs";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, required: true },
  icon: { type: String, required: true },
});

const schema = new mongoose.Schema(
  {
    shipperName: {
      type: String,
      default: "",
    },
    shipperPhone: {
      type: String,
      default: "",
    },
    shipperEmail: {
      type: String,
      default: "",
    },
    shipperLocation: {
      type: String,
      default: "",
    },
    receiverName: {
      type: String,
      default: "",
    },
    receiverPhone: {
      type: String,
      default: "",
    },
    receiverEmail: {
      type: String,
      default: "",
    },
    receiverLocation: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    itemDescription: {
      type: String,
      default: "",
    },
    trackingNumber: {
      type: String,
      unique: true,
    },

    weight: {
      type: String,
      default: "",
    },
    quantity: {
      type: String,
      default: "",
    },
    modeOfTransport: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "pending",
    },
    totalCharges: {
      type: String,
      default: "",
    },
    expectedDate: {
      type: Date,
      default: "",
    },

    events: {
      type: [EventSchema],
      default: [],
    },
  },
  { timestamps: true }
);
schema.pre("save", function (next) {
  if (!this.trackingNumber) {
    this.trackingNumber = generateTrackingNumber();
  }
  next();
});

const Logistic = mongoose.model("Logistic", schema);

export default Logistic;
