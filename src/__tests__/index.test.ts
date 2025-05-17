import SessionStorage from "../index";

describe("API Validation", () => {
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

  // New API validation
  test("defines multiGet()", () => {
    expect(typeof SessionStorage.multiGet).toBe("function");
  });

  test("defines getAllItems()", () => {
    expect(typeof SessionStorage.getAllItems).toBe("function");
  });

  test("defines multiSet()", () => {
    expect(typeof SessionStorage.multiSet).toBe("function");
  });

  test("defines mergeItem()", () => {
    expect(typeof SessionStorage.mergeItem).toBe("function");
  });

  test("defines multiMerge()", () => {
    expect(typeof SessionStorage.multiMerge).toBe("function");
  });

  test("defines multiRemove()", () => {
    expect(typeof SessionStorage.multiRemove).toBe("function");
  });

  test("defines getAllKeys()", () => {
    expect(typeof SessionStorage.getAllKeys).toBe("function");
  });
});

describe("Basic Operations", function () {
  beforeEach(() => {
    SessionStorage.clear();
  });

  it("Store and get item", function () {
    const objToStore = {
      strings: ["ABCD", "EFGH", "IJKL", "MNOP"],
      numbers: [1, 2, 3, 4],
      booleans: [true, false, true, false],
      objects: {
        key_1: "val_1",
        key_2: "val_2",
      },
      functions: [
        () => {
          return 0;
        },
        function fun() {
          return true;
        },
      ],
    };

    SessionStorage.setItem("long_obj_key", objToStore);
    const val = SessionStorage.getItem("long_obj_key");

    expect(val).toBe(objToStore);
  });

  it("Remove item", function () {
    SessionStorage.setItem("number_key", 0);
    SessionStorage.removeItem("number_key");

    const val = SessionStorage.getItem("number_key");

    expect(val).toBe(undefined);
  });

  it("Get key by index", function () {
    SessionStorage.setItem("test_key", "test_value");
    const key = SessionStorage.key(0);

    expect(key).toBe("test_key");
  });

  it("Get number of key-value pair", function () {
    SessionStorage.setItem("test_key", "test_value");
    const length = SessionStorage.length;

    expect(length).toBe(1);
  });

  it("Clear all", function () {
    SessionStorage.setItem("string_key", "value");
    SessionStorage.setItem("number_key", 123);

    SessionStorage.clear();

    const stringVal = SessionStorage.getItem("string_key");
    const numberVal = SessionStorage.getItem("number_key");

    expect(stringVal).toBe(undefined);
    expect(numberVal).toBe(undefined);
  });

  it("Get number of key-value pair after clear", function () {
    SessionStorage.setItem("test_key", "value");
    SessionStorage.clear();
    const length = SessionStorage.length;

    expect(length).toBe(0);
  });
});

describe("Enhanced Storage APIs", function () {
  beforeEach(() => {
    SessionStorage.clear();
  });

  it("multiGet returns multiple values", function () {
    SessionStorage.setItem("key1", "value1");
    SessionStorage.setItem("key2", 2);
    SessionStorage.setItem("key3", { foo: "bar" });

    const values = SessionStorage.multiGet([
      "key1",
      "key2",
      "key3",
      "nonexistent",
    ]);

    expect(values.key1).toBe("value1");
    expect(values.key2).toBe(2);
    expect(values.key3).toEqual({ foo: "bar" });
    expect(values.nonexistent).toBe(undefined);
  });

  it("getAllItems returns all stored items", function () {
    SessionStorage.setItem("key1", "value1");
    SessionStorage.setItem("key2", 2);

    const allItems = SessionStorage.getAllItems();

    expect(Object.keys(allItems).length).toBe(2);
    expect(allItems.key1).toBe("value1");
    expect(allItems.key2).toBe(2);
  });

  it("multiSet stores multiple values using array format", function () {
    SessionStorage.multiSet([
      ["key1", "value1"],
      ["key2", 2],
    ]);

    expect(SessionStorage.getItem("key1")).toBe("value1");
    expect(SessionStorage.getItem("key2")).toBe(2);
  });

  it("multiSet stores multiple values using object format", function () {
    SessionStorage.multiSet({
      key3: true,
      key4: { nested: "object" },
    });

    expect(SessionStorage.getItem("key3")).toBe(true);
    expect(SessionStorage.getItem("key4")).toEqual({ nested: "object" });
  });

  it("mergeItem merges object values", function () {
    SessionStorage.setItem("obj", { a: 1, b: 2 });

    const merged = SessionStorage.mergeItem("obj", { b: 3, c: 4 });

    expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    expect(SessionStorage.getItem("obj")).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("mergeItem creates new object if key doesn't exist", function () {
    const newObj = SessionStorage.mergeItem("newObj", { x: 10 });

    expect(newObj).toEqual({ x: 10 });
    expect(SessionStorage.getItem("newObj")).toEqual({ x: 10 });
  });

  it("mergeItem returns undefined when merging with non-object values", function () {
    SessionStorage.setItem("string", "value");
    const result = SessionStorage.mergeItem("string", { prop: "value" });

    expect(result).toBe(undefined);
    expect(SessionStorage.getItem("string")).toBe("value"); // Original value should be unchanged
  });

  it("multiMerge merges multiple objects using array format", function () {
    SessionStorage.setItem("obj1", { a: 1 });
    SessionStorage.setItem("obj2", { x: 10 });

    const results = SessionStorage.multiMerge([
      ["obj1", { b: 2 }],
      ["obj2", { y: 20 }],
      ["obj3", { new: true }],
    ]);

    expect(results.obj1).toEqual({ a: 1, b: 2 });
    expect(results.obj2).toEqual({ x: 10, y: 20 });
    expect(results.obj3).toEqual({ new: true });

    expect(SessionStorage.getItem("obj1")).toEqual({ a: 1, b: 2 });
    expect(SessionStorage.getItem("obj2")).toEqual({ x: 10, y: 20 });
    expect(SessionStorage.getItem("obj3")).toEqual({ new: true });
  });

  it("multiMerge merges multiple objects using object format", function () {
    SessionStorage.setItem("obj1", { a: 1, b: 2 });
    SessionStorage.setItem("obj2", { x: 10, y: 20 });

    SessionStorage.multiMerge({
      obj1: { c: 3 },
      obj2: { z: 30 },
    });

    expect(SessionStorage.getItem("obj1")).toEqual({ a: 1, b: 2, c: 3 });
    expect(SessionStorage.getItem("obj2")).toEqual({ x: 10, y: 20, z: 30 });
  });

  it("multiMerge handles non-mergeable values", function () {
    SessionStorage.setItem("obj", { a: 1 });
    SessionStorage.setItem("str", "string value");

    const results = SessionStorage.multiMerge([
      ["obj", { b: 2 }],
      ["str", { prop: "value" }],
    ]);

    expect(results.obj).toEqual({ a: 1, b: 2 });
    expect(results.str).toBe(undefined);
    expect(SessionStorage.getItem("str")).toBe("string value"); // Unchanged
  });

  it("multiRemove removes multiple keys", function () {
    SessionStorage.setItem("key1", "value1");
    SessionStorage.setItem("key2", "value2");
    SessionStorage.setItem("key3", "value3");

    SessionStorage.multiRemove(["key1", "key3"]);

    expect(SessionStorage.getItem("key1")).toBe(undefined);
    expect(SessionStorage.getItem("key2")).toBe("value2");
    expect(SessionStorage.getItem("key3")).toBe(undefined);
  });

  it("getAllKeys returns all keys", function () {
    SessionStorage.setItem("key1", "value1");
    SessionStorage.setItem("key2", "value2");

    const keys = SessionStorage.getAllKeys();

    expect(keys.length).toBe(2);
    expect(keys).toContain("key1");
    expect(keys).toContain("key2");
  });

  it("handles complex nested objects", function () {
    const complexObj = {
      level1: {
        level2: {
          level3: {
            data: "nested value",
            array: [1, 2, { deep: "item" }],
          },
        },
        sibling: "sibling value",
      },
    };

    SessionStorage.setItem("complex", complexObj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const retrieved: any = SessionStorage.getItem("complex");

    expect(retrieved).toEqual(complexObj);
    expect(retrieved.level1.level2.level3.data).toBe("nested value");
    expect(retrieved.level1.level2.level3.array[2].deep).toBe("item");
  });
});
