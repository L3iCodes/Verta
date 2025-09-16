import { useAuthStore } from "../store/useAuthStore";

export default function HomePage(){
    const { logout } = useAuthStore();

    return(
        <div>
            HomePage
            <button onClick={logout}>Logout</button>
        </div>
    );
};