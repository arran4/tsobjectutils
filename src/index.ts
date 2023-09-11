export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R {
    try {
        return GetStringPropOrThrow<R>(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetStringPropOrDefault<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R {
    return GetStringPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetStringPropOrThrow<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, message? : string): R {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'string') {
                return v as R
            }
        }
    }
    throw new Error(message ?? `${prop} not found as string in ${typeof props}`)
}

export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R {
    try {
        return GetNumberPropOrThrow<R>(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R {
    return GetNumberPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, message? : string): R {
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
    throw new Error(message ?? `${prop} not found as number in ${typeof props}`)
}

export function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R | Date {
    try {
        return GetDatePropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetDatePropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R | Date {
    return GetDatePropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetDatePropOrThrow(props: Record<string, any> | undefined | null, prop: string): Date {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'object') {
                return v as Date
            } else if (typeof v === 'string') {
                return new Date(v as string)
            } else if (typeof v === 'number') {
                return new Date((v as number) * 1000)
            }
        }
    }
    throw new Error(`${prop} not found as date in ${typeof props}`)
}

export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): string[] | R {
    try {
        return GetStringArrayPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
}

export function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): string[] | R {
    return GetStringArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined | null, prop: string, message? : string): string[] {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (Array.isArray(v)) {
                return v.map((v) => v.toString())
            }
        }
    }
    throw new Error(message ?? `${prop} not found as string[] in ${typeof props}`)
}

export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): Date[] | R {
    try {
        return GetDateArrayPropOrThrow(props, prop)
    } catch (e) {
        if (!(e?.toString() ?? "").includes("not found as date[]")) {
            throw e;
        }
    }
    return defaultFunction();
}

export function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): Date[] | R {
    return GetDateArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetDateArrayPropOrThrow(props: Record<string, any> | undefined | null, prop: string): Date[] {
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

export function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string): Y {
    return GetObjectFunctionPropOrThrow<Y>(props, prop, (e) => e as Y)
}

export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): Y {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (typeof v === 'object') {
                return constructorFunc(v as {})
            }
        }
    }
    throw new Error(message ?? `${prop} not found as object in ${typeof props}`)
}

export function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, defaultValue: Y): Y {
    try {
        return GetObjectPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
}

export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string): X {
    return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, (e) => e as Y)
}

export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): X {
    if (props) {
        if (prop in props) {
            let v = props[prop];
            if (Array.isArray(v)) {
                return v.map(constructorFunc) as X;
            }
        }
    }
    throw new Error(message ?? `${prop} not found as object in ${typeof props}`)
}

export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: X): X {
    try {
        return GetObjectArrayPropOrThrow<Y, X>(props, prop)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
}

export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
}

export function GetBooleanPropOrThrow(props:Record<string, any> | undefined | null, prop:string, constructorFunc?: ConstructorFunc<boolean>):boolean {
    if (props && prop in props) {
        let v = props[prop];
        if (constructorFunc) {
            return constructorFunc(v)
        } else if (typeof v === 'boolean') {
            return v;
        }
    }
    throw new Error(`${prop} not found as boolean in ${typeof props}`);
}

export function GetBooleanPropOrDefaultFunction(props:Record<string, any> | undefined | null, prop:string, defaultValue: () =>boolean):boolean {
    try {
        return GetBooleanPropOrThrow(props, prop);
    }
    catch (e) {
    }
    return defaultValue();
}

export function GetBooleanPropOrDefault(props:Record<string, any> | undefined | null, prop:string, defaultValue:boolean):boolean {
    return GetBooleanPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetBooleanFunctionPropOrDefaultFunction(props:Record<string, any> | undefined | null, prop:string, constructorFunc: ConstructorFunc<boolean>, defaultValue: () =>boolean):boolean {
    try {
        return GetBooleanPropOrThrow(props, prop, constructorFunc);
    }
    catch (e) {
    }
    return defaultValue();
}

export function GetBooleanFunctionPropOrDefault(props:Record<string, any> | undefined | null, prop:string, constructorFunc: ConstructorFunc<boolean>, defaultValue:boolean):boolean {
    return GetBooleanFunctionPropOrDefaultFunction(props, prop, constructorFunc, () => defaultValue);
}

