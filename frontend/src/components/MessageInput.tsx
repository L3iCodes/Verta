import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore";
import { X, Image, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageInput(){
    const [text, setText] = useState<string>("");
    const [imgPreview, setImgPreview] = useState<string | ArrayBuffer | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { sendMessage } = useChatStore()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file?.type.startsWith("image/")) {
            toast.remove("Please select an image file");
            return;
        };

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImgPreview(reader.result);
        };
    };

    const removeImage = () => {
        setImgPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!text.trim() && !imgPreview) return;

        try{
            await sendMessage({
                text: text.trim(),
                image: imgPreview,
            })

            setText("");
            setImgPreview(null);
            if(fileInputRef.current) fileInputRef.current.value="";

        }catch(error){
            console.log("Failed to send message", error)
            toast.error("Filed to send message")
        }
    };

    return(
        <div className="p-4 w-full mt-auto">
            {/* Show image to be sent */}
            {imgPreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imgPreview as string}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        
                        <button
                            onClick={removeImage}
                            className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 
                                        flex items-center justify-center`}
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>    
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    {/* Call the input for file ^ (code above) */}
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                                    ${imgPreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imgPreview}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    )
};