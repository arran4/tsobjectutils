# tsobjectutils
Some typescript objects I use in a couple repos.

The intended purpose is for marshalling JSON objects into objects in a sane "semi checked" way. (You can never really 
be that sure.) 

Happy to accept additions, suggestions, etc.

# Usage

Install:
```
npm install @arran4/tsobjectutils
```

Basic idealized / intended use:
```
export class User {
  constructor(
    props? : Partial<Record<keyof User, unknown>> | null = null,
    public Email : string = GetStringPropOrDefault(props, "Email", ""),
    public Name : string = GetStringPropOrDefault(props, "Name", ""),
    public UserUID : string = GetStringPropOrDefault(props, "UserU0ID", ""),
    public Created : Date | null = GetDatePropOrDefault(props, "Created", null),
    public Modified : Date | null = GetDatePropOrDefault(props, "Modified", null),
  ) {}
}
```

By using the `props` component you both have created:
* an option on how to initialize the object
* an easy way to copy an object
* an easy way to unmarshal a deseiralized json object into an object with some assurance as to the content

# Definitions

```typescript
export declare function GetStringPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction: () => string | R): string | R;
export declare function GetStringPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue: string | R): string | R;
export declare function GetStringPropOrThrow(props: Record<string, any> | undefined, prop: string): string;
export declare function GetNumberPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction: () => number | R): number | R;
export declare function GetNumberPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue: number | R): number | R;
export declare function GetNumberPropOrThrow(props: Record<string, any> | undefined, prop: string): number;
export declare function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction: () => R): R | Date;
export declare function GetDatePropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue: R): R | Date;
export declare function GetDatePropOrThrow(props: Record<string, any> | undefined, prop: string): Date;
export declare function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction: () => R): string[] | R;
export declare function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue: R): string[] | R;
export declare function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined, prop: string): string[];
export declare function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined, prop: string, defaultFunction: () => R): Date[] | R;
export declare function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined, prop: string, defaultValue: R): Date[] | R;
export declare function GetDateArrayPropOrThrow(props: Record<string, any> | undefined, prop: string): Date[];
export declare type ConstructorFunc<Y> = (params: Partial<Exclude<Y | undefined, null>>) => Y;
export declare function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string): Y;
export declare function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>): Y;
export declare function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, defaultValue: Y): Y;
export declare function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y;
export declare function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y;
export declare function GetObjectArrayPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string): Y[];
export declare function GetObjectArrayFunctionPropOrThrow<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>): Y[];
export declare function GetObjectArrayPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, defaultValue: Y[]): Y[];
export declare function GetObjectArrayFunctionPropOrDefault<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y[]): Y[];
export declare function GetObjectArrayPropOrDefaultFunction<Y>(props: Record<string, any> | undefined, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y[]): Y[];
```
