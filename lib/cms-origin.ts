/** Derive Strapi origin from CMS_API_URL (base or full /api/... URL). */
export function getCmsOriginFromEnvUrl(configuredUrl: string): string {
  const trimmed = configuredUrl.replace(/\/$/, "");
  if (trimmed.includes("/api/")) {
    return trimmed.replace(/\/api\/.*$/, "");
  }
  return trimmed;
}
