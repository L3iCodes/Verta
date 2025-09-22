import { create  } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
import { Import } from "lucide-react";

interface User {
  _id?: string;
  email: string;
  fullName?: string;
  password?: string;
  profilePic?: string;
}

interface AuthState {
  authUser: any;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: User) => Promise<void>;
  login: (data: User) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setAuthUser?: (user: User | null) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  onlineUsers: any[];
  socket: any;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async() => {
        try{
            // Check if user is logged in
            const response = await axiosInstance.get("/auth/check");
            set({authUser:response.data});
            
            get().connectSocket(); //Connect to server for realtime data
        }catch(error){
            console.log('Error in CheckAuth:', error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth: false});
        };
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created succesfully");
            
            get().connectSocket() //Connect to server for realtime data
        }catch(error: any){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        };
    },

    logout: async() => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logout succesfully");
            
            get().disconnectSocket() // Disconnect from server
        }catch(error: any){
            toast.error(error.response.data.message);
        };
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Succesfully logged in");

            get().connectSocket() //Connect to server for realtime data
        }catch(error: any){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        };
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true});
        try{
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser: res.data});
            toast.success("Succesfully updated profile");
        }catch(error: any){
            const errorMessage =
                error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        }finally{
            set({isUpdatingProfile: false});
        };
    },

    connectSocket: () => {
        const { authUser } = get();
        // If there is no user or already connected. Don't create new socket
        if(!authUser || get().socket?.connected) return;

        // send userId to the backend (for online user handling)
        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id
            }
        });

        socket.connect();

        set({socket: socket});

        // Retrieve online user list from the backend
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },

}));