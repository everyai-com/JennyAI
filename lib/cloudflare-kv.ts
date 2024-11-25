declare global {
  const CALENDAR_KV: KVNamespace;
}

export async function getKVSession() {
  if (process.env.NODE_ENV === "development") {
    const { devKV } = await import("./dev-kv");
    return devKV;
  }
  return CALENDAR_KV;
}
