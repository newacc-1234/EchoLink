import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-screen pt-20 flex justify-center items-center">
      <div className="bg-primary/5 rounded-3xl border-[3px] border-primary/100 p-8 max-w-4xl w-full shadow-md flex flex-col md:flex-row gap-8">
        
       
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Profile</h1>
            <p className="text-zinc-400">Your profile information</p>
          </div>

          <div className="space-y-4">
           
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-3xl border-[3px] border-primary/100">
                {authUser?.fullName}
              </p>
            </div>

            
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-3xl border-[3px] border-primary/100">
                {authUser?.email}
              </p>
            </div>

            <div className="mt-6 bg-base-200 rounded-xl border-[3px] border-primary/100 p-4">
              <h2 className="text-lg font-medium mb-3">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
