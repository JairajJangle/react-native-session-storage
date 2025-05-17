export class Storage<T = unknown> {
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
    return Array.from(this.data.keys())[n];
  }

  /**
   * Get value by key
   * @param key The key to retrieve
   * @returns value if present else `undefined`
   */
  public getItem(key: string): T | undefined {
    if (typeof key !== "string") {
      throw new TypeError("Key must be a string");
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
      throw new TypeError("Keys must be an array");
    }
    const result: Record<string, T | undefined> = {};

    for (const key of keys) {
      if (typeof key !== "string") {
        throw new TypeError("Each key must be a string");
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
  public setItem(key: string, value: T): void {
    if (typeof key !== "string") {
      throw new TypeError("Key must be a string");
    }
    this.data.set(key, value);
  }

  /**
   * Store multiple key-value pairs
   * @param keyValuePairs Array of [key, value] pairs or object with key-value pairs
   */
  public multiSet(keyValuePairs: [string, T][] | Record<string, T>): void {
    if (Array.isArray(keyValuePairs)) {
      for (const [key, value] of keyValuePairs) {
        if (typeof key !== "string") {
          throw new TypeError("Each key must be a string");
        }
        if (value !== undefined) {
          this.data.set(key, value);
        }
      }
    } else {
      for (const key in keyValuePairs) {
        if (typeof key !== "string") {
          throw new TypeError("Each key must be a string");
        }
        const value = keyValuePairs[key];
        if (value !== undefined) {
          this.data.set(key, value);
        }
      }
    }
  }

  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
  ): Record<string, unknown> {
    // Create a copy of the target
    const result = { ...target };

    // Process each property in the source
    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = result[key];

      // More explicit checks for object types (excludes null and arrays)
      if (
        key in result &&
        targetValue !== null &&
        typeof targetValue === 'object' && !Array.isArray(targetValue) &&
        sourceValue !== null &&
        typeof sourceValue === 'object' && !Array.isArray(sourceValue)
      ) {
        result[key] = this.deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        result[key] = sourceValue;
      }
    }

    return result;
  }

  /**
   * Merge an object value with an existing value stored at the given key
   * @param key The key to merge the value under
   * @param value Object to merge
   * @returns The merged object or undefined if the existing value is not mergeable
   */
  public mergeItem(
    key: string,
    value: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (typeof key !== "string") {
      throw new TypeError("Key must be a string");
    }

    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("Value must be a non-array object for merging");
    }

    const existing = this.data.get(key);

    if (existing && typeof existing === "object" && !Array.isArray(existing)) {
      const merged = this.deepMerge(existing as Record<string, unknown>, value);
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
    keyValuePairs:
      | [string, Record<string, unknown>][]
      | Record<string, Record<string, unknown>>
  ): Record<string, Record<string, unknown> | undefined> {
    const results: Record<string, Record<string, unknown> | undefined> = {};

    if (Array.isArray(keyValuePairs)) {
      for (const [key, value] of keyValuePairs) {
        if (typeof key !== "string") {
          throw new TypeError("Each key must be a string");
        }
        results[key] = this.mergeItem(key, value);
      }
    } else {
      for (const key in keyValuePairs) {
        if (typeof key !== "string") {
          throw new TypeError("Each key must be a string");
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
  public removeItem(key: string): void {
    if (typeof key !== "string") {
      throw new TypeError("Key must be a string");
    }
    this.data.delete(key);
  }

  /**
   * Remove multiple values by their keys
   * @param keys Array of keys to remove
   */
  public multiRemove(keys: string[]): void {
    if (!Array.isArray(keys)) {
      throw new TypeError("Keys must be an array");
    }
    for (const key of keys) {
      if (typeof key !== "string") {
        throw new TypeError("Each key must be a string");
      }
      this.data.delete(key);
    }
  }

  /**
   * Clear all key-value pairs
   */
  public clear(): void {
    this.data.clear();
  };

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
