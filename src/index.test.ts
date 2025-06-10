import {
    GetDateArrayPropOrDefault,
    GetDateArrayPropOrDefaultFunction, GetDateArrayPropOrThrow,
    GetDatePropOrDefault,
    GetDatePropOrDefaultFunction, GetDatePropOrThrow,
    GetNumberPropOrDefault,
    GetNumberPropOrDefaultFunction,
    GetNumberPropOrThrow,
    GetObjectArrayFunctionPropOrDefault,
    GetObjectArrayFunctionPropOrThrow,
    GetObjectArrayPropOrDefault, GetObjectArrayPropOrDefaultFunction,
    GetObjectArrayPropOrThrow,
    GetObjectFunctionPropOrDefault,
    GetObjectFunctionPropOrThrow,
    GetObjectPropOrDefault,
    GetObjectPropOrDefaultFunction,
    GetObjectPropOrThrow,
    GetStringArrayPropOrDefault,
    GetStringArrayPropOrDefaultFunction,
    GetStringArrayPropOrThrow,
    GetBooleanPropOrThrow,
    GetBooleanPropOrDefault,
    GetBooleanFunctionPropOrDefault,
    GetStringPropOrDefault,
    GetStringPropOrDefaultFunction,
    GetStringPropOrThrow
} from "./index";

describe("strings", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetStringPropOrDefaultFunction({ A: "abc" }, "A", () => null)).toEqual("abc")
        expect(GetStringPropOrDefaultFunction({ A: 123 }, "A", () => null)).toEqual("123")
        expect(GetStringPropOrDefaultFunction({ }, "A", () => null)).toBeNull()
    })
    test("PropOrDefault", () => {
        expect(GetStringPropOrDefault({ A: "abc" }, "A", null)).toEqual("abc")
        expect(GetStringPropOrDefault({ A: 123 }, "A", null)).toEqual("123")
        expect(GetStringPropOrDefault({ }, "A", null)).toBeNull()
    })
    test("PropOrThrow", () => {
        expect(GetStringPropOrThrow({A:"abc" }, "A")).toEqual("abc")
        expect(GetStringPropOrThrow({ A: 123 }, "A")).toEqual("123")
        expect(() => GetStringPropOrThrow({  }, "A")).toThrow()
    })
})
describe("numbers", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetNumberPropOrDefaultFunction({ A:  123 }, "A", () => null)).toEqual(123)
        expect(GetNumberPropOrDefaultFunction({ A:  "123" }, "A", () => null)).toEqual(123)
        expect(GetNumberPropOrDefaultFunction({  }, "A", () => null)).toEqual(null)
    })
    test("PropOrDefault", () => {
        expect(GetNumberPropOrDefault({A: 123 }, 'A', null)).toEqual(123)
        expect(GetNumberPropOrDefault({A: "123" }, 'A', null)).toEqual(123)
        expect(GetNumberPropOrDefault({}, 'A', null)).toEqual(null)
    })
    test("PropOrThrow", () => {
        expect(GetNumberPropOrThrow({A: 123 }, "A")).toEqual(123)
        expect(GetNumberPropOrThrow({A: "123" }, "A")).toEqual(123)
        expect(() => GetNumberPropOrThrow({ }, "A")).toThrow()
    })
})
describe("dates", () => {
    let date = new Date();
    test("PropOrDefaultFunction", () => {
        expect(GetDatePropOrDefaultFunction({ A: date  }, "A", () => null)).toEqual(date)
        expect(GetDatePropOrDefaultFunction({ A:  1234 }, "A", () => null)).toEqual(new Date(1234 * 1000))
        expect(GetDatePropOrDefaultFunction({ A:"2023-01-01" }, "A", () => null)).toEqual(new Date("2023-01-01"))
        expect(GetDatePropOrDefaultFunction({  }, "A", () => null)).toBeNull()
    })
    test("PropOrDefault", () => {
        expect(GetDatePropOrDefault({A: date }, "A", null)).toEqual(date)
        expect(GetDatePropOrDefault({A: 1234 }, "A", null)).toEqual(new Date(1234 * 1000))
        expect(GetDatePropOrDefault({A:"2023-01-01"}, "A", null)).toEqual(new Date("2023-01-01"))
        expect(GetDatePropOrDefault({}, "A", null)).toBeNull()
    })
    test("PropOrThrow", () => {
        expect(GetDatePropOrThrow({A: date }, "A")).toEqual(date)
        expect(GetDatePropOrThrow({A: 1234 }, "A")).toEqual(new Date(1234 * 1000))
        expect(GetDatePropOrThrow({A:"2023-01-01"}, "A")).toEqual(new Date("2023-01-01"))
        expect(() => GetDatePropOrThrow({ }, "A")).toThrow()
    })
})
describe("string array", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetStringArrayPropOrDefaultFunction({ A: ["abc"] }, "A", () => null)).toEqual(["abc"])
        expect(GetStringArrayPropOrDefaultFunction({ A: [123] }, "A", () => null)).toEqual(["123"])
        expect(GetStringArrayPropOrDefaultFunction({ }, "A", () => null)).toBeNull()
    })
    test("PropOrDefault", () => {
        expect(GetStringArrayPropOrDefault({ A: ["abc"] }, "A", null)).toEqual(["abc"])
        expect(GetStringArrayPropOrDefault({ A: [123] }, "A", null)).toEqual(["123"])
        expect(GetStringArrayPropOrDefault({ }, "A", null)).toBeNull()
    })
    test("PropOrThrow", () => {
        expect(GetStringArrayPropOrThrow({A:["abc"] }, "A")).toEqual(["abc"])
        expect(GetStringArrayPropOrThrow({ A: [123] }, "A")).toEqual(["123"])
        expect(() => GetStringArrayPropOrThrow({  }, "A")).toThrow()
    })
})
describe("date array", () => {
    let date = new Date();
    test("PropOrDefaultFunction", () => {
        expect(GetDateArrayPropOrDefaultFunction({ A: [date]  }, "A", () => null)).toEqual([date])
        expect(GetDateArrayPropOrDefaultFunction({ A:  [1234] }, "A", () => null)).toEqual([new Date(1234 * 1000)])
        expect(GetDateArrayPropOrDefaultFunction({ A:["2023-01-01"] }, "A", () => null)).toEqual([new Date("2023-01-01")])
        expect(GetDateArrayPropOrDefaultFunction({  }, "A", () => null)).toBeNull()
    })
    test("PropOrDefault", () => {
        expect(GetDateArrayPropOrDefault({A: [date] }, "A", null)).toEqual([date])
        expect(GetDateArrayPropOrDefault({A: [1234] }, "A", null)).toEqual([new Date(1234 * 1000)])
        expect(GetDateArrayPropOrDefault({A:["2023-01-01"]}, "A", null)).toEqual([new Date("2023-01-01")])
        expect(GetDateArrayPropOrDefault({}, "A", null)).toBeNull()
    })
    test("PropOrThrow", () => {
        expect(GetDateArrayPropOrThrow({A: [date] }, "A")).toEqual([date])
        expect(GetDateArrayPropOrThrow({A: [1234] }, "A")).toEqual([new Date(1234 * 1000)])
        expect(GetDateArrayPropOrThrow({A:["2023-01-01"]}, "A")).toEqual([new Date("2023-01-01")])
        expect(() => GetDateArrayPropOrThrow({ }, "A")).toThrow()
    })
})

class TestObject {
    constructor(
        props : Partial<Record<keyof TestObject, unknown>> | null = null,
        public A : string = GetStringPropOrDefault(props, "A", ""),
    ) {
    }
}

describe("object", () => {
    test("PropOrThrow", () => {
        expect(GetObjectPropOrThrow<TestObject | null>({ A: { A: "abc" } }, "A")).toEqual({ A: "abc" })
        expect(() => GetObjectPropOrThrow<TestObject | null>(null, "A")).toThrow()
    })
    test("FunctionPropOrThrow", () => {
        expect(GetObjectFunctionPropOrThrow<TestObject | null>({ A: { A: "abc" } }, "A", (e) => new TestObject(e) )).toEqual({ A: "abc" })
        expect(() => GetObjectFunctionPropOrThrow<TestObject | null>(null, "A", (e) => new TestObject(e))).toThrow()
    })
    test("PropOrDefault", () => {
        expect(GetObjectPropOrDefault<TestObject | null>({ A: { A: "abc" } }, 'A', null)).toEqual({ A: "abc" })
        expect(GetObjectPropOrDefault<TestObject | null>(null, 'A', null)).toBeNull()
    })
    test("FunctionPropOrDefault", () => {
        expect(GetObjectFunctionPropOrDefault<TestObject | null>({ A: { A: "abc" } }, "A", (e) => new TestObject(e), null)).toEqual({ A: "abc" })
        expect(GetObjectFunctionPropOrDefault<TestObject | null>(null, "A", (e) => new TestObject(e), null)).toBeNull()
    })
    test("PropOrDefaultFunction", () => {
        expect(GetObjectPropOrDefaultFunction<TestObject | null>({ A: { A: "abc" } }, "A", (e) => new TestObject(e), () => null)).toEqual({ A: "abc" })
        expect(GetObjectPropOrDefaultFunction<TestObject | null>({}, "A", (e) => new TestObject(e), () => null)).toBeNull()
    })
})
describe("object array", () => {
    test("PropOrThrow", () => {
        expect(GetObjectArrayPropOrThrow<TestObject, TestObject[] | null>({ A: [{ A: "abc" }] }, "A")).toEqual([{ A: "abc" }])
        expect(() => GetObjectArrayPropOrThrow<TestObject, TestObject[] | null>(null, "A")).toThrow()
    })
    test("FunctionPropOrThrow", () => {
        expect(GetObjectArrayFunctionPropOrThrow<TestObject, TestObject[] | null>({ A: [{ A: "abc" }] }, "A", (e) => new TestObject(e) )).toEqual([{ A: "abc" }])
        expect(() => GetObjectArrayFunctionPropOrThrow<TestObject, TestObject[] | null>(null, "A", (e) => new TestObject(e))).toThrow()
    })
    test("PropOrDefault", () => {
        expect(GetObjectArrayPropOrDefault<TestObject, TestObject[] | null>({ A: [{ A: "abc" }] }, 'A', null)).toEqual([{ A: "abc" }])
        expect(GetObjectArrayPropOrDefault<TestObject, TestObject[] | null>(null, 'A', null)).toBeNull()
    })
    test("FunctionPropOrDefault", () => {
        expect(GetObjectArrayFunctionPropOrDefault<TestObject, TestObject[] | null>({ A: [{ A: "abc" }] }, "A", (e) => new TestObject(e), null)).toEqual([{ A: "abc" }])
        expect(GetObjectArrayFunctionPropOrDefault<TestObject, TestObject[] | null>(null, "A", (e) => new TestObject(e), null)).toBeNull()
    })
    test("PropOrDefaultFunction", () => {
        expect(GetObjectArrayPropOrDefaultFunction<TestObject, TestObject[] | null>({ A: [{ A: "abc" }] }, "A", (e) => new TestObject(e), () => null)).toEqual([{ A: "abc" }])
        expect(GetObjectArrayPropOrDefaultFunction<TestObject, TestObject[] | null>({}, "A", (e) => new TestObject(e), () => null)).toBeNull()
    })
})

describe("boolean", () => {
    test("PropOrThrow", () => {
        expect(GetBooleanPropOrThrow({ A: true }, "A")).toEqual(true)
        expect(GetBooleanPropOrThrow({ A: "yes" }, "A", ((v: any) => v === "yes") as any)).toEqual(true)
        expect(() => GetBooleanPropOrThrow({}, "A")).toThrow()
        expect(() => GetBooleanPropOrThrow({ A: "true" }, "A")).toThrow()
    })
    test("PropOrDefault", () => {
        expect(GetBooleanPropOrDefault({ A: false }, "A", true)).toEqual(false)
        expect(GetBooleanPropOrDefault({}, "A", true)).toEqual(true)
        expect(GetBooleanPropOrDefault({ A: "no" }, "A", true)).toEqual(true)
    })
    test("FunctionPropOrDefault", () => {
        expect(GetBooleanFunctionPropOrDefault({ A: "Y" }, "A", ((v: any) => v === "Y") as any, false)).toEqual(true)
        expect(GetBooleanFunctionPropOrDefault({ A: 0 }, "A", (v) => !!v, true)).toEqual(false)
        expect(GetBooleanFunctionPropOrDefault({}, "A", (v) => !!v, false)).toEqual(false)
    })
})
