const Loading = () => (
    <div className="flex items-center justify-center h-screen w-full bg-background text-foreground font-sans selection:bg-primary/20">
        <div className="flex flex-col items-center gap-8">
            <div className="flex items-end gap-1.5 h-16">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '0.6s'
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
                        <span className="text-primary-foreground font-black text-[10px] italic">G</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tighter bg-linear-to-r from-primary via-foreground to-primary bg-size-[200%_auto] animate-gradient-move bg-clip-text text-transparent">Groove</h2>
                </div>
            </div>
        </div>
    </div>
);

export default Loading;