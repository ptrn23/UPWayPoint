export const PIN_CATEGORIES = [
  { id: "academic", label: "ACADEMIC", color: "var(--pin-academic)" },
  { id: "food", label: "FOOD", color: "var(--pin-food)" },
  { id: "social", label: "SOCIAL", color: "var(--pin-social)" },
  { id: "transit", label: "TRANSIT", color: "var(--pin-transit)" },
  { id: "utility", label: "UTILITY", color: "var(--pin-utility)" },
] as const;

export type PinCategory = (typeof PIN_CATEGORIES)[number]["id"];
export type FilterType = "all" | PinCategory;

export const getPinColor = (type: string) => {
  const normalizedType = type.toLowerCase();
  const category = PIN_CATEGORIES.find((c) => c.id === normalizedType);
  return category ? category.color : "var(--text-primary)";
};
