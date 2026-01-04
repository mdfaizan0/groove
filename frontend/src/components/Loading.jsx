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
                <div className="flex items-center gap-3">
                    <img
                        src="/favicon/favicon-32x32.png"
                        alt="Groove"
                        className="w-6 h-6 opacity-90"
                    />
                    <h2 className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary via-foreground to-primary bg-size-[200%_auto] animate-gradient-move bg-clip-text text-transparent">
                        Groove
                    </h2>
                </div>
            </div>
        </div>
    </div>
);

export default Loading;