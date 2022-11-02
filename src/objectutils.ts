export function GetStringPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction : () => string | R): string | R {
    try {
      return GetStringPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
  }
  export function GetStringPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue : string | R): string | R {
    return GetStringPropOrDefaultFunction(props, prop, () => defaultValue);
  }
  export function GetStringPropOrThrow(props: Record<string, any> | undefined, prop: string): string {
    if (props) {
      if (prop in props) {
        let v = props[prop];
        if (typeof v === 'string') {
          return v as string
        }
      }
    }
    throw new Error(`${prop} not found as string in ${typeof props}`)
  }
  
  export function GetNumberPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction : () => number | R): number | R {
    try {
      return GetNumberPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
  }
  export function GetNumberPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue : number | R): number | R {
    return GetNumberPropOrDefaultFunction(props, prop, () => defaultValue);
  }
  export function GetNumberPropOrThrow(props: Record<string, any> | undefined, prop: string): number {
    if (props) {
      if (prop in props) {
        let v = props[prop];
        if (typeof v === 'number') {
          return v as number
        }
        if (typeof v === 'string') {
          return +v
        }
      }
    }
    throw new Error(`${prop} not found as number in ${typeof props}`)
  }
  
  export function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction : () => R): R | Date {
    try {
      return GetDatePropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
  }
  export function GetDatePropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue : R): R | Date {
    return GetDatePropOrDefaultFunction(props, prop, () => defaultValue);
  }
  export function GetDatePropOrThrow(props: Record<string, any> | undefined, prop: string): Date {
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
  
  export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction : () => R): string[] | R {
    try {
      return GetStringArrayPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultFunction();
  }
  export function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue : R): string[] | R {
    return GetStringArrayPropOrDefaultFunction(props, prop, () => defaultValue);
  }
  export function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined, prop: string): string[] {
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
  
  export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction : () => R): Date[] | R {
    try {
      return GetDateArrayPropOrThrow(props, prop)
    } catch (e) {
      if (!e.toString().includes("not found as date[]")) {
        throw e;
      }
    }
    return defaultFunction();
  }
  export function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue : R): Date[] | R {
    return GetDateArrayPropOrDefaultFunction(props, prop, () => defaultValue);
  }
  export function GetDateArrayPropOrThrow(props: Record<string, any> | undefined, prop: string): Date[] {
    if (props) {
      if (prop in props) {
        let v = props[prop];
        if (Array.isArray(v)) {
          return v.map((v) => {
            if (typeof(v) === 'string' || typeof(v) === 'number' || (typeof(v) === 'object' && v.constructor.name === 'Date')) {
              return new Date(v)
            }
            throw new Error(`Unknown type for date ${v} ${typeof(v)}`)
          })
        }
      }
    }
    throw new Error(`${prop} not found as date[] in ${typeof props}`)
  }
  
  export type ConstructorFunc<Y> = (params: Partial<Exclude<Y | undefined, null>>) => Y;
  
  export function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string): Y {
    return GetObjectFunctionPropOrThrow<Y>(props, prop, (e) => e as Y)
  }
  export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>): Y {
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
  
  export function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, defaultValue: Y): Y {
    try {
      return GetObjectPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultValue;
  }
  
  export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y {
    try {
      return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
  }
  
  export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y {
    try {
      return GetObjectFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
  }
  
  export function GetObjectArrayPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string): Y[] {
    return GetObjectArrayFunctionPropOrThrow<Y>(props, prop, (e) => e as Y)
  }
  export function GetObjectArrayFunctionPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>): Y[] {
    if (props) {
      if (prop in props) {
        let v = props[prop];
        if (Array.isArray(v)) {
          return v.map(constructorFunc);
        }
      }
    }
    throw new Error(`${prop} not found as object in ${typeof props}`)
  }
  
  export function GetObjectArrayPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, defaultValue: Y[]): Y[] {
    try {
      return GetObjectArrayPropOrThrow(props, prop)
    } catch (e) {
    }
    return defaultValue;
  }
  
  export function GetObjectArrayFunctionPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y[]): Y[] {
    try {
      return GetObjectArrayFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue;
  }
  
  export function GetObjectArrayPropOrDefaultFunction<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y[]): Y[] {
    try {
      return GetObjectArrayFunctionPropOrThrow(props, prop, constructorFunc)
    } catch (e) {
    }
    return defaultValue();
  }
  