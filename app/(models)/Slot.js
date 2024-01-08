import mongoose, { Schema } from "mongoose";

const slotSchema = new Schema({
  day: String,
  time: String,
  isAvailable: { type: Boolean, default: true },
});

const Slot = mongoose.models.Slot || mongoose.model("Slot", slotSchema);

export default Slot;
