import { v4 } from 'uuid';
import { HashNode, Store } from '../kv-store';
import * as UTCTimestamp from "../utc-timestamp";

describe("HashNode", () => {
  it("should create a node with a timestamp", () => {
    const now = Date.now();
    jest
      .spyOn(UTCTimestamp, "getCurrentUTCTimestamp")
      .mockImplementationOnce(() => now);
    const value = v4();
    const node = new HashNode(value);

    expect(node.value).toBe(value);
    expect(node.timestamp).toBe(now);
  });
});

describe("Store", () => {
  describe('constructor', () => {
    it('should create an empty store', () => {
      const store = new Store<string>();
      expect(store.getSize()).toBe(0);
    });
  });

  describe("containsKey", () => {
    it("should return false for any empty map", () => {
      const store = new Store();
      expect(store.containsKey(v4())).toBe(false);
    });

    it("should return false for a key not saved", () => {
      const store = new Store();
      store.put(v4(), v4());
      expect(store.containsKey(v4())).toBe(false);

    });

    it("should return false for a null key passed to check", () => {
      const store = new Store();
      store.put(v4(), v4());
      expect(store.containsKey(null)).toBe(false);
    });

    it("should return true for a saved key", () => {
      const store = new Store();
      const key = v4();
      store.put(key, v4());
      expect(store.containsKey(key)).toBe(true);
    });

    it("should return true for a saved key of undefined", () => {
      const store = new Store();
      store.put(undefined, v4());
      expect(store.containsKey(undefined)).toBe(true);
    });
  });

  describe('getSize', () => {
    it('should initially be 0', () => {
      const store = new Store<string>();
      expect(store.getSize()).toBe(0);
    });

    it('should increment by 1 when a new value is added', () => {
      const store = new Store<string>();
      store.put(v4(), v4());
      expect(store.getSize()).toBe(1);
    });

    it('should not increment when the same key is updated', () => {
      const store = new Store<string>();
      const key = v4();
      store.put(key, v4());
      expect(store.getSize()).toBe(1);
      store.put(key, v4());
      expect(store.getSize()).toBe(1);
    });
  });

  describe("put", () => {
    it("should store a value an return the timestamp that it was saved", () => {
      const now = Date.now();
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => now);
      const store = new Store();

      const timestamp = store.put(v4(), v4());
      expect(timestamp).toBe(now);
    });
  });

  describe('getValue', () => {
    it('return undefined for an empty store', () => {
      const store = new Store<string>();
      expect(store.getValue(v4())).toBe(undefined);
    });

    it('return a saved value', () => {
      const store = new Store<string>();
      const key = v4();
      const value = v4();
      store.put(key, value);

      expect(store.getValue(key)).toBe(value);
    });

    it('return undefined for a key that does  not exist', () => {
      const store = new Store<string>();
      const key = v4();
      const value = v4();
      store.put(key, value);

      expect(store.getValue(v4())).toBe(undefined);
    });

    it('return the latest saved value', () => {
      const store = new Store<string>();
      const key = v4();
      store.put(key, v4());
      const value = v4();
      store.put(key, value);

      expect(store.getValue(key)).toBe(value);
    });

  });

  describe("getValueAtTime", () => {

    const fuzzyTest = (sampleSize: number) => () => {

      let now = 0;
      const millisecondsInAMinute = 60000;

      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => {
          const dateToSave = now + millisecondsInAMinute;
          now = dateToSave;
          return dateToSave;
        });

      const store = new Store<string>();
      const arr = [];
      const key = v4();
      for (let i = 0; i < sampleSize; i++) {
        const value = v4();
        store.put(key, value);
        arr.push({ value, now });
      }

      expect(store.getValueAtTime(key, arr[0].now - 1)).toBe(undefined);
      expect(store.getValueAtTime(key, arr[0].now)).toBe(arr[0].value);
      expect(store.getValueAtTime(key, arr[0].now + 1)).toBe(arr[0].value);

      expect(store.getValueAtTime(key, arr[sampleSize - 1].now)).toBe(arr[sampleSize - 1].value);
      expect(store.getValueAtTime(key, arr[sampleSize - 1].now + 1)).toBe(arr[sampleSize - 1].value);

      const randomIndexToValidate = Math.trunc(Math.random() * sampleSize);
      const nodeToSearch = arr[randomIndexToValidate];
      expect(store.getValueAtTime(key, nodeToSearch.now)).toBe(nodeToSearch.value);
      expect(store.getValueAtTime(key, nodeToSearch.now + 1)).toBe(nodeToSearch.value);

    }

    it("should return undefined for an empty store", () => {
      const store = new Store<string>();
      const timestamp = Date.now();
      expect(store.getValueAtTime(v4(), timestamp)).toBe(undefined);
    });

    it("should return undefined when passed undefined key and timestamp", () => {
      const store = new Store<string>();
      expect(store.getValueAtTime(undefined, undefined)).toBe(undefined);
    });

    it("should return the correct historical elements based on a fuzzy search search of <= timestamp", fuzzyTest(100));
    it("should return the correct historical elements based on a fuzzy search search of <= timestamp for even a simple value saved", fuzzyTest(1));
  });
});
