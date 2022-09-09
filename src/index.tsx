// Original source: https://stackoverflow.com/a/67368639/7040601

export class Storage {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map<string, any>();
  }

  /**
   * Get key name by index
   * @param n index
   * @returns key
   */
  public key(n: number): string | undefined {
    return [...this.data.keys()][n];
  }

  /**
   * Get value by key
   * @param key
   * @returns value if present else `undefined`
   */
  public getItem(key: string) {
    return this.data.get(key);
  }

  /**
   * Get how many keys-value pairs are stored
   */
  public get length(): number {
    return this.data.size;
  }

  /**
   * Store key-value pair
   * @param key
   * @param value
   */
  public setItem(key: string, value: any) {
    this.data.set(key, value);
  }

  /**
   * Removes value by key
   * @param key
   */
  public removeItem(key: string) {
    this.data.delete(key);
  }

  /**
   * Clear all keys
   */
  public clear() {
    this.data = new Map<string, any>();
  }
}

const SessionStorage = new Storage();

export default SessionStorage;
