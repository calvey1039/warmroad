import { NextResponse } from "next/server";
import { DEFAULT_GAS_PRICE } from "@/lib/distance";

const EIA_API_URL =
  "https://api.eia.gov/v2/petroleum/pri/gnd/data/?frequency=weekly&data[0]=value&facets[series][]=EMM_EPMR_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1";

export const revalidate = 3600; // Cache this route for 1 hour

export async function GET() {
  const apiKey = process.env.EIA_API_KEY || "DEMO_KEY";

  try {
    const response = await fetch(`${EIA_API_URL}&api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`EIA API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.response?.data?.[0]?.value) {
      return NextResponse.json({
        price: parseFloat(data.response.data[0].value),
        date: data.response.data[0].period,
        source: "U.S. national avg (EIA)",
      });
    }

    throw new Error("No data in EIA response");
  } catch (error) {
    console.error("Gas price API error:", error);
    return NextResponse.json({
      price: DEFAULT_GAS_PRICE,
      date: new Date().toISOString().split("T")[0],
      source: "default",
    });
  }
}
