import { Suspense } from "react";
import MapsProvider from "@/components/MapsProvider";

export default function Home() {
  return (
    <Suspense>
      <MapsProvider apiKey={process.env.GOOGLE_MAPS_API_KEY || ""} />
    </Suspense>
  )
}