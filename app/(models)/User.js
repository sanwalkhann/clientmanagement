import mongoose, { Schema } from "mongoose";


mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise= global.Promise


const timeSlotSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
    specialization: {
      type: String,
    },
    timeSlots: [timeSlotSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
