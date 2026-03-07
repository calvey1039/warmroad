import type { Metadata } from "next";
import { WarmPlacesLanding } from "@/components/WarmPlacesLanding";
import { getWarmLandingPage } from "@/lib/warm-places-landing-data";

const page = getWarmLandingPage("warm-places-from-new-york")!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.seoDescription,
};

export default function Page() {
  return <WarmPlacesLanding page={page} />;
}
