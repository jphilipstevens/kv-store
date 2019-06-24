import { isDefined } from "./function-extensions";
import { getCurrentUTCTimestamp } from "./utc-timestamp";

type Predicate<V> = (value: HashNode<V>) => boolean;

class HashNode<V> {
  public readonly value: V;
  public readonly timestamp: number;

  constructor(value: V) {
    this.value = value;
    this.timestamp = getCurrentUTCTimestamp();
  }
}

export class Store<V> {
  private readonly map: {
    [key: string]: HashNode<V>[];
  };

  private size: number;

  constructor() {
    this.map = {};
    this.size = 0;
  }

  /** 
   * @returns the number of objects saved (excluding updated versions)
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * @param key A key that may or may not be in the Store
   * @returns true if they key is in the store, false otherwise
   */
  public containsKey(key: string): boolean {
    return this.map.hasOwnProperty(key);
  }

  /**
   * 
   * @param key a unique key to save the value
   * @param value some data to persist
   */
  public put(key: string, value: V): void {
    const node = new HashNode(value);
    if (!this.containsKey(key)) {
      this.size++;
      this.map[key] = [node];
    } else {
      this.map[key].push(node)
    }
  }

  /**
   * 
   * @param key a unique key bound to the value being requested
   * @returns the latest version of the saved value, or undefined if no key could be found
   */
  public getValue(key: string): V | undefined {
    if (this.containsKey(key)) {
      const bucket = this.map[key];
      const latestValue = bucket.length - 1;
      return bucket[latestValue].value;
    } else {
      return undefined
    }
  }

  /**
   * 
   * @param key a unique key bound to the value being requested
   * @param timestamp a timestamp that can be used for getting a version. Note timestamp matches are exact
   * @returns the saved value at the timestamp requested, or undefined if no key could be found
   */
  public getValueAtTime(key: string, timestamp: number): V | undefined {
    return this.find(key, (node) => node.timestamp === timestamp);
  }

  private find(key: string, predicate: Predicate<V>): V | undefined {
    if (this.containsKey(key)) {
      const bucket = this.map[key];
      const foundNode = bucket.find(predicate);
      if (isDefined<HashNode<V>>(foundNode)) {
        return foundNode.value;
      } else {
        return undefined;
      }
    } else {
      return undefined
    }
  }
}