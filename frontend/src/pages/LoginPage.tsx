import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, User, Eye, EyeClosed, LockKeyhole } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormProps {
    email: string;
    password: string;
};

export default function LoginPage(){
    const { login, isLoggingIn } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const [formData, setFormData] = useState<FormProps>({
        email: "",
        password: "",
    });

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return toast.error("Please enter a valid email address");
        }
        if (!formData.password.trim()) return toast.error("Password is required");
        return true;
    };
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const success = validateForm();
        console.log(formData)
        if(success === true) login(formData);
    };

    return(
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="flex flex-col w-full max-w-xs space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
                                            group-hover:bg-primary/50 transition-colors"
                                >
                                    <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Login</h1>
                            <p className="text-base-content/60">Connect to the world of familiarity</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col justify-center gap-4 !text-border-neutral-content/50">
                            {/* Email Input */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-medium self-start">Email</span>
                                </label>
                                <div className="flex items-center gap-2 w-full border-1 border-neutral-content/50 py-1 px-2 rounded-sm">
                                    <User className="size-5 text-neutral-content/50"/>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        placeholder="johndoe@gmail.com" 
                                        className="w-full"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                                </div>
                            </div>
                            {/* Password Input */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-medium self-start">Password</span>
                                </label>
                                <div className="flex items-center gap-2 w-full border-1 border-neutral-content/50 py-1 px-2 rounded-sm">
                                    <LockKeyhole className="size-5 text-neutral-content/50"/>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Your password" 
                                        className="w-full"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                                    {showPassword 
                                        ? <Eye onClick={() => setShowPassword(p => !p)} className="size-5 text-neutral-content/50 cursor-pointer"/> 
                                        : <EyeClosed onClick={() => setShowPassword(p => !p)} className="size-5 text-neutral-content/50 cursor-pointer"/>}
                                </div>
                            </div>

                            <button type="submit" className="btn mt-2" disabled={isLoggingIn}>
                                {isLoggingIn 
                                    ? (
                                        <>
                                            Logging In
                                            <span className="loading loading-dots loading-xs"></span>
                                        </>
                                    )
                                    : (
                                        "Login"
                                    )
                                }            
                            </button>
                        </div>
                    </form>
                    <p className="text-[12px] self-end">
                        Don't have an account? 
                        <span onClick={() => navigate('/signup')} className="text-primary cursor-pointer ml-1">Create Account</span>
                    </p>
                </div>
            </div>

            <AuthImagePattern 
                title="Start chatting now!" 
                subtitle="Your journey starts here—learn, connect, and thrive." 
            />
        </div>
    );
};