export interface Pin {
  id: string;
  icon: string;
  position: {lat: number, lng: number};
  title: string;
  type: "academic" | "food" | "social" | "transit" | "utility";
  description?: string;
}