import { axiosInstance } from "../lib/axios";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
}

export const checkAuthAPI = async (): Promise<User> => {
    try{
        const response = await axiosInstance.get<User>("/auth/check");
        return response.data;
    }catch(error){
        console.log('Error in CheckAuth API:', error);
        throw error;
    };
};