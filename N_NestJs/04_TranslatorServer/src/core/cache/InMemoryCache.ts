export class InMemoryCache {
  private cache = new Map<string, Record<string, any>>();

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: Record<string, any>) {
    this.cache.set(key, value);
    this.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  deleteByPrefix(prefix: string) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}
