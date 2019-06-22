import { v4 } from 'uuid';
import { Store } from '../kv-store';

describe('kv Store', () => {
  describe('constructor', () => {
    it('should create an empty store', () => {
      const store = new Store<string>();
      expect(store.getSize()).toBe(0);
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
});