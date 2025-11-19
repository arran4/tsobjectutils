export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R {
    try {
        return GetStringPropOrThrow<R>(props, prop)
    } catch {
    }
    return defaultFunction();
}

export type PropsFromType<Type> =
    Type extends string ? string | number :
    Type extends number ? number | string :
    Type extends Date ? Date | number | string :
    Type extends string[] ? Array<string | number> :
    Type extends Date[] ? Array<Date | number | string> :
    Type extends boolean ? boolean | string | number :
    Type;

export type PropsFor<T> = Partial<{ [K in keyof T]: PropsFromType<T[K]> }>;
export type RestrictInterfaceToType<T, RT> = {[KN in keyof T as T[KN] extends RT ? KN : never]: T[KN] extends RT ? T[KN] : never};
export type TypeInType<T, RT> = {[KN in keyof T as T[KN] extends RT ? KN : never]: T[KN]};

export function GetBigIntPropOrThrow<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, message?: string): R {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (typeof v === 'bigint') {
                return v as R;
            }
            if (typeof v === 'number' || typeof v === 'string') {
                return BigInt(v) as R;
            }
        }
    }
    throw new Error(message ?? `${prop} not found as BigInt in ${typeof props}`);
}

export function GetBigIntPropOrDefault<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R {
    try {
        return GetBigIntPropOrThrow(props, prop);
    } catch {
    }
    return defaultValue;
}

export function GetBigIntPropOrDefaultFunction<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R {
    try {
        return GetBigIntPropOrThrow(props, prop);
    } catch {
    }
    return defaultFunction();
}

export function GetStringPropOrDefault<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R {
    return GetStringPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetStringPropOrThrow<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, message? : string): R {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (typeof v === 'string') {
                return v as R
            }
            if (typeof v === 'number') {
                return v.toString() as R
            }
        }
    }
    throw new Error(message ?? `${prop} not found as string in ${typeof props}`)
}

export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R {
    try {
        return GetNumberPropOrThrow<R>(props, prop)
    } catch {
    }
    return defaultFunction();
}

export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R {
    return GetNumberPropOrDefaultFunction<R>(props, prop, () => defaultValue);
}

export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, message? : string): R {
    if (props) {
        if (prop in props) {
            const v = props[prop];
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

export function GetDatePropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R | Date {
    try {
        return GetDatePropOrThrow(props, prop)
    } catch {
    }
    return defaultFunction();
}

export function GetDatePropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R | Date {
    return GetDatePropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetDatePropOrThrow(props: Record<string, unknown> | undefined | null, prop: string): Date {
    if (props) {
        if (prop in props) {
            const v = props[prop];
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

export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): string[] | R {
    try {
        return GetStringArrayPropOrThrow(props, prop)
    } catch {
    }
    return defaultFunction();
}

export function GetStringArrayPropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): string[] | R {
    return GetStringArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetStringArrayPropOrThrow(props: Record<string, unknown> | undefined | null, prop: string, message? : string): string[] {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (Array.isArray(v)) {
                return v.map((v) => v.toString())
            }
        }
    }
    throw new Error(message ?? `${prop} not found as string[] in ${typeof props}`)
}

export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): Date[] | R {
    try {
        return GetDateArrayPropOrThrow(props, prop)
    } catch (e) {
        if (!((e as Error)?.toString() ?? "").includes("not found as date[]")) {
            throw e;
        }
    }
    return defaultFunction();
}

export function GetDateArrayPropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): Date[] | R {
    return GetDateArrayPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetDateArrayPropOrThrow(props: Record<string, unknown> | undefined | null, prop: string): Date[] {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (Array.isArray(v)) {
                return v.map((v) => {
                    if (typeof (v) === 'string' || (typeof (v) === 'object' && v?.constructor.name === 'Date')) {
                        return new Date(v as string | Date)
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

export type ConstructorFunc<Y> = (params: object) => Y;

export function GetObjectPropOrThrow<Y>(props: Record<string, unknown> | undefined | null, prop: string): Y {
    return GetObjectFunctionPropOrThrow<Y>(props, prop, (e) => e as Y)
}

export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): Y {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (typeof v === 'object' && v !== null) {
                return constructorFunc(v)
            }
        }
    }
    throw new Error(message ?? `${prop} not found as object in ${typeof props}`)
}

export function GetObjectPropOrDefault<Y>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: Y): Y {
    try {
        return GetObjectPropOrThrow(props, prop)
    } catch {
    }
    return defaultValue;
}

export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue;
}

export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y {
    try {
        return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue();
}

export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string): X {
    return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, (e) => e as Y)
}

export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): X {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (Array.isArray(v)) {
                return v.map(constructorFunc) as X;
            }
        }
    }
    throw new Error(message ?? `${prop} not found as object in ${typeof props}`)
}

export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: X): X {
    try {
        return GetObjectArrayPropOrThrow<Y, X>(props, prop)
    } catch {
    }
    return defaultValue;
}

export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue;
}

export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X {
    try {
        return GetObjectArrayFunctionPropOrThrow<Y, X>(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue();
}

export function GetBooleanPropOrThrow(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc?: (v: unknown) => boolean):boolean {
    if (props && prop in props) {
        const v = props[prop];
        if (constructorFunc) {
            return constructorFunc(v)
        } else if (typeof v === 'boolean') {
            return v;
        }
    }
    throw new Error(`${prop} not found as boolean in ${typeof props}`);
}

export function GetBooleanPropOrDefaultFunction(props:Record<string, unknown> | undefined | null, prop:string, defaultValue: () =>boolean):boolean {
    try {
        return GetBooleanPropOrThrow(props, prop);
    }
    catch {
    }
    return defaultValue();
}

export function GetBooleanPropOrDefault(props:Record<string, unknown> | undefined | null, prop:string, defaultValue:boolean):boolean {
    return GetBooleanPropOrDefaultFunction(props, prop, () => defaultValue);
}

export function GetBooleanFunctionPropOrDefaultFunction(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc: (v: unknown) => boolean, defaultValue: () =>boolean):boolean {
    try {
        return GetBooleanPropOrThrow(props, prop, constructorFunc);
    }
    catch {
    }
    return defaultValue();
}

export function GetBooleanFunctionPropOrDefault(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc: (v: unknown) => boolean, defaultValue:boolean):boolean {
    return GetBooleanFunctionPropOrDefaultFunction(props, prop, constructorFunc, () => defaultValue);
}

// Typed helpers using PropsFor/TypeInType to mirror the abandoned typed branch.
export function GetTypedStringPropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, string>, message?: string): string {
    return GetStringPropOrThrow<string>(props as Record<string, unknown> | undefined | null, prop as string, message);
}

export function GetTypedStringPropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, string>, defaultValue: string | null): string | null {
    return GetStringPropOrDefault<string | null>(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}

export function GetTypedNumberPropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, number>, message?: string): number {
    return GetNumberPropOrThrow<number>(props as Record<string, unknown> | undefined | null, prop as string, message);
}

export function GetTypedNumberPropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, number>, defaultValue: number | null): number | null {
    return GetNumberPropOrDefault<number | null>(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}

export function GetTypedDatePropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, Date>): Date {
    return GetDatePropOrThrow(props as Record<string, unknown> | undefined | null, prop as string);
}

export function GetTypedDatePropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, Date>, defaultValue: Date | null): Date | null {
    return GetDatePropOrDefault<Date | null>(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}

export function GetTypedStringArrayPropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, string[]>): string[] {
    return GetStringArrayPropOrThrow(props as Record<string, unknown> | undefined | null, prop as string);
}

export function GetTypedStringArrayPropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, string[]>, defaultValue: string[] | null): string[] | null {
    return GetStringArrayPropOrDefault<string[] | null>(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}

export function GetTypedDateArrayPropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, Date[]>): Date[] {
    return GetDateArrayPropOrThrow(props as Record<string, unknown> | undefined | null, prop as string);
}

export function GetTypedDateArrayPropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, Date[]>, defaultValue: Date[] | null): Date[] | null {
    return GetDateArrayPropOrDefault<Date[] | null>(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}

export function GetTypedBooleanPropOrThrow<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, boolean>, constructorFunc?: (v: unknown) => boolean): boolean {
    return GetBooleanPropOrThrow(props as Record<string, unknown> | undefined | null, prop as string, constructorFunc) as boolean;
}

export function GetTypedBooleanPropOrDefault<T>(props: PropsFor<T> | undefined | null, prop: keyof TypeInType<T, boolean>, defaultValue: boolean): boolean {
    return GetBooleanPropOrDefault(props as Record<string, unknown> | undefined | null, prop as string, defaultValue);
}


export function GetMapPropOrThrow<K, V>(props: Record<string, unknown> | undefined | null, prop: string, message?: string): Map<K, V> {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (v instanceof Map) {
                return v as Map<K,V>;
            }
            if (typeof v === 'object' && v !== null) {
                return new Map(Object.entries(v)) as Map<K, V>;
            }
        }
    }
    throw new Error(message ?? `${prop} not found as Map in ${typeof props}`);
}

export function GetMapPropOrDefault<K, V, R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): Map<K, V> | R {
    try {
        return GetMapPropOrThrow(props, prop);
    } catch {
    }
    return defaultValue;
}

export function GetMapPropOrDefaultFunction<K, V, R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): Map<K, V> | R {
    try {
        return GetMapPropOrThrow(props, prop);
    } catch {
    }
    return defaultFunction();
}

export type ConstructorFuncAllowNull<Y> = (params: object | null) => Y;

export function GetObjectPropOrThrowAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string): Y {
    return GetObjectFunctionPropOrThrowAllowNull<Y>(props, prop, (e) => e as Y)
}

export function GetObjectFunctionPropOrThrowAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, message?: string): Y {
    if (props) {
        if (prop in props) {
            const v = props[prop];
            if (typeof v === 'object') {
                return constructorFunc(v)
            }
        }
    }
    throw new Error(message ?? `${prop} not found as object in ${typeof props}`)
}

export function GetObjectPropOrDefaultAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: Y): Y {
    try {
        return GetObjectPropOrThrowAllowNull(props, prop)
    } catch {
    }
    return defaultValue;
}

export function GetObjectFunctionPropOrDefaultAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, defaultValue: Y): Y {
    try {
        return GetObjectFunctionPropOrThrowAllowNull(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue;
}

export function GetObjectPropOrDefaultFunctionAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, defaultValue: () => Y): Y {
    try {
        return GetObjectFunctionPropOrThrowAllowNull(props, prop, constructorFunc)
    } catch {
    }
    return defaultValue();
}