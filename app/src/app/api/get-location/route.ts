import { NextResponse } from "next/server";
import { getClientIp } from "@/utils/helpers/getClientIp";

export async function GET() {
  try {
    const ip = getClientIp();

    const res = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!res.ok) {
      console.error("IP API fetch failed:", res.status);
      return NextResponse.json(
        { error: "Could not get the location" },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!data || !data.city) {
      console.warn("No data on the city:", data);
      return NextResponse.json(
        { error: "Location data is incomplete" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ip,
      city: data.city,
      region: data.region,
      country: data.country_name
    });
  } catch (error) {
    console.error("Error when receiving a location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
