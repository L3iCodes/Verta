import { useQuery } from "@tanstack/react-query";
import { checkAuthAPI } from "../api/auth.api.ts"
// import type { User } from "../api/auth.api";

export default function useAuth(){
    const checkAuth = useQuery({
        queryKey: ['authenticateJWT'],
        queryFn: checkAuthAPI,
    });

    return {checkAuth} ;
};
