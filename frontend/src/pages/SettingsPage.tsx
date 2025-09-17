import { Send } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const PREVIEW_MESSAGES = [
    {id: 1, content: "Hey, How's it going?", isSent: false},
    {id: 2, content: "I'm doing great! just working on some new features", isSent: true}
];

export default function SettingsPage(){
    const { theme, setTheme } = useThemeStore();

    return(
        <div className="h-screen mx-auto px-4 pt-20 max-w-5xl">
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Theme</h2>
                    <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {THEMES.map((t) => (
                        <button 
                            key={t}
                            className={`
                                 group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                                ${theme === t ? "bg-base-200 border-1" : "hover:bg-base-200/90"}    
                            `}
                            onClick={() => setTheme(t)}
                        >
                            <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                    <div className="rounded bg-primary" />
                                    <div className="rounded bg-secondary" />
                                    <div className="rounded bg-accent" />
                                    <div className="rounded bg-neutral" />
                                </div>
                            </div>
                            <span className="text-[11px] font-medium truncate w-full text-center">
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Preview</h2>
                    <div className="flex bg-base-300 w-full h-full rounded-xs p-5 justify-center">
                        <div className="flex flex-col w-xl bg-base-100 p-2 gap-3 border-1">
                            <div className="flex gap-2">
                                <div className="w-[30px] h-[30px] bg-accent  rounded-full"/>
                                <div>   
                                    <h1 className="text-sm font-semibold">Wilhelm</h1>
                                    <p className="text-xs text-secondary">Online</p>
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-2 p-2">
                                <div className="bg-neutral w-fit p-2 rounded-xs space-y-1">
                                    <p className="text-xs font-medium">"Hey, How's it going?"</p>
                                    <p className="text-[11px] text-neutral-content/60">12:00 PM</p>
                                </div>

                                <div className="self-end bg-primary text-neutral w-fit p-2 rounded-xs space-y-1">
                                    <p className="text-xs font-medium">"I'm doing great! just working on some new features?"</p>
                                    <p className="text-[11px] text-neutral/90">12:00 PM</p>
                                </div>

                                <div className="flex w-full p-1 bg-base-300 mt-4 gap-2">
                                    <p className="text-sm p-1 w-full">This is a message</p>
                                    <div className="bg-accent h-full px-2 py-1 text-neutral rounded-sm">
                                        <Send />
                                    </div>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};