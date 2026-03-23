export const PIN_CATEGORIES = [
    { id: "academic", label: "ACADEMIC", color: "#FF3366" },
    { id: "food", label: "FOOD", color: "#00FF99" },
    { id: "social", label: "SOCIAL", color: "#B026FF" },
    { id: "transit", label: "TRANSIT", color: "#FFD700" },
    { id: "utility", label: "UTILITY", color: "#00E5FF" },
] as const;

export type PinCategory = typeof PIN_CATEGORIES[number]["id"];
export type FilterType = "all" | PinCategory;

export const getPinColor = (type: string) => {
    const normalizedType = type.toLowerCase();
    const category = PIN_CATEGORIES.find((c) => c.id === normalizedType);
    return category ? category.color : "var(--text-primary)";
};