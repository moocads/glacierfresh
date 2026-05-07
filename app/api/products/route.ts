import { NextResponse } from "next/server";

export async function GET() {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL;

  if (!configuredUrl) {
    return NextResponse.json(
      {
        error:
          "CMS_API_URL is not configured. Add it in Vercel and/or .env.local for local dev.",
      },
      { status: 500 },
    );
  }

  const base = configuredUrl.replace(/\/$/, "");
  const url = base.includes("/api/categories")
    ? base.replace("/api/categories?populate=*", "/api/products?populate=*")
    : `${base}/api/products?populate=*`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch products from CMS",
          upstreamStatus: res.status,
        },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products from CMS:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching products" },
      { status: 500 },
    );
  }
}

