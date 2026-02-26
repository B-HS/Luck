export const createLruCache = <T>(maxSize: number) => {
  const cache = new Map<string, T>();

  return {
    get: (key: string): T | undefined => {
      const value = cache.get(key);
      if (value !== undefined) {
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },
    set: (key: string, value: T) => {
      cache.delete(key);
      cache.set(key, value);
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) cache.delete(firstKey);
      }
    },
    size: () => cache.size,
  };
};
