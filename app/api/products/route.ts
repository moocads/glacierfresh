import { NextResponse } from "next/server";

type StrapiProductsResponse = {
  data?: unknown[];
  meta?: {
    pagination?: {
      page?: number;
      pageCount?: number;
      pageSize?: number;
      total?: number;
    };
  };
};

function getProductsUrl(configuredUrl: string, page: number) {
  const trimmed = configuredUrl.replace(/\/$/, "");
  const url = new URL(
    trimmed.includes("/api/")
      ? trimmed.replace(/\/api\/[^?]+/, "/api/products")
      : `${trimmed}/api/products`,
  );

  if (!url.searchParams.has("populate")) {
    url.searchParams.set("populate", "*");
  }
  url.searchParams.set("pagination[page]", String(page));
  url.searchParams.set("pagination[pageSize]", "100");
  if (!url.searchParams.has("sort[0]")) {
    url.searchParams.set("sort[0]", "sortOrder:asc");
    url.searchParams.set("sort[1]", "id:asc");
  }

  return url.toString();
}

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

  try {
    const firstRes = await fetch(getProductsUrl(configuredUrl, 1), {
      next: { revalidate: 60 },
    });

    if (!firstRes.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch products from CMS",
          upstreamStatus: firstRes.status,
        },
        { status: 500 },
      );
    }

    const firstPage = (await firstRes.json()) as StrapiProductsResponse;
    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1;
    const allData = Array.isArray(firstPage.data) ? [...firstPage.data] : [];

    for (let page = 2; page <= pageCount; page += 1) {
      const res = await fetch(getProductsUrl(configuredUrl, page), {
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

      const pageData = (await res.json()) as StrapiProductsResponse;
      if (Array.isArray(pageData.data)) {
        allData.push(...pageData.data);
      }
    }

    return NextResponse.json({
      ...firstPage,
      data: allData,
      meta: {
        ...firstPage.meta,
        pagination: {
          ...firstPage.meta?.pagination,
          page: 1,
          pageSize: allData.length,
          pageCount: 1,
          total: allData.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products from CMS:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching products" },
      { status: 500 },
    );
  }
}
