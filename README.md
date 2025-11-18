# tsobjectutils

**tsobjectutils** provides helper functions to read values from untyped JavaScript objects and marshal them into TypeScript classes. These utilities help avoid runtime errors when parsing JSON or other data sources by validating and converting properties on the fly.

## Why it exists

When working with TypeScript, it's common to receive data from external sources like APIs or local storage. This data is often untyped, meaning that the shape of the object is not guaranteed. Accessing fields directly can lead to runtime errors, such as `TypeError: Cannot read property '...' of undefined`.

This library provides a set of helper functions that allow you to safely extract and convert values from untyped objects. This makes it easy to construct a class from loose JSON without sprinkling checks throughout your code.

## How it helps

By using the helper functions provided by this library, you gain the following benefits:

* **Type safety:** The helper functions ensure that the values you extract from untyped objects have the correct type.
* **Null safety:** The helper functions handle null and undefined values gracefully, preventing runtime errors.
* **Code clarity:** The helper functions make your code more readable and easier to understand.
* **Reduced boilerplate:** The helper functions reduce the amount of boilerplate code you need to write.

## Installation

```bash
npm install @arran4/tsobjectutils
```

## Usage

Below is a simplified `User` model showing the intended pattern.

```typescript
import {
  GetStringPropOrDefault,
  GetDatePropOrDefault,
  GetBooleanPropOrDefault,
  GetObjectPropOrThrow,
  GetStringArrayPropOrDefault
} from "@arran4/tsobjectutils";

class UserSettings {
  constructor(
    props: Partial<Record<keyof UserSettings, unknown>> | null = null,
    public Theme: string = GetStringPropOrDefault(props, "Theme", "light")
  ) {}
}

export class User {
  constructor(
    props: Partial<Record<keyof User, unknown>> | null = null,
    public UserUID: string = GetStringPropOrDefault(props, "UserUID", ""),
    public Email: string = GetStringPropOrDefault(props, "Email", ""),
    public Name: string = GetStringPropOrDefault(props, "Name", ""),
    public Settings: UserSettings = GetObjectPropOrThrow<UserSettings>(props, "Settings"),
    public Tags: string[] = GetStringArrayPropOrDefault(props, "Tags", []),
    public Created: Date | null = GetDatePropOrDefault(props, "Created", null),
    public Active: boolean = GetBooleanPropOrDefault(props, "Active", false)
  ) {}
}
```

Common helpers can also be used independently:

```typescript
const lastLogin = GetDatePropOrDefault(rawUser, "LastLogin", new Date());
const settings = GetObjectPropOrThrow<UserSettings>(rawUser, "Settings");
const roles = GetStringArrayPropOrDefault(rawUser, "Roles", []);
const isAdmin = GetBooleanPropOrDefault(rawUser, "IsAdmin", false);
```

By relying on these helpers you gain:

* a single constructor argument for easy copying of an object
* safer unmarshalling of deserialized JSON objects

## API summary

- `GetStringPropOrDefault`, `GetStringPropOrDefaultFunction`, `GetStringPropOrThrow` – retrieve string properties
- `GetNumberPropOrDefault`, `GetNumberPropOrDefaultFunction`, `GetNumberPropOrThrow` – retrieve numeric properties
- `GetBigIntPropOrDefault`, `GetBigIntPropOrDefaultFunction`, `GetBigIntPropOrThrow` – retrieve bigint properties
- `GetDatePropOrDefault`, `GetDatePropOrDefaultFunction`, `GetDatePropOrThrow` – parse dates and timestamps
- `GetMapPropOrDefault`, `GetMapPropOrDefaultFunction`, `GetMapPropOrThrow` – retrieve map properties
- `GetStringArrayPropOrDefault`, `GetStringArrayPropOrDefaultFunction`, `GetStringArrayPropOrThrow` – read arrays of strings
- `GetDateArrayPropOrDefault`, `GetDateArrayPropOrDefaultFunction`, `GetDateArrayPropOrThrow` – read arrays of dates
- `GetObjectPropOrDefault`, `GetObjectPropOrDefaultFunction`, `GetObjectPropOrThrow` – get nested objects
- `GetObjectFunctionPropOrDefault`, `GetObjectFunctionPropOrThrow` – construct nested objects via a custom constructor
- `GetObjectPropOrDefaultAllowNull`, `GetObjectPropOrDefaultFunctionAllowNull`, `GetObjectPropOrThrowAllowNull` – get nested objects, allowing null values
- `GetObjectFunctionPropOrDefaultAllowNull`, `GetObjectFunctionPropOrThrowAllowNull` – construct nested objects via a custom constructor, allowing null values
- `GetObjectArrayPropOrDefault`, `GetObjectArrayPropOrDefaultFunction`, `GetObjectArrayPropOrThrow`, `GetObjectArrayFunctionPropOrDefault`, `GetObjectArrayFunctionPropOrThrow` – work with arrays of objects
- `GetBooleanPropOrDefault`, `GetBooleanPropOrDefaultFunction`, `GetBooleanFunctionPropOrDefault`, `GetBooleanPropOrThrow` – handle booleans
- `ConstructorFunc<T>` – type for custom constructors
- `ConstructorFuncAllowNull<T>` – type for custom constructors that allow null values

## Running tests

Use `npm test` to run the Jest suite and verify the utilities.

## Links

- [npm package](https://www.npmjs.com/package/@arran4/tsobjectutils)
- [repository](https://github.com/arran4/tsobjectutils)

## Definitions

<!-- grep 'export' src/index.ts | sed 's/ *{$/;/' | sort -->

```typescript
export function GetBigIntPropOrDefault<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R;
export function GetBigIntPropOrDefaultFunction<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetBigIntPropOrThrow<R extends bigint | null>(props: Record<string, unknown> | undefined | null, prop: string, message?: string): R;
export function GetBooleanFunctionPropOrDefault(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc: (v: unknown) => boolean, defaultValue:boolean):boolean;
export function GetBooleanFunctionPropOrDefaultFunction(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc: (v: unknown) => boolean, defaultValue: () =>boolean):boolean;
export function GetBooleanPropOrDefault(props:Record<string, unknown> | undefined | null, prop:string, defaultValue:boolean):boolean;
export function GetBooleanPropOrDefaultFunction(props:Record<string, unknown> | undefined | null, prop:string, defaultValue: () =>boolean):boolean;
export function GetBooleanPropOrThrow(props:Record<string, unknown> | undefined | null, prop:string, constructorFunc?: (v: unknown) => boolean):boolean;
export function GetDateArrayPropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): Date[] | R;
export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): Date[] | R;
export function GetDateArrayPropOrThrow(props: Record<string, unknown> | undefined | null, prop: string): Date[];
export function GetDatePropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R | Date;
export function GetDatePropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R | Date;
export function GetDatePropOrThrow(props: Record<string, unknown> | undefined | null, prop: string): Date;
export function GetMapPropOrDefault<K, V, R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): Map<K, V> | R;
export function GetMapPropOrDefaultFunction<K, V, R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): Map<K, V> | R;
export function GetMapPropOrThrow<K, V>(props: Record<string, unknown> | undefined | null, prop: string, message?: string): Map<K, V>;
export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R;
export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, unknown> | undefined | null, prop: string, message? : string): R;
export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X;
export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): X;
export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: X): X;
export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X;
export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, unknown> | undefined | null, prop: string): X;
export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y;
export function GetObjectFunctionPropOrDefaultAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, defaultValue: Y): Y;
export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, message? : string): Y;
export function GetObjectFunctionPropOrThrowAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, message?: string): Y;
export function GetObjectPropOrDefault<Y>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: Y): Y;
export function GetObjectPropOrDefaultAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: Y): Y;
export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y;
export function GetObjectPropOrDefaultFunctionAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string, constructorFunc: ConstructorFuncAllowNull<Y>, defaultValue: () => Y): Y;
export function GetObjectPropOrThrow<Y>(props: Record<string, unknown> | undefined | null, prop: string): Y;
export function GetObjectPropOrThrowAllowNull<Y>(props: Record<string, unknown> | undefined | null, prop: string): Y;
export function GetStringArrayPropOrDefault<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): string[] | R;
export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): string[] | R;
export function GetStringArrayPropOrThrow(props: Record<string, unknown> | undefined | null, prop: string, message? : string): string[];
export function GetStringPropOrDefault<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultValue: R): R;
export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetStringPropOrThrow<R extends string | null>(props: Record<string, unknown> | undefined | null, prop: string, message? : string): R;
export type ConstructorFunc<Y> = (params: object) => Y;
export type ConstructorFuncAllowNull<Y> = (params: object | null) => Y;
```

Check [Tests for example usage.](./src/index.test.ts)
