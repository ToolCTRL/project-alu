import { useEffect, useState } from "react";

const useLocalStorage = <T>(key: string | undefined, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (key) {
      // Retrieve from localStorage
      const item = globalThis.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    }
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    if (key) {
      // Save to localStorage
      globalThis.localStorage.setItem(key, JSON.stringify(value));
    }
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
