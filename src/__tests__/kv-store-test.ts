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
    it("should return undefined for an empty store", () => {
      const store = new Store<string>();
      const timestamp = new Date().getTime();
      expect(store.getValueAtTime(v4(), timestamp)).toBe(undefined);
    });

    it("should return undefined if no date matches", () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementation(() => {
          const randomYear = 2019;
          const randomMonth = Math.floor(Math.random() * 12) + 1;
          const randomDay = randomMonth === 2
            ? Math.floor(Math.random() * 28) + 1
            : Math.floor(Math.random() * 30) + 1;
          return (new Date(randomYear, randomMonth, randomDay)).getTime();
        });

      const store = new Store<string>();
      const key = v4();
      store.put(key, v4());
      store.put(key, v4());
      store.put(key, v4());
      const timestamp = new Date(2020, 1, 1).getTime();
      expect(store.getValueAtTime(key, timestamp)).toBe(undefined);
    });

    it("should return the value that matched the saved date", () => {
      const dateToSave = new Date('2019-05-14T11:01:58.135Z');
      const millisecondsInAnHour = 3.6e+6;
      const dateToFetch = dateToSave.getTime() + millisecondsInAnHour;
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => dateToSave.getTime())
        .mockImplementationOnce(() => dateToFetch)
        .mockImplementationOnce(() => dateToSave.getTime() + (millisecondsInAnHour * 2));

      const store = new Store<string>();
      const key = v4();
      const value = v4();
      store.put(key, v4());
      store.put(key, value);
      store.put(key, v4());
    
      expect(store.getValueAtTime(key, dateToFetch)).toBe(value);
    });
  });
  
});