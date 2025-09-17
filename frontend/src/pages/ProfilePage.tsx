import { useAuthStore } from "../store/useAuthStore";
import sampleImage from "../assets/react.svg"
import { Camera, User} from "lucide-react";

export default function ProfilePage(){
    const { authUser, isUpdatingProfile, updateProfile} = useAuthStore();

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if(!file) return;

        // Read file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        

        // Upload image
        reader.onload = async() => {
            const base64Image = reader.result;
            await updateProfile({profilePic: base64Image});
        };
    };

    return(
        <div className="min-h-screen">
            <div className="min-h-screen flex items-center justify-center py-8 ">
                <div className="bg-base-300 max-w-xl rounded-xl p-10 px-20 space-y-8 ">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2 text-neutral-content/60">Your profile information</p>
                    </div>

                    {/* Avatar upload section */}
                    <div className="flex flex-col items-center gap-4 ">
                        <div className="relative">
                            <img 
                                src={authUser?.profilePic || sampleImage}
                                alt='Profile'
                                className="size-32 rounded-full object-cover border-4"
                            />
                            <label 
                                htmlFor="avatar-upload"
                                className={`flex items-center bg-primary w-fit p-1 rounded-full absolute bottom-0 right-0 cursor-pointer hover:bg-secondary active:bg-primary
                                            transition-all duration-200
                                            ${isUpdatingProfile && "animate-pulse pointer-events-none"}`}
                                >
                                <Camera size={30}/>
                                <input 
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-[12px] text-neutral-content/60">Click the camera icon to update profile</p>
                    </div>

                    {/* User Information */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text font-medium self-start">Full Name</span>
                            </label>
                            <div className="flex items-center gap-2 w-full border-1 border-neutral-content/50 py-1 px-2 rounded-sm">
                                <User className="size-5 text-neutral-content/50"/>
                                <input 
                                    type="text" 
                                    name="fullName" 
                                    placeholder="Jane Doe" 
                                    className="w-full"
                                    value={authUser?.fullName}
                                    readOnly={true}
                                    disabled={true}
                                    />
                            </div>
                        </div>

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
                                    value={authUser?.email}
                                    readOnly={true}
                                    disabled={true}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};