import { create  } from "zustand";

interface ThemeState{
    theme: string;
    setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    // Set initial theme to chat-theme or light
    theme: localStorage.getItem("chat-theme") || "light",
    
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({theme});
    }
}));