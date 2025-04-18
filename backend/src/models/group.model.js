import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

groupSchema.path("members").default(() => []);
const Group = mongoose.model("Group", groupSchema);
export default Group;
