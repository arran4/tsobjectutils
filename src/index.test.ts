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
    GetStringPropOrThrow,
    GetTypedBooleanPropOrDefault,
    GetTypedBooleanPropOrThrow,
    GetTypedDateArrayPropOrDefault,
    GetTypedDateArrayPropOrThrow,
    GetTypedDatePropOrDefault,
    GetTypedDatePropOrThrow,
    GetTypedNumberPropOrDefault,
    GetTypedNumberPropOrThrow,
    GetTypedStringArrayPropOrDefault,
    GetTypedStringArrayPropOrThrow,
    GetTypedStringPropOrDefault,
    GetTypedStringPropOrThrow,
    GetMapPropOrThrow,
    GetMapPropOrDefault,
    GetMapPropOrDefaultFunction,
    GetBigIntPropOrThrow,
    GetBigIntPropOrDefault,
    GetBigIntPropOrDefaultFunction,
    GetNumberArrayPropOrDefault,
    GetNumberArrayPropOrDefaultFunction,
    GetNumberArrayPropOrThrow,
    GetBooleanArrayPropOrDefault,
    GetBooleanArrayPropOrDefaultFunction,
    GetBooleanArrayPropOrThrow,
    GetBigIntArrayPropOrDefault,
    GetBigIntArrayPropOrDefaultFunction,
    GetBigIntArrayPropOrThrow,
    GetTypedNumberArrayPropOrDefault,
    GetTypedNumberArrayPropOrThrow,
    GetTypedBooleanArrayPropOrDefault,
    GetTypedBooleanArrayPropOrThrow,
    GetTypedBigIntArrayPropOrDefault,
    GetTypedBigIntArrayPropOrThrow,
    GetObjectPropOrThrowAllowNull,
    GetObjectFunctionPropOrThrowAllowNull,
    GetObjectPropOrDefaultAllowNull,
    GetObjectFunctionPropOrDefaultAllowNull,
    GetObjectPropOrDefaultFunctionAllowNull,
    PropsFor
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
    const date = new Date();
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
    const date = new Date();
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

describe("number array", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetNumberArrayPropOrDefaultFunction({ A: [1, 2, 3] }, "A", () => null)).toEqual([1, 2, 3]);
        expect(GetNumberArrayPropOrDefaultFunction({ A: ["1", "2"] }, "A", () => null)).toEqual([1, 2]);
        expect(GetNumberArrayPropOrDefaultFunction({}, "A", () => null)).toBeNull();
    });
    test("PropOrDefault", () => {
        expect(GetNumberArrayPropOrDefault({ A: [1, 2] }, "A", null)).toEqual([1, 2]);
        expect(GetNumberArrayPropOrDefault({ A: ["3", "4"] }, "A", null)).toEqual([3, 4]);
        expect(GetNumberArrayPropOrDefault({}, "A", null)).toBeNull();
    });
    test("PropOrThrow", () => {
        expect(GetNumberArrayPropOrThrow({ A: [1] }, "A")).toEqual([1]);
        expect(GetNumberArrayPropOrThrow({ A: ["2"] }, "A")).toEqual([2]);
        expect(() => GetNumberArrayPropOrThrow({}, "A")).toThrow();
        expect(GetNumberArrayPropOrThrow({ A: ["nan"] }, "A")).toEqual([NaN]); // or throw? GetNumberPropOrThrow returns NaN for invalid string
    });
});

describe("boolean array", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetBooleanArrayPropOrDefaultFunction({ A: [true, false] }, "A", () => null)).toEqual([true, false]);
        expect(GetBooleanArrayPropOrDefaultFunction({}, "A", () => null)).toBeNull();
    });
    test("PropOrDefault", () => {
        expect(GetBooleanArrayPropOrDefault({ A: [true] }, "A", null)).toEqual([true]);
        expect(GetBooleanArrayPropOrDefault({}, "A", null)).toBeNull();
    });
    test("PropOrThrow", () => {
        expect(GetBooleanArrayPropOrThrow({ A: [true] }, "A")).toEqual([true]);
        expect(() => GetBooleanArrayPropOrThrow({ A: ["true"] }, "A")).toThrow(); // Default doesn't convert strings
        expect(() => GetBooleanArrayPropOrThrow({}, "A")).toThrow();
    });
});

describe("bigint array", () => {
    test("PropOrDefaultFunction", () => {
        expect(GetBigIntArrayPropOrDefaultFunction({ A: [1n, 2n] }, "A", () => null)).toEqual([1n, 2n]);
        expect(GetBigIntArrayPropOrDefaultFunction({ A: [1, "2"] }, "A", () => null)).toEqual([1n, 2n]);
        expect(GetBigIntArrayPropOrDefaultFunction({}, "A", () => null)).toBeNull();
    });
    test("PropOrDefault", () => {
        expect(GetBigIntArrayPropOrDefault({ A: [1n] }, "A", null)).toEqual([1n]);
        expect(GetBigIntArrayPropOrDefault({ A: ["2"] }, "A", null)).toEqual([2n]);
        expect(GetBigIntArrayPropOrDefault({}, "A", null)).toBeNull();
    });
    test("PropOrThrow", () => {
        expect(GetBigIntArrayPropOrThrow({ A: [1n] }, "A")).toEqual([1n]);
        expect(GetBigIntArrayPropOrThrow({ A: [2] }, "A")).toEqual([2n]);
        expect(() => GetBigIntArrayPropOrThrow({}, "A")).toThrow();
    });
});

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
        expect(GetBooleanPropOrThrow({ A: "yes" }, "A", ((v: unknown) => v === "yes") )).toEqual(true)
        expect(() => GetBooleanPropOrThrow({}, "A")).toThrow()
        expect(() => GetBooleanPropOrThrow({ A: "true" }, "A")).toThrow()
    })
    test("PropOrDefault", () => {
        expect(GetBooleanPropOrDefault({ A: false }, "A", true)).toEqual(false)
        expect(GetBooleanPropOrDefault({}, "A", true)).toEqual(true)
        expect(GetBooleanPropOrDefault({ A: "no" }, "A", true)).toEqual(true)
    })
    test("FunctionPropOrDefault", () => {
        expect(GetBooleanFunctionPropOrDefault({ A: "Y" }, "A", ((v: unknown) => v === "Y"), false)).toEqual(true)
        expect(GetBooleanFunctionPropOrDefault({ A: 0 }, "A", (v: unknown) => !!v, true)).toEqual(false)
        expect(GetBooleanFunctionPropOrDefault({}, "A", (v: unknown) => !!v, false)).toEqual(false)
    })
})

describe("map", () => {
    test("PropOrThrow", () => {
        const map = new Map([["key", "value"]]);
        expect(GetMapPropOrThrow({ A: map }, "A")).toEqual(map);
        expect(GetMapPropOrThrow({ A: { key: "value" } }, "A")).toEqual(map);
        expect(() => GetMapPropOrThrow({}, "A")).toThrow();
    });
    test("PropOrDefault", () => {
        const map = new Map([["key", "value"]]);
        expect(GetMapPropOrDefault({ A: map }, "A", null)).toEqual(map);
        expect(GetMapPropOrDefault({ A: { key: "value" } }, "A", null)).toEqual(map);
        expect(GetMapPropOrDefault({}, "A", null)).toBeNull();
    });
    test("PropOrDefaultFunction", () => {
        const map = new Map([["key", "value"]]);
        expect(GetMapPropOrDefaultFunction({ A: map }, "A", () => null)).toEqual(map);
        expect(GetMapPropOrDefaultFunction({ A: { key: "value" } }, "A", () => null)).toEqual(map);
        expect(GetMapPropOrDefaultFunction({}, "A", () => null)).toBeNull();
    });
})

describe("bigint", () => {
    test("PropOrThrow", () => {
        expect(GetBigIntPropOrThrow({ A: 123n }, "A")).toEqual(123n);
        expect(GetBigIntPropOrThrow({ A: 123 }, "A")).toEqual(123n);
        expect(GetBigIntPropOrThrow({ A: "123" }, "A")).toEqual(123n);
        expect(() => GetBigIntPropOrThrow({}, "A")).toThrow();
    });
    test("PropOrDefault", () => {
        expect(GetBigIntPropOrDefault({ A: 123n }, "A", null)).toEqual(123n);
        expect(GetBigIntPropOrDefault({ A: 123 }, "A", null)).toEqual(123n);
        expect(GetBigIntPropOrDefault({ A: "123" }, "A", null)).toEqual(123n);
        expect(GetBigIntPropOrDefault({}, "A", null)).toBeNull();
    });
    test("PropOrDefaultFunction", () => {
        expect(GetBigIntPropOrDefaultFunction({ A: 123n }, "A", () => null)).toEqual(123n);
        expect(GetBigIntPropOrDefaultFunction({ A: 123 }, "A", () => null)).toEqual(123n);
        expect(GetBigIntPropOrDefaultFunction({ A: "123" }, "A", () => null)).toEqual(123n);
        expect(GetBigIntPropOrDefaultFunction({}, "A", () => null)).toBeNull();
    });
})

describe("object allow null", () => {
    test("PropOrThrow", () => {
        expect(GetObjectPropOrThrowAllowNull<TestObject | null>({ A: { A: "abc" } }, "A")).toEqual({ A: "abc" })
        expect(() => GetObjectPropOrThrowAllowNull<TestObject | null>(null, "A")).toThrow()
    })
    test("FunctionPropOrThrow", () => {
        expect(GetObjectFunctionPropOrThrowAllowNull<TestObject | null>({ A: { A: "abc" } }, "A", (e) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>) )).toEqual({ A: "abc" })
        expect(() => GetObjectFunctionPropOrThrowAllowNull<TestObject | null>(null, "A", (e) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>))).toThrow()
    })
    test("PropOrDefault", () => {
        expect(GetObjectPropOrDefaultAllowNull<TestObject | null>({ A: { A: "abc" } }, 'A', null)).toEqual({ A: "abc" })
        expect(GetObjectPropOrDefaultAllowNull<TestObject | null>(null, 'A', null)).toBeNull()
    })
    test("FunctionPropOrDefault", () => {
        expect(GetObjectFunctionPropOrDefaultAllowNull<TestObject | null>({ A: { A: "abc" } }, "A", (e) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>), null)).toEqual({ A: "abc" })
        expect(GetObjectFunctionPropOrDefaultAllowNull<TestObject | null>(null, "A", (e) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>), null)).toBeNull()
    })
    test("PropOrDefaultFunction", () => {
        expect(GetObjectPropOrDefaultFunctionAllowNull<TestObject | null>({ A: { A: "abc" } }, "A", (e: Partial<Record<keyof TestObject, unknown>> | null) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>), () => null)).toEqual({ A: "abc" })
        expect(GetObjectPropOrDefaultFunctionAllowNull<TestObject | null>({}, "A", (e: Partial<Record<keyof TestObject, unknown>> | null) => new TestObject(e as Partial<Record<keyof TestObject, unknown>>), () => null)).toBeNull()
    })
})

describe("typed helpers", () => {
    interface TypedPropsExample {
        name: string;
        count: number;
        started: Date;
        labels: string[];
        timestamps: Date[];
        active: boolean;
        numbers: number[];
        booleans: boolean[];
        bigints: bigint[];
    }

    const typedProps: PropsFor<TypedPropsExample> = {
        name: 123,
        count: "42",
        started: "2022-12-31",
        labels: [1, "two"],
        timestamps: ["2023-01-01", 5],
        active: "Y",
        numbers: ["1", 2],
        booleans: [true, false],
        bigints: [1, "2"],
    };

    test("typed throw conversions", () => {
        expect(GetTypedStringPropOrThrow<TypedPropsExample>(typedProps, "name")).toBe("123");
        expect(GetTypedNumberPropOrThrow<TypedPropsExample>(typedProps, "count")).toBe(42);
        expect(GetTypedDatePropOrThrow<TypedPropsExample>(typedProps, "started")).toEqual(new Date("2022-12-31"));
        expect(GetTypedStringArrayPropOrThrow<TypedPropsExample>(typedProps, "labels")).toEqual(["1", "two"]);
        expect(GetTypedDateArrayPropOrThrow<TypedPropsExample>(typedProps, "timestamps")).toEqual([new Date("2023-01-01"), new Date(5 * 1000)]);
        expect(GetTypedBooleanPropOrThrow<TypedPropsExample>(typedProps, "active", (v: unknown) => v === "Y")).toBe(true);
        expect(GetTypedNumberArrayPropOrThrow<TypedPropsExample>(typedProps, "numbers")).toEqual([1, 2]);
        expect(GetTypedBooleanArrayPropOrThrow<TypedPropsExample>(typedProps, "booleans")).toEqual([true, false]);
        expect(GetTypedBigIntArrayPropOrThrow<TypedPropsExample>(typedProps, "bigints")).toEqual([1n, 2n]);
    });

    test("typed defaults", () => {
        const emptyProps: PropsFor<TypedPropsExample> = {};
        expect(GetTypedStringPropOrDefault<TypedPropsExample>(emptyProps, "name", null)).toBeNull();
        expect(GetTypedNumberPropOrDefault<TypedPropsExample>(emptyProps, "count", null)).toBeNull();
        expect(GetTypedDatePropOrDefault<TypedPropsExample>(emptyProps, "started", null)).toBeNull();
        expect(GetTypedStringArrayPropOrDefault<TypedPropsExample>(emptyProps, "labels", null)).toBeNull();
        expect(GetTypedDateArrayPropOrDefault<TypedPropsExample>(emptyProps, "timestamps", null)).toBeNull();
        expect(GetTypedBooleanPropOrDefault<TypedPropsExample>(emptyProps, "active", false)).toBe(false);
        expect(GetTypedNumberArrayPropOrDefault<TypedPropsExample>(emptyProps, "numbers", null)).toBeNull();
        expect(GetTypedBooleanArrayPropOrDefault<TypedPropsExample>(emptyProps, "booleans", null)).toBeNull();
        expect(GetTypedBigIntArrayPropOrDefault<TypedPropsExample>(emptyProps, "bigints", null)).toBeNull();
    });
});
