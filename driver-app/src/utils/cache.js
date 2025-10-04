// src/utils/cache.js
import localforage from "localforage";

localforage.config({
  name: "myApp",
  storeName: "authProfileCache",
});

export const getCache = async (key) => {
  try {
    return await localforage.getItem(key);
  } catch (error) {
    console.error("Failed to get item from cache", error);
    return null;
  }
};

export const setCache = async (key, value) => {
  try {
    await localforage.setItem(key, value);
  } catch (error) {
    console.error("Failed to set item in cache", error);
  }
};

export const removeCache = async (key) => {
  try {
    await localforage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove item from cache", error);
  }
};
