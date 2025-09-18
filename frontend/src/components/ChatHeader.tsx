import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"
import sampleProfile from "../assets/react.svg"

export default function ChatHeader(){
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return(
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar Icon */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || sampleProfile} />
                        </div>
                    </div>

                    {/* User Info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-container/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};