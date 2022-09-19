import { sstorage } from "../index.js";
import { appendPrefix } from "../common.js";

describe("Session storage", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    beforeEach(() => {
        sessionStorage.clear();
        sstorage.clear();
    });
    afterEach(() => {
        sessionStorage.clear();
        sstorage.clear();
    });
    test("normal sstorage", () => {
        sstorage.setItem("test1", "testValue");
        expect(sstorage.getItem("test1")).toEqual("testValue");
        expect(sessionStorage.getItem(appendPrefix("test1"))).toEqual(
            '{"value":"testValue"}',
        );

        sstorage.setItem("test2", {
            testtest: { testtesttest: "testtesttesttest" },
        });
        expect(sstorage.getItem("test2")).toEqual({
            testtest: { testtesttest: "testtesttesttest" },
        });
        expect(sessionStorage.getItem(appendPrefix("test2"))).toEqual(
            '{"value":{"testtest":{"testtesttest":"testtesttesttest"}}}',
        );

        sstorage.setItem("nothing", null);
        expect(sstorage.getItem("nothing")).toBeUndefined();
        expect(sessionStorage.getItem(appendPrefix("nothing"))).toBeNull();
    });
    test("sstorage with optons", () => {
        // readOnly
        sstorage.setItem("test1", "testValue", { readOnly: true });
        sstorage.setItem("test1", "changedValue", { readOnly: true });
        expect(sstorage.getItem("test1")).toEqual("testValue");
        expect(sessionStorage.getItem(appendPrefix("test1"))).toEqual(
            '{"value":"testValue","readOnly":true}',
        );
        // readOnly and force
        sstorage.setItem("test2", "testValue", { readOnly: true });
        sstorage.setItem("test2", "changedValue", { force: true });
        expect(sstorage.getItem("test2")).toEqual("changedValue");
        expect(sessionStorage.getItem(appendPrefix("test2"))).toEqual(
            '{"value":"changedValue"}',
        );

        // expiresAt
        const future = new Date(new Date().getTime() + 1000);
        sstorage.setItem("test3", "testValue", {
            expiresAt: future,
        });
        expect(sstorage.getItem("test3")).toEqual("testValue");
        expect(sessionStorage.getItem(appendPrefix("test3"))).toEqual(
            `{"value":"testValue","expiresAt":"${future.toJSON()}","timeout":1000000000000}`,
        );
        jest.runAllTimers();
        expect(sstorage.getItem("test3")).toBeUndefined();
        expect(sessionStorage.getItem(appendPrefix("test3"))).toBeNull();
    });
    test("sstore clear keys", () => {
        const future = new Date();
        future.setFullYear(9999);
        sstorage.setItem("test", "test", {
            expiresAt: future,
        });
        sstorage.clear();
    });
});
