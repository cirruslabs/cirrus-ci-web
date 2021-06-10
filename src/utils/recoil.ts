// https://recoiljs.org/docs/guides/atom-effects/#local-storage-persistence
import { DefaultValue } from 'recoil';

export const localStorageEffect =
  key =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet(newValue => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };
