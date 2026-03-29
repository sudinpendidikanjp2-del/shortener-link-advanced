import { UAParser } from "ua-parser-js";

export function parseUserAgent(userAgent: string | null) {
  if (!userAgent) {
    return { device: "Unknown", browser: "Unknown", os: "Unknown" };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    device: result.device.type || "Desktop",
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
  };
}

export async function getGeoLocation(
  ip: string | null,
): Promise<{ country: string; city: string }> {
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return { country: "Unknown", city: "Unknown" };
  }

  try {
    // Using ip-api.com free service (no API key needed, 45 requests/minute)
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,city`,
    );
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
      };
    }
  } catch {
    // Silently fail and return unknown
  }

  return { country: "Unknown", city: "Unknown" };
}
