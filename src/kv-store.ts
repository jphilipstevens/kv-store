import { isDefined } from "./function-extensions";
import { getCurrentUTCTimestamp } from "./utc-timestamp";

type Predicate<V> = (value: HashNode<V>) => boolean;

export class HashNode<V> {
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

  public getSize(): number {
    return this.size;
  }

  public containsKey(key: string):  boolean {
    return this.map.hasOwnProperty(key);
  }

  public put(key: string, value: V): void {
    const node = new HashNode(value);
    if (!this.containsKey(key)) {
      this.size++;
      this.map[key] = [node];
    } else {
      this.map[key].push(node)
    }
  }

  public getValue(key: string): V |  undefined {
    if (this.containsKey(key)) {
      const bucket = this.map[key];
      const latestValue = bucket.length - 1;
      return bucket[latestValue].value;
    } else {
      return undefined
    }
  }

  public getValueAtTime(key: string, timestamp: number): V | undefined {
    return this.find(key, (node) => node.timestamp === timestamp);
  }

  private find(key: string, predicate: Predicate<V>): V | undefined {
    if (this.containsKey(key)) {
      const bucket = this.map[key];
      const foundNode = bucket.find(predicate);
      if(isDefined<HashNode<V>>(foundNode)) {
        return foundNode.value;
      } else  {
        return undefined;
      }
    } else {
      return undefined
    }
  }
}