// lib/rate-limit.ts
import { LRUCache } from "lru-cache";
// import { NextResponse } from "next/server";

type Options = { interval: number; limit: number };

export function rateLimit({ interval, limit }: Options) {
  const cache = new LRUCache<string, number[]>({ max: 500, ttl: interval });

  return function check(ip: string): boolean {
    const now = Date.now();
    const hits = (cache.get(ip) ?? []).filter((t) => now - t < interval);
    if (hits.length >= limit) return false;
    cache.set(ip, [...hits, now]);
    return true;
  };
}
