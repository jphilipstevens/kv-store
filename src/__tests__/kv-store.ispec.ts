import { v4 } from "uuid";
import { Store } from "../index";

describe("KV Integration Tests", () => {
  interface StoredDataAndTimestamp {
    [key: string] : number;
  }

  const test = (store: Store<string>, key: string, data: string[]): Promise<StoredDataAndTimestamp> => {
    const storedData: StoredDataAndTimestamp = {};
    return new Promise((resolve, _) => {
      data.forEach((input, index) => {
        setTimeout(() => {
          const ts = store.put(key, input);
          storedData[input] = ts;
          if (index === data.length - 1) {
            resolve(storedData)
          }
        }, 100 + (index * 100));
      })
    });
  };

  const getRandomLetterFromAlphabet = () => String.fromCharCode(97 + Math.ceil(Math.random() * 26));

  it("should store many objects into one key at the correct timestamp", () => {
    const data = [..."abcdefghijklmnopqrstufwxvz"];
    const store = new Store<string>();
    const key = v4();
    return test(store, key, data)
      .then((storedData) => {
        expect(store.getSize()).toBe(1);
        expect(store.containsKey(key)).toBe(true);
        expect(store.getValue(key)).toBe("z");
        const letterToFetch = getRandomLetterFromAlphabet();
        expect(store.getValueAtTime(key, storedData[letterToFetch])).toBe(letterToFetch);
      });
  });
});