import mongoose, { Schema } from "mongoose";
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const patientSchema = new Schema(
  {
    name: String,
    email: String, 
    password: String,
  },
  {
    timestamps: true,
  }
);
const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export default Patient;