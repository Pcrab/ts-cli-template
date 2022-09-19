import { CustomLocalStorage, lstorage } from "../index.js";
import { appendPrefix } from "../common.js";

describe("Local storage", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    beforeEach(() => {
        localStorage.clear();
        lstorage.clear();
    });
    afterEach(() => {
        localStorage.clear();
        lstorage.clear();
    });
    test("normal lstorage", () => {
        lstorage.setItem("test1", "testValue");
        expect(lstorage.getItem("test1")).toEqual("testValue");
        expect(localStorage.getItem(appendPrefix("test1"))).toEqual(
            '{"value":"testValue"}',
        );

        lstorage.setItem("test2", {
            testtest: { testtesttest: "testtesttesttest" },
        });
        expect(lstorage.getItem("test2")).toEqual({
            testtest: { testtesttest: "testtesttesttest" },
        });
        expect(localStorage.getItem(appendPrefix("test2"))).toEqual(
            '{"value":{"testtest":{"testtesttest":"testtesttesttest"}}}',
        );

        lstorage.setItem("nothing", null);
        expect(lstorage.getItem("nothing")).toBeUndefined();
        expect(localStorage.getItem(appendPrefix("nothing"))).toBeNull();
    });
    test("lstorage with optons", () => {
        // readOnly
        lstorage.setItem("test1", "testValue", { readOnly: true });
        lstorage.setItem("test1", "changedValue", { readOnly: true });
        expect(lstorage.getItem("test1")).toEqual("testValue");
        expect(localStorage.getItem(appendPrefix("test1"))).toEqual(
            '{"value":"testValue","readOnly":true}',
        );
        // readOnly and force
        lstorage.setItem("test2", "testValue", { readOnly: true });
        lstorage.setItem("test2", "changedValue", { force: true });
        expect(lstorage.getItem("test2")).toEqual("changedValue");
        expect(localStorage.getItem(appendPrefix("test2"))).toEqual(
            '{"value":"changedValue"}',
        );

        // expiresAt
        const future = new Date(new Date().getTime() + 1000);
        lstorage.setItem("test3", "testValue", {
            expiresAt: future,
        });
        expect(lstorage.getItem("test3")).toEqual("testValue");
        expect(localStorage.getItem(appendPrefix("test3"))).toEqual(
            `{"value":"testValue","expiresAt":"${future.toJSON()}","timeout":1000000000000}`,
        );
        jest.runAllTimers();
        expect(lstorage.getItem("test3")).toBeUndefined();
        expect(localStorage.getItem(appendPrefix("test3"))).toBeNull();
    });
    test("sstore clear keys", () => {
        const future = new Date();
        future.setFullYear(9999);
        lstorage.setItem("test", "test", {
            expiresAt: future,
        });
        lstorage.clear();
    });
});

describe("mock initial", () => {
    const future = new Date(new Date().getTime() + 60 * 1000);
    const before = new Date(new Date().getTime() - 60 * 1000);
    beforeAll(() => {
        jest.useFakeTimers();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });
    test("mock initial localStorage", () => {
        localStorage.setItem(
            appendPrefix("test1"),
            `{"value":"testValue","expiresAt":"${future.toJSON()}","timeout":1000000000000}`,
        );
        localStorage.setItem(
            appendPrefix("test2"),
            `{"value":"testValue","expiresAt":"${before.toJSON()}","timeout":1000000000000}`,
        );
        localStorage.setItem("without_prefix", "nothing");
        const ls = new CustomLocalStorage("local");
        expect(ls.getItem("test1")).toEqual("testValue");
        expect(ls.getItem("test2")).toBeUndefined();
        expect(ls.getItem("without_prefix")).toBeUndefined();
        expect(localStorage.getItem(appendPrefix("test1"))).toEqual(
            `{"value":"testValue","expiresAt":"${future.toJSON()}","timeout":1000000000000}`,
        );
        expect(localStorage.getItem(appendPrefix("test2"))).toBeNull();
        expect(localStorage.getItem("without_prefix")).toEqual("nothing");
    });
});
