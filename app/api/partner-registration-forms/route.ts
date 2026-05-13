import { NextResponse } from "next/server";
import { getCmsOriginFromEnvUrl } from "@/lib/cms-origin";

type PartnerBody = {
  firstname?: string;
  lastname?: string;
  Partner_type?: string;
  email?: string;
  phonenumber?: string;
  company?: string;
  business_address?: string;
};

export async function POST(request: Request) {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL;
  const token =
    process.env.CMS_API_TOKEN ?? process.env.STRAPI_API_TOKEN ?? "";

  if (!configuredUrl) {
    return NextResponse.json(
      { error: "CMS_API_URL is not configured" },
      { status: 500 },
    );
  }

  // Token is optional: if Strapi → Settings → Users & Permissions → Public
  // has "create" on Partner Registration Form, anonymous POST works without a token.
  // If create is not public, set CMS_API_TOKEN (server-only) with an API token that can create.

  const plural =
    process.env.CMS_PARTNER_REGISTRATION_PLURAL ?? "partner-registration-forms";
  const origin = getCmsOriginFromEnvUrl(configuredUrl);
  const url = `${origin}/api/${plural}`;

  let body: PartnerBody;
  try {
    body = (await request.json()) as PartnerBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required: (keyof PartnerBody)[] = [
    "firstname",
    "lastname",
    "Partner_type",
    "email",
    "phonenumber",
    "company",
    "business_address",
  ];
  for (const key of required) {
    if (!body[key] || String(body[key]).trim() === "") {
      return NextResponse.json(
        { error: `Missing field: ${key}` },
        { status: 400 },
      );
    }
  }

  const strapiPayload = {
    data: {
      firstname: body.firstname!.trim(),
      lastname: body.lastname!.trim(),
      Partner_type: body.Partner_type!.trim(),
      email: body.email!.trim(),
      phonenumber: body.phonenumber!.trim(),
      company: body.company!.trim(),
      business_address: body.business_address!.trim(),
    },
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(strapiPayload),
    });

    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text };
    }

    if (!res.ok) {
      console.error("Strapi partner-registration POST failed:", res.status, parsed);
      return NextResponse.json(
        {
          error: "Strapi rejected the submission",
          upstreamStatus: res.status,
          details: parsed,
        },
        {
          status:
            res.status >= 400 && res.status < 600 ? res.status : 502,
        },
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Partner registration proxy error:", error);
    return NextResponse.json(
      { error: "Unexpected error while submitting to Strapi" },
      { status: 500 },
    );
  }
}
