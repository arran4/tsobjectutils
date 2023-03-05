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
    props : Partial<Record<keyof User, unknown>> | null = null,
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

<!-- grep 'export' src/index.ts | sed 's/ *{$/;/' | sort -->

```typescript
export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): Date[] | R;
export function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): Date[] | R;
export function GetDateArrayPropOrThrow(props: Record<string, any> | undefined | null, prop: string): Date[];
export function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R | Date;
export function GetDatePropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R | Date;
export function GetDatePropOrThrow(props: Record<string, any> | undefined | null, prop: string): Date;
export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R;
export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, any> | undefined | null, prop: string): R;
export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X;
export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>): X;
export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X;
export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: X): X;
export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string): X;
export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y;
export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>): Y;
export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y;
export function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, defaultValue: Y): Y;
export function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string): Y;
export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): string[] | R;
export function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): string[] | R;
export function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined | null, prop: string): string[];
export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetStringPropOrDefault<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R;
export function GetStringPropOrThrow<R extends string | null>(props: Record<string, any> | undefined | null, prop: string): R;
export type ConstructorFunc<Y> = (params: Partial<Exclude<Y | undefined, null>>) => Y;
```

Check [Tests for example usage.](./src/index.test.ts)
