import { create  } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
  logout: () => Promise<void>;
  setAuthUser?: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    
    checkAuth: async() => {
        try{
            // Check if user is logged in
            const response = await axiosInstance.get("/auth/check");
            set({authUser:response.data});
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
        }catch(error: any){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false});
        };
    },
}));