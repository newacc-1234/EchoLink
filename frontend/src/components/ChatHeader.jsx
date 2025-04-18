import { X, BadgeCheck, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useState, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  const isUserSelected=Boolean(selectedUser);
  const isGroupSelected=Boolean(selectedGroup);

  const handleImageError = () => setImageError(true);

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const handleGroupImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGroupImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend=async () => {
      try {
        const base64Image=reader.result;
        const res=await axiosInstance.patch(
          `/groups/${selectedGroup._id}/profile-picture`,
          { image: base64Image }
        );
        toast.success("Group picture updated");
        setSelectedGroup(res.data);
      } catch (error) {
        toast.error("Failed to update picture");
      }
    };

    reader.readAsDataURL(file);
  };

  const renderGroupMembers = () => {
    if (!selectedGroup?.members?.length) return null;

    const memberNames = selectedGroup.members.map((member) =>
      member._id === authUser._id ? "You" : member.fullName || "Unknown"
    );

    return memberNames.join(", ");
  };

  return (
    <div className="p-4 border-b-[3px] border-primary/100 text-lg bg-primary/10 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/*Avatar/Group Icon*/}
          {isUserSelected ? (
            <div className="avatar">
              <div className="size-12 rounded-full relative">
                <img
                  src={imageError ? "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  onError={handleImageError}
                />
              </div>
            </div>
          ) : isGroupSelected ? (
            <div
              className="rounded-full bg-primary text-primary-content w-12 h-12 cursor-pointer overflow-hidden"
              onClick={handleGroupImageClick}
              title="Click to update group picture"
            >
              {selectedGroup.groupImage ? (
                <img
                  src={`${selectedGroup.groupImage}?v=${Date.now()}`} 
                  alt="Group"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGroupImageChange}
              />
            </div>
          ) : null}
          {/* Info */}
          <div>
            {isUserSelected && (
              <>
                <div className="flex items-center gap-1 font-medium">
                  <h3>{selectedUser.fullName}</h3>
                  {selectedUser.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" title="Verified" />
                  )}
                </div>
                <p className="text-sm text-base-content/70">
                  {(onlineUsers.includes(selectedUser._id) ||
                    selectedUser.email === "dectrabot@ai.com")
                    ? "Online"
                    : "Offline"}
                </p>
              </>
            )}
            {isGroupSelected && (
              <>
                <h3 className="font-medium">{selectedGroup.name}</h3>
                <p className="text-sm text-base-content/70">{renderGroupMembers()}</p>
              </>
            )}
          </div>
        </div>
        {/*Close button*/}
        <button onClick={handleClose} aria-label="Close chat">
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
