import { Settings, Users, LogOut } from 'lucide-react';
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from 'react-router-dom';

export default function Navbar(){
    const navigate = useNavigate();
    const { logout, authUser } = useAuthStore();

    return(
        <header className="w-full bg-base-100 fixed top-0 z-40 backdrop-blur-lg">
            <div className="flex items-center mx-auto px-4 h-16 w-full">
                <h1 onClick={() => navigate('/')} className="text-lg font-bold cursor-pointer hover:text-primary active:text-primary/50">Message</h1>
                <div className="ml-auto flex item-center gap-4">
                    <div onClick={() => navigate('/setting')}className='flex items-center gap-2 cursor-pointer hover:bg-primary active:bg-primary/50 p-1 rounded-sm'>
                        <Settings className='w-5 h-5'/>
                        <span className='hidden sm:inline text-[12px]'> Settings </span>
                    </div>

                    {authUser && (
                        <>
                            <div onClick={() => navigate('/profile')} className='flex items-center gap-2 cursor-pointer hover:bg-primary active:bg-primary/50 p-1 rounded-sm'>
                                <Users className='w-5 h-5'/>
                                <span className='hidden sm:inline text-[12px]'> Profile </span>
                            </div>

                            <div onClick={logout} className='flex items-center gap-2 cursor-pointer hover:bg-primary active:bg-primary/50 p-1 rounded-sm'>
                                <LogOut className='w-5 h-5'/>
                                <span className='hidden sm:inline text-[12px]'> Logout </span>
                            </div>
                        </>
                    )}
                    
                </div>
            </div>
        </header>
    );
};