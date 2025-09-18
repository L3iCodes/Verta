import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface ChatStoreStates {
    messages: any[];
    users: any[];
    selectedUser: any;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: any) => Promise<void>;
    setSelectedUser: (user: any) => void;
    listenToMessages: () => void;
    stopListeningToMessages: () => void;
};


export const useChatStore = create<ChatStoreStates>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        set({isUsersLoading: true});

        try{
            const res = await axiosInstance.get("/message/users");
            set({users: res.data});
        }catch(error: any){
            // console.log('Error in getUsers:', error)
            // toast.error(error.response.data.messages)
        }finally{
            set({isUsersLoading: false});
        };
    },

    getMessages: async(userId) => {
        set({isMessagesLoading: true});

        try{
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data});
        }catch(error: any){
            toast.error(error.response.data.messages)
        }finally{
            set({isMessagesLoading: false});
        };
    },

    sendMessage: async(messageData: any) => {
        const { messages, selectedUser } = get();
        try{
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages:[...messages, res.data]});
        }catch(error: any){
            toast.error(error.response.data.messages)
        }
    },

    setSelectedUser: (user) => {
        try{
            set({selectedUser: user})
        }catch(error: any){
            toast.error(error.response.data.messages)
        }
    },

    listenToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        
        if(!selectedUser) return;
        
        socket.on("newMessage", (newMessage: any) => {
            if(newMessage.senderId !== selectedUser._id) return;

            set({messages: [...get().messages, newMessage]})
        })
    },

    stopListeningToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));