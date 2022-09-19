import { prefix } from "../index.js";

describe("PREFIX", () => {
    test("prefix", () => {
        expect(prefix).toEqual("$PLS_STORAGE_");
    });
});
