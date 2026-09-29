import { redirect } from "next/navigation";

/**
 * The vehicle offer now lives on the home page, so `/vozila` redirects there.
 * Vehicle detail pages stay at `/vozila/<slug>`.
 */
export default function VehiclesIndexRedirect() {
  redirect("/");
}

