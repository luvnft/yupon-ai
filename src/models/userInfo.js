import mongoose from "mongoose";

const UserInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  business_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  profileImageUrl: {
    type: String,
    default:
      "https://yt3.googleusercontent.com/ytc/APkrFKbeehewrrvwtvFja5yPH5LxUUT4zFnmQ_odC0BJHQ=s900-c-k-c0x00ffffff-no-rj",
  },
  lng: {
    type: Number,
    default: -86.802658,
  },
  lat: {
    type: Number,
    default: 36.144703,
  },
  address: {
    type: String,
  },
  menu_items: [
    {
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      points_cost: {
        type: Number,
      },
      points_received: {
        type: Number,
      },
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
      },
    },
  ],
});

const UserInfo =
  mongoose.models.UserInfo || mongoose.model("UserInfo", UserInfoSchema);

export default UserInfo;
