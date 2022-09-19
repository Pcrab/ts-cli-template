import { CustomLocalStorage } from "./storage.js";

export const lstorage = new CustomLocalStorage("local");
export const sstorage = new CustomLocalStorage("session");
export { CustomLocalStorage, prefix } from "./storage.js";
