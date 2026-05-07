import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "CMS_API_URL is not configured" },
      { status: 500 },
    );
  }

  // 环境变量里已经配置了完整的 categories 接口地址
  // 例如：https://.../api/categories?populate=*
  const url = baseUrl;

  try {
    const res = await fetch(url, {
      // This runs on the server; Strapi URL is never sent to the browser.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories from CMS" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories from CMS:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching categories" },
      { status: 500 },
    );
  }
}

