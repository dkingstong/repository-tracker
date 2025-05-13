"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = getCache;
exports.setCache = setCache;
exports.deleteCache = deleteCache;
exports.getOrAddCache = getOrAddCache;
const cache = {};
function getCache(key) {
    return cache[key];
}
function setCache(key, data) {
    cache[key] = data;
}
function deleteCache(key) {
    // cacheKey can be like user-repositories:id:*
    const deleteAll = key.split('').pop() === '*';
    if (deleteAll) {
        const newKey = key.split('').slice(0, -1).join('');
        const keys = Object.keys(cache).filter(k => k.startsWith(newKey));
        keys.forEach(k => delete cache[k]);
    }
    else {
        delete cache[key];
    }
}
async function getOrAddCache(key, callback) {
    const cached = getCache(key);
    if (cached) {
        return cached;
    }
    const data = await callback();
    setCache(key, data);
    return data;
}
