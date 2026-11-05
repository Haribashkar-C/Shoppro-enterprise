import { NextRequest } from "next/server";
const hits = new Map<string,{count:number;reset:number}>();
export function rateLimit(req:NextRequest,key:string,limit=12,windowMs=60_000) {
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const id=key+":"+ip, now=Date.now(), entry=hits.get(id);
  if (!entry || entry.reset < now) { hits.set(id,{count:1,reset:now+windowMs}); return true; }
  entry.count++; return entry.count<=limit;
}
