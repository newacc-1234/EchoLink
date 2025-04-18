import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, BadgeCheck } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const {
    groups: groupChats,
    getGroups: getGroupChats,
    selectedGroup,
    setSelectedGroup,
  } = useGroupChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
    getGroupChats();
  }, [getUsers, getGroupChats]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id) || user.email === "dectrabot@ai.com")
    : users;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  const handleGroupCreated = () => {
    getGroupChats(); // Refresh group list
    setIsGroupModalOpen(false);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-40 lg:w-[400px] border-r-[3px] border-primary/100 flex flex-col transition-all duration-200 p-5">
      
      <div className="border-b-[3px] border-base-700 w-full bg-primary/10 rounded-md p-6 border-primary/100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block text-lg">Contacts</span>
          </div>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length} online)</span>
        </div>
      </div>

     
      <div className="overflow-y-auto w-full py-3 space-y-2 flex-1">
        <h3 className="text-sm font-semibold text-zinc-400 px-2">Direct Messages</h3>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {(onlineUsers.includes(user._id) || user.email === "dectrabot@ai.com") && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="flex items-center gap-1 font-medium truncate">
                {user.fullName}
                {user.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" title="Verified" />
                )}
              </div>
              <div className="text-sm text-zinc-400">
                {(onlineUsers.includes(user._id) || user.email === "dectrabot@ai.com")
                  ? "Online"
                  : "Offline"}
              </div>
            </div>
          </button>
        ))}

       
        {groupChats.length > 0 && (
          <>
            <h3 className="text-sm font-semibold text-zinc-400 mt-6 px-2">Group Chats</h3>
            {groupChats.map((group) => (
              <button
                key={group._id}
                onClick={() => handleSelectGroup(group)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                  ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="mx-auto lg:mx-0">
                  {group.groupImage ? (
                    <img
                      src={`${group.groupImage}?v=${Date.now()}`}
                      alt="Group"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="rounded-full bg-primary text-primary-content p-2 w-12 h-12 flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-medium truncate">{group.name}</div>
                  <div className="text-sm text-zinc-400">
                    {group.members?.length || 0} members
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      
      <CreateGroupModal
        open={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />
    </aside>
  );
};

export default Sidebar;
