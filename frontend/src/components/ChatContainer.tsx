import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

import sampleProfile from "../assets/react.svg"
import { formatMessageTime } from "../lib/utils";
import { Trash } from "lucide-react";

export default function ChatContainer(){
    const {messages, getMessages, isMessagesLoading, selectedUser, deleteMessage, listenToMessages, stopListeningToMessages} = useChatStore();
    const { authUser } = useAuthStore() 
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    // Load messages
    useEffect(() => {
        getMessages(selectedUser._id);
        listenToMessages();

        return () => {
            stopListeningToMessages()
        };
    }, [selectedUser._id, getMessages, listenToMessages, stopListeningToMessages]);

    // Scroll to end of chat
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    if(messages) {
        console.log(messages)
    }

    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            {isMessagesLoading 
                ? (<MessageSkeleton />)
                : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(message => (
                            <div 
                                key={message._id} 
                                ref={messageEndRef} 
                                className={`chat ${message.receiverId === selectedUser._id ? "chat-end" : "chat-start"}`}
                                >
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
                                    <div 
                                        className={`chat-bubble flex flex-col items-center bg-neutral
                                                    ${message.deleted && "!bg-base-100 border-1 border-error"} ${message.senderId === authUser?._id && "bg-primary"}`}
                                        >
                                            {message.deleted 
                                                ? ("Message Deleted")
                                                : (
                                                    <>
                                                        {message.image && (
                                                            <img 
                                                                src={message.image}
                                                                alt='Attachment'
                                                                className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                                                            />
                                                        )}
                                                        <p className="self-start text-primary-content">{message.text}</p>
                                                        {message.senderId === authUser?._id && (
                                                            <div 
                                                                onClick={() => deleteMessage(message._id)}
                                                                className="absolute bottom-0 -left-9 p-2 rounded-full bg-base-200 hover:bg-primary cursor-pointer active:bg-base-200"
                                                                >
                                                                    <Trash  size={18}  />
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                        }
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
