import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps){
    const {authUser, isCheckingAuth} = useAuthStore();
    const navigate = useNavigate();

    // ⬇️ Run navigation AFTER checking auth
    useEffect(() => {
        if (!isCheckingAuth && !authUser) {
            navigate("/login", { replace: true });
        }
    }, [isCheckingAuth, authUser, navigate]);
    
    if(isCheckingAuth) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-screen'>
            <span className="loading loading-bars loading-xl"></span>
            <p>Checking Authorization</p>
            </div>
        );
    };

    return(
        <>
            {children}
        </>
    );
};