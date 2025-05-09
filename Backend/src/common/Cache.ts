const cache: Record<string, { etag: string; data: any }> = {};

export function getCache(key: string) {
  return cache[key];
}

export function setCache(key: string, data: any) {
  cache[key] = data;
}

export function deleteCache(key: string) {
  delete cache[key];
}

export async function getOrAddCache(key: string, callback: () => Promise<any>) {
  const cached = getCache(key);
  if (cached) {
    return cached;
  }
  const data = await callback();
  setCache(key, data);
  return data;
}
