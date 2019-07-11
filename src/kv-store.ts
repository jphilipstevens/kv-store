import { isDefined } from "./function-extensions";
import { getCurrentUTCTimestamp } from "./utc-timestamp";

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
    [key: string]: Array<HashNode<V>>;
  };

  private size: number;

  constructor() {
    this.map = {};
    this.size = 0;
  }

  public getSize(): number {
    return this.size;
  }

  public containsKey(key: string): boolean {
    return this.map.hasOwnProperty(key);
  }

  public put(key: string, value: V): number {
    const node = new HashNode(value);
    if (!this.containsKey(key)) {
      this.size++;
      this.map[key] = [node];
    } else {
      this.map[key].push(node)
    }
    return node.timestamp;
  }

  public getValue(key: string): V | undefined {
    if (this.containsKey(key)) {
      const bucket = this.map[key];
      const latestValue = bucket.length - 1;
      return bucket[latestValue].value;
    } else {
      return undefined
    }
  }

  public getValueAtTime(key: string, timestamp: number): V | undefined {
    const map = this.map[key];
    if (isDefined(map)) {
      return this.getValueFuzzy(map, timestamp, 0, map.length - 1);
    } else {
      return undefined;
    }
  }

  private getValueFuzzy(nodes: Array<HashNode<V>>, timestamp: number, left: number, right: number): V | undefined {
    if (right > left) {
      const mid = Math.trunc((left + right + 1) / 2);
      if (nodes[mid].timestamp < timestamp) {
        return this.getValueFuzzy(nodes, timestamp, mid, right);
      } else {
        let n: HashNode<V> | undefined;
        for (let i = mid; i >= left; i--) {
          if (nodes[i].timestamp <= timestamp) {
            n = nodes[i];
            break;
          }
        }
        return isDefined(n) ? n.value : undefined;
      }
    } else {
      return nodes[right].timestamp <= timestamp
        ? nodes[right].value
        : undefined;
    }
  }
}