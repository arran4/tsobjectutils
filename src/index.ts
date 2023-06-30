export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, any> | undefined | null, prop: keyof P, defaultFunction: () => R): R {
    try {
        return GetStringPropOrThrow<R>(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetStringPropOrDefault<R extends string | null>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: R): R {
    return GetStringPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetStringPropOrThrow<R extends string | null>(props: Record<string, any> | undefined | null, prop: keyof P): R {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'string') {
                return v as R
            }
        }
    }
    throw new Error(`${prop} not found as string in ${typeof props}`)
}

export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, any> | undefined | null, prop: keyof P, defaultFunction: () => R): R {
    try {
        return GetNumberPropOrThrow<R>(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: R): R {
    return GetNumberPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, any> | undefined | null, prop: keyof P): R {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'number') {
                return v as R
            }
            if (typeof v === 'string') {
                return (+v) as R
            }
        }
    }
    throw new Error(`${prop} not found as number in ${typeof props}`)
}

export function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: keyof P, defaultFunction: () => R): R | Date {
    try {
        return GetDatePropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}


export function GetDatePropOrDefault<T, P extends Props<T>, K extends keyof T>(props: P | undefined | null, prop: K, defaultValue: T[K]): T[K] {
    return GetDatePropOrDefaultFunction(props, prop, () : T[K] => defaultValue);
}

export type Props<Type> = undefined | null
        | Type extends string ? string :
         Type extends Array<string> ? Array<string> :
         Type extends number ? number | string :
         Type extends Date ? Date | number | string :
         Type extends Array<Date> ? Array<Date | number | string> :
         Type extends Object ? Object | number | string :
         Type extends Array<Object> ? Array<Object | number | string> : never
    ;

export type RestrictInterfaceToType<T, RT> = {[KN in keyof T as T[KN] extends RT ? KN : never]: T[KN] extends RT ? T[KN] : never}
export type TypeInType<T, RT> =              {[KN in keyof T as T[KN] extends RT ? KN : never]: T[KN]}

export interface Test1 {
    A : Date
    C: string
}

export const test1a : TypeInType<Test1, string> = {
    C: "sadf",
}
export const test1b : RestrictInterfaceToType<Test1, string> = {
    C: "sadf",
}
export const test1c : TypeInType<Test1, Date> = {
    A: new Date()
}
export const test1d : RestrictInterfaceToType<Test1, Date> = {
    A: new Date()
}

export function GetDatePropOrThrow(props: RestrictInterfaceToType<any, Date> | undefined | null, prop: keyof RestrictInterfaceToType<any, Date>): Date {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (typeof v === 'string') {
                return new Date(v as string)
            } else if (typeof v === 'number') {
                return new Date((v as number) * 1000)
            } else if (typeof v === 'object') {
                return v as Date
            }
        }
    }
    throw new Error(`${String(prop)} not found as date in ${typeof props}`)
}

export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: keyof P, defaultFunction: () => R): string[] | R {
    try {
        return GetStringArrayPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: R): string[] | R {
    return GetStringArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined | null, prop: keyof P): string[] {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (Array.isArray(v)) {
                return v.map((v) => v.toString())
            }
        }
    }
    throw new Error(`${prop} not found as string[] in ${typeof props}`)
}

export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: keyof P, defaultFunction: () => R): Date[] | R {
    try {
        return GetDateArrayPropOrThrow(props, prop)
    } catch (e) {
        if (!(e?.toString() ?? "").includes("not found as date[]")) {
            throw e;
        }
    }
    return defaultFunction();
}

export function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: R): Date[] | R {
    return GetDateArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetDateArrayPropOrThrow(props: Record<string, any> | undefined | null, prop: keyof P): Date[] {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (Array.isArray(v)) {
                return v.map((v) => {
                    if (typeof (v) === 'string' || (typeof (v) === 'object' && v.constructor.name === 'Date')) {
                        return new Date(v)
                    } else if (typeof (v) === 'number') {
                        return new Date(v * 1000)
                    }
                    throw new Error(`Unknown type for date ${v} ${typeof (v)}`)
                })
            }
        }
    }
    throw new Error(`${prop} not found as date[] in ${typeof props}`)
}

export type ConstructorFunc<Y> = (params: Partial<Exclude<Y | undefined, null>>) => Y;

export function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: keyof P): Y {
    return GetObjectFunctionPropOrThrow<Y>(props, prop, (e) => e as Y)
}

export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>): Y {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'object') {
                return constructorFunc(v as {})
            }
        }
    }
    throw new Error(`${prop} not found as object in ${typeof props}`)
}

export function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: Y): Y {
    try {
        return GetObjectPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
}

export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: keyof P): X {
    return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, (e) => e as Y)
}

export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>): X {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (Array.isArray(v)) {
                return v.map(constructorFunc) as X;
            }
        }
    }
    throw new Error(`${prop} not found as object in ${typeof props}`)
}

export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: keyof P, defaultValue: X): X {
    try {
        return GetObjectArrayPropOrThrow<Y, X>(props, prop)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: keyof P, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
}
