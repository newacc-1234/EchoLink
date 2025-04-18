import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onGroupCreated = () => {}, onClose = () => {} }) => {
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [groupName, setGroupName] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/messages/users");
      const filtered = res.data.filter(
        (user) => user._id !== authUser._id && user.email !== "dectrabot@ai.com"
      );
      setUsers(filtered);
    } catch (err) {
      toast.error("Error fetching users");
      console.error(err);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedUserIds.length < 2) {
      toast.error("Please select at least 2 members to create a group");
      return;
    }

    try {
      await axiosInstance.post("/groups", {
        name: groupName,
        members: selectedUserIds,
      });

      setGroupName("");
      setSelectedUserIds([]);
      document.getElementById("create_group_modal").close();
      toast.success("Group created successfully");
      onGroupCreated();
    } catch (err) {
      toast.error("Failed to create group");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <button
        className="btn btn-primary w-full mb-4"
        onClick={() => document.getElementById("create_group_modal").showModal()}
      >
       <UserPlus className="shrink-0" />
       <span className="truncate">Create Group</span>
      </button>

      <dialog id="create_group_modal" className="modal" onClose={onClose}>
        <div className="modal-box w-full max-w-lg">
          <h3 className="font-bold text-lg">Create New Group</h3>
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full"
            />

            <div className="max-h-60 overflow-y-auto space-y-1">
              {users.map((user) => (
                <label key={user._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  document.getElementById("create_group_modal").close();
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGroup}
                className="btn btn-primary"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateGroupModal;
