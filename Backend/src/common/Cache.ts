const cache: Record<string, { etag: string; data: any }> = {};

export function getCache(key: string) {
  return cache[key];
}

export function setCache(key: string, data: any) {
  cache[key] = data;
}

export function deleteCache(key: string) {
  // cacheKey can be like user-repositories:id:*
  const deleteAll = key.split('').pop() === '*';
  if (deleteAll) {
    const newKey = key.split('').slice(0, -1).join('');
    const keys = Object.keys(cache).filter(k => k.startsWith(newKey));
    keys.forEach(k => delete cache[k]);
  } else {
    delete cache[key];
  }
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
