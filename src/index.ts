export class Storage<T = any> {
  private data: Map<string, T>;

  constructor() {
    this.data = new Map<string, T>();
  }

  /**
   * Get key name by index
   * @param n index
   * @returns key or undefined if index is out of bounds
   */
  public key(n: number): string | undefined {
    if (n < 0 || n >= this.data.size) return undefined;
    let i = 0;
    for (const key of this.data.keys()) {
      if (i === n) return key;
      i++;
    }
    return undefined;
  }

  /**
   * Get value by key
   * @param key The key to retrieve
   * @returns value if present else `undefined`
   */
  public getItem(key: string): T | undefined {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    }
    return this.data.get(key);
  }

  /**
   * Get multiple values by their keys
   * @param keys Array of keys
   * @returns Object with keys and their corresponding values
   */
  public multiGet(keys: string[]): Record<string, T | undefined> {
    if (!Array.isArray(keys)) {
      throw new TypeError('Keys must be an array');
    }
    const result: Record<string, T | undefined> = {};

    for (const key of keys) {
      if (typeof key !== 'string') {
        throw new TypeError('Each key must be a string');
      }
      result[key] = this.data.get(key);
    }

    return result;
  }

  /**
   * Get all key-value pairs
   * @returns Object with all keys and their corresponding values
   */
  public getAllItems(): Record<string, T> {
    const result: Record<string, T> = {};

    this.data.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * Get how many key-value pairs are stored
   */
  public get length(): number {
    return this.data.size;
  }

  /**
   * Store key-value pair
   * @param key The key to store the value under
   * @param value The value to store
   */
  public setItem(key: string, value: T) {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    }
    this.data.set(key, value);
  }

  /**
   * Store multiple key-value pairs
   * @param keyValuePairs Array of [key, value] pairs or object with key-value pairs
   */
  public multiSet(keyValuePairs: [string, T][] | Record<string, T>) {
    if (Array.isArray(keyValuePairs)) {
      for (const [key, value] of keyValuePairs) {
        if (typeof key !== 'string') {
          throw new TypeError('Each key must be a string');
        }
        this.data.set(key, value);
      }
    } else {
      for (const key in keyValuePairs) {
        if (typeof key !== 'string') {
          throw new TypeError('Each key must be a string');
        }
        const value = keyValuePairs[key];
        if (value !== undefined) {
          this.data.set(key, value);
        }
      }
    }
  }

  /**
   * Merge an object value with an existing value stored at the given key
   * @param key The key to merge the value under
   * @param value Object to merge
   * @returns The merged object or undefined if the existing value is not mergeable
   */
  public mergeItem(
    key: string,
    value: Record<string, any>
  ): Record<string, any> | undefined {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    }
    const existing = this.data.get(key);

    if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
      const merged = { ...existing, ...value };
      this.data.set(key, merged as T);
      return merged;
    } else if (!existing) {
      this.data.set(key, value as T);
      return value;
    }

    return undefined; // Return undefined if existing value is not mergeable
  }

  /**
   * Merge multiple objects with their corresponding values
   * @param keyValuePairs Array of [key, value] pairs or object with key-value pairs
   * @returns Object with keys and their merged values
   */
  public multiMerge(
    keyValuePairs: [string, Record<string, any>][] | Record<string, Record<string, any>>
  ): Record<string, Record<string, any> | undefined> {
    const results: Record<string, Record<string, any> | undefined> = {};

    if (Array.isArray(keyValuePairs)) {
      for (const [key, value] of keyValuePairs) {
        if (typeof key !== 'string') {
          throw new TypeError('Each key must be a string');
        }
        results[key] = this.mergeItem(key, value);
      }
    } else {
      for (const key in keyValuePairs) {
        if (typeof key !== 'string') {
          throw new TypeError('Each key must be a string');
        }
        const value = keyValuePairs[key];
        if (value !== undefined) {
          results[key] = this.mergeItem(key, value);
        }
      }
    }

    return results;
  }

  /**
   * Removes value by key
   * @param key The key to remove
   */
  public removeItem(key: string) {
    if (typeof key !== 'string') {
      throw new TypeError('Key must be a string');
    }
    this.data.delete(key);
  }

  /**
   * Remove multiple values by their keys
   * @param keys Array of keys to remove
   */
  public multiRemove(keys: string[]) {
    if (!Array.isArray(keys)) {
      throw new TypeError('Keys must be an array');
    }
    for (const key of keys) {
      if (typeof key !== 'string') {
        throw new TypeError('Each key must be a string');
      }
      this.data.delete(key);
    }
  }

  /**
   * Clear all key-value pairs
   */
  public clear() {
    this.data.clear();
  }

  /**
   * Get all keys
   * @returns Array of all keys
   */
  public getAllKeys(): string[] {
    return [...this.data.keys()];
  }
}

const SessionStorage = new Storage();

export default SessionStorage;
