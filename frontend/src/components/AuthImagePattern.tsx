interface AuthImageProps{
    title: string;
    subtitle: string;
};

export default function AuthImagePattern({ title, subtitle }: AuthImageProps){
    const pattern = Array.from({ length: 9 }).map((_, i) => (
        <div 
            key={i} 
            className="bg-primary/30 w-[100px] h-[100px] rounded-md animate-pulse" 
        />
    ));
    
    return(
        <div className="hidden lg:flex flex-col gap-2 items-center justify-center text-neutral-content/50">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3">
                    {pattern}
                </div>
            </div>
            
            <div className="flex flex-col text-center">
                {title}
                <p className="text-[12px]">{subtitle}</p>
            </div>
        </div>
    );
};