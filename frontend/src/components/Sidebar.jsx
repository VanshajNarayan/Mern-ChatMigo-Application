// ! packages:-
import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

// ! fetching server data using zustand store:
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

// ! components:-
import SidebarSkeletons from "./skeletons/SidebarSkeletons.jsx";

const Sidebar = () => {
  // ? get users and selected user from zustand store:-
  const { users, getUsers, isUserLoading, selectedUser, setSelectedUser } =
    useChatStore();

  // ? get online users from zustand store:-
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // ? get all user on mount:
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ? filter online users on mount:
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // ? check if users are loading:
  if (isUserLoading) return <SidebarSkeletons />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        {/* HEADER */}
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          {/* ONLINE FILTER TOGGLE */}
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
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length >= 0 && onlineUsers.length - 1} online)
            </span>
          </div>
        </div>

        {/* USERS */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}>
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
                )}
              </div>

              {/* USER INFO SKELETON - ONLY VISIBLE ON LARGE SCREEN */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
          {/* NO ONLINE USERS */}
          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
