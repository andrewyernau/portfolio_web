import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { AppConfig } from "./config";

export type CoarseUserAgent = {
  deviceClass: "bot" | "desktop" | "mobile" | "tablet" | "unknown";
  family: "bot" | "chrome" | "cli" | "edge" | "firefox" | "safari" | "other" | "unknown";
};

function ipv4ToHextets(value: string): [string, string] {
  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    throw new Error("invalid IPv4 tail");
  }
  return [((parts[0]! << 8) | parts[1]!).toString(16), ((parts[2]! << 8) | parts[3]!).toString(16)];
}

function expandIpv6(value: string): number[] {
  const clean = value.split("%")[0]!.toLowerCase();
  const halves = clean.split("::");
  if (halves.length > 2) throw new Error("invalid IPv6 address");
  const parseHalf = (half: string): string[] => {
    if (!half) return [];
    const pieces = half.split(":");
    const last = pieces.at(-1);
    if (last?.includes(".")) pieces.splice(-1, 1, ...ipv4ToHextets(last));
    return pieces;
  };
  const left = parseHalf(halves[0] ?? "");
  const right = parseHalf(halves[1] ?? "");
  const zeros = halves.length === 2 ? 8 - left.length - right.length : 0;
  const pieces = [...left, ...Array.from({ length: zeros }, () => "0"), ...right];
  if (pieces.length !== 8) throw new Error("invalid IPv6 address");
  return pieces.map((piece) => {
    if (!/^[0-9a-f]{1,4}$/.test(piece)) throw new Error("invalid IPv6 address");
    return Number.parseInt(piece, 16);
  });
}

export function truncateIpPrefix(ip: string): string {
  const clean = ip.trim().replace(/^\[|\]$/g, "");
  const version = isIP(clean);
  if (version === 4) {
    const parts = clean.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }
  if (version === 6) {
    const parts = expandIpv6(clean);
    return `${parts.slice(0, 3).map((part) => part!.toString(16).padStart(4, "0")).join(":")}::/48`;
  }
  return "unknown";
}

export function dailyVisitorHash(ip: string, secret: string, at = new Date()): string {
  const day = at.toISOString().slice(0, 10);
  return createHmac("sha256", secret).update(`${day}|${truncateIpPrefix(ip)}`).digest("hex").slice(0, 32);
}

export function coarseUserAgent(raw: string | undefined): CoarseUserAgent {
  if (!raw) return { deviceClass: "unknown", family: "unknown" };
  const ua = raw.toLowerCase();
  if (/bot|crawler|spider|slurp|preview/.test(ua)) return { deviceClass: "bot", family: "bot" };
  if (/curl\/|wget\/|httpie\//.test(ua)) return { deviceClass: "unknown", family: "cli" };
  const deviceClass = /ipad|tablet|kindle/.test(ua)
    ? "tablet"
    : /mobile|iphone|ipod|android/.test(ua)
      ? "mobile"
      : "desktop";
  const family = /edg\//.test(ua)
    ? "edge"
    : /firefox\//.test(ua)
      ? "firefox"
      : /chrome\//.test(ua)
        ? "chrome"
        : /safari\//.test(ua)
          ? "safari"
          : "other";
  return { deviceClass, family };
}

export function analyticsOptedOut(headers: Headers): boolean {
  return headers.get("dnt") === "1" || headers.get("sec-gpc") === "1";
}

export function isTrustedProxy(remoteAddress: string | undefined, config: AppConfig): boolean {
  if (!config.TRUST_PROXY || !remoteAddress) return false;
  if (config.trustedProxyAddresses.size > 0) return config.trustedProxyAddresses.has(remoteAddress);
  return config.TRUSTED_PROXY_HOPS > 0;
}

export function resolveClientIp(headers: Headers, remoteAddress: string | undefined, config: AppConfig): string {
  if (isTrustedProxy(remoteAddress, config)) {
    const chain = headers.get("x-forwarded-for")?.split(",").map((value) => value.trim()).filter(Boolean) ?? [];
    const forwarded = chain.at(-config.TRUSTED_PROXY_HOPS) ?? chain[0];
    if (forwarded && isIP(forwarded)) return forwarded;
  }
  return remoteAddress && isIP(remoteAddress) ? remoteAddress : "unknown";
}

export function resolveCountry(headers: Headers, remoteAddress: string | undefined, config: AppConfig): string {
  if (!isTrustedProxy(remoteAddress, config)) return "ZZ";
  const candidate = headers.get(config.COUNTRY_HEADER)?.toUpperCase();
  return candidate && /^[A-Z]{2}$/.test(candidate) ? candidate : "ZZ";
}
