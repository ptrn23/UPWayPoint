import HomePage from "@/components/MapProvider";
import { Suspense } from "react";

export default function Home() {
  return <Suspense><HomePage apiKey={process.env.GOOGLE_MAPS_API_KEY || ""} /></Suspense>
}