import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  //fetch all groups for the logged-in user
  getGroups: async () => {
    set({ isGroupsLoading: true });
    const userId = useAuthStore.getState().authUser?._id;

    try {
      const res = await axiosInstance.get(`/groups/${userId}`);
      set({ groups: res.data });
    } catch (error) {
      toast.error("Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  //fetch messages for a selected group
  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/group-messages/${groupId}`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error("Failed to load group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  //send a message to a group
  sendGroupMessage: async (groupId, messageData) => {
    try {
      await axiosInstance.post(`/group-messages/${groupId}`, messageData);
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  //listen for new incoming messages via socket
  subscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newGroupMessage", (newMessage) => {
      const { selectedGroup, groupMessages } = get();
      if (selectedGroup && newMessage.groupId === selectedGroup._id) {
        set({
          groupMessages: [...groupMessages, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          ),
        });
      }
    });
  },

  //unsubscribe from socket
  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newGroupMessage");
  },

  //set the selected group,join group socket room
  setSelectedGroup: (group) => {
    const socket = useAuthStore.getState().socket;
    if (socket && group) {
      socket.emit("joinGroup", group._id);
    }
    set({ selectedGroup: group });
  },

  //update group profile picture
  updateGroupProfilePicture: async (groupId, base64Image) => {
    try {
      const res = await axiosInstance.put(`/groups/${groupId}/update-image`, {
        image: base64Image,
      });
      const updatedGroup = res.data;

      //update groups and selected group in state
      set((state) => ({
        groups: state.groups.map((g) =>
          g._id === groupId ? updatedGroup : g
        ),
        selectedGroup:
          state.selectedGroup?._id === groupId
            ? updatedGroup
            : state.selectedGroup,
      }));

      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Failed to update group picture");
      console.error("Update Error:", err);
    }
  },
}));
