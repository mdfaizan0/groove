const CategoryFilter = ({ categories, selectedCategoryId, setSelectedCategoryId }) => {
    return (
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
            <button
                onClick={() => setSelectedCategoryId(null)}
                className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full border border-transparent transition-all duration-100 text-sm
                        ${selectedCategoryId === null ? "bg-primary text-primary-foreground font-semibold scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary"}`}
            >
                All
            </button>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full border border-transparent transition-all duration-100 text-sm
                        ${selectedCategoryId === category.id ? "bg-primary text-primary-foreground font-semibold scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary"}`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilter