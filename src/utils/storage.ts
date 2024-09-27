export const writeToLocalStorage = (key: string, value: object) => {
  localStorage
    .setItem(key, JSON.stringify(value));
}

export const readFromLocalStorage = (key: string): object => {
  const value = localStorage.getItem(key);
  return value 
    ? JSON.parse(value) 
    : {};
}

export const clearLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}
