import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore"

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

import sampleProfile from "../assets/react.svg"
import { formatMessageTime } from "../lib/utils";

export default function ChatContainer(){
    const {messages, getMessages, isMessagesLoading, selectedUser} = useChatStore();
    const { authUser } = useAuthStore() 

    // Load messages
    useEffect(() => {
        getMessages(selectedUser._id);
    }, [selectedUser._id])

    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            {isMessagesLoading 
                ? (<MessageSkeleton />)
                : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(message => (
                            <div key={message._id}  className={`chat ${message.receiverId === selectedUser._id ? "chat-end" : "chat-start"}`}>
                                {/* Chat Avatar */}
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                    <img
                                        alt="Profile"
                                        src={message.receiverId === selectedUser._id 
                                            ? authUser?.profilePic || sampleProfile 
                                            : selectedUser?.profilePic || sampleProfile}
                                    />
                                    </div>
                                </div>
                                
                                
                                {/* Chat Content */}
                                <div className="chat-bubble">
                                    {message.image && (
                                        <img 
                                            src={message.image}
                                            alt='Attachment'
                                            className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                                        />
                                    )}
                                    {message.text}
                                </div>
                                <div className="chat-header mb-1">
                                    <time className="text-sx opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        
            <MessageInput />
        </div>
    )
};
