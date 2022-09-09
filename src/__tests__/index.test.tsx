import SessionStorage from "react-native-session-storage";

describe("Validator", () => {
    test("defines setItem()", () => {
        expect(typeof SessionStorage.setItem).toBe("function");
    });

    test("defines getItem()", () => {
        expect(typeof SessionStorage.getItem).toBe("function");
    });

    test("defines removeItem()", () => {
        expect(typeof SessionStorage.removeItem).toBe("function");
    });

    test("defines clear()", () => {
        expect(typeof SessionStorage.clear).toBe("function");
    });

    test("defines key()", () => {
        expect(typeof SessionStorage.key).toBe("function");
    });

    test("defines length", () => {
        expect(typeof SessionStorage.length).toBe("number");
    });
});

describe('Store', function () {
    it('Store and get item', function () {
        const objToStore = {
            strings: ["ABCD", "EFGH", "IJKL", "MNOP"],
            numbers: [1, 2, 3, 4],
            booleans: [true, false, true, false],
            objects: {
                key_1: "val_1",
                key_2: "val_2"
            },
            functions: [() => { return 0; }, function fun() { return true; }]
        };

        SessionStorage.setItem("long_obj_key", objToStore);
        const val = SessionStorage.getItem("long_obj_key");

        expect(val).toBe(objToStore);
    });

    it('Remove item', function () {
        SessionStorage.setItem("number_key", 0);
        SessionStorage.removeItem("number_key");

        const val = SessionStorage.getItem("number_key");

        expect(val).toBe(undefined);
    });

    it('Get key by index', function () {
        const key = SessionStorage.key(0);

        expect(key).toBe("long_obj_key");
    });

    it('Get number of key-value pair', function () {
        const length = SessionStorage.length;

        expect(length).toBe(1);
    });

    it('Clear all', function () {
        SessionStorage.setItem("string_key", "value");

        SessionStorage.clear();

        const longObjVal = SessionStorage.getItem("long_obj_key");
        const stringVal = SessionStorage.getItem("string_key");

        expect(longObjVal).toBe(undefined);
        expect(stringVal).toBe(undefined);
    });

    it('Get number of key-value pair after clear', function () {
        const length = SessionStorage.length;

        expect(length).toBe(0);
    });
});