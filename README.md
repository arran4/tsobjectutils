# tsobjectutils

**tsobjectutils** provides helper functions to read values from untyped JavaScript objects and marshal them into TypeScript classes. These utilities help avoid runtime errors when parsing JSON or other data sources by validating and converting properties on the fly.

## Why it exists

Many applications receive data from APIs or local storage where the shape is only "semi-checked". Accessing fields directly can lead to `undefined` values or type errors. This library offers small helpers that safely extract strings, numbers, dates, objects and arrays. They make it easy to construct a class from loose JSON without sprinkling checks throughout your code.

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
- `GetDatePropOrDefault`, `GetDatePropOrDefaultFunction`, `GetDatePropOrThrow` – parse dates and timestamps
- `GetStringArrayPropOrDefault`, `GetStringArrayPropOrDefaultFunction`, `GetStringArrayPropOrThrow` – read arrays of strings
- `GetDateArrayPropOrDefault`, `GetDateArrayPropOrDefaultFunction`, `GetDateArrayPropOrThrow` – read arrays of dates
- `GetObjectPropOrDefault`, `GetObjectPropOrDefaultFunction`, `GetObjectPropOrThrow` – get nested objects
- `GetObjectFunctionPropOrDefault`, `GetObjectFunctionPropOrThrow` – construct nested objects via a custom constructor
- `GetObjectArrayPropOrDefault`, `GetObjectArrayPropOrDefaultFunction`, `GetObjectArrayPropOrThrow`, `GetObjectArrayFunctionPropOrDefault`, `GetObjectArrayFunctionPropOrThrow` – work with arrays of objects
- `GetBooleanPropOrDefault`, `GetBooleanPropOrDefaultFunction`, `GetBooleanFunctionPropOrDefault`, `GetBooleanPropOrThrow` – handle booleans
- `ConstructorFunc<T>` – type for custom constructors

## Running tests

Use `npm test` to run the Jest suite and verify the utilities.

## Links

- [npm package](https://www.npmjs.com/package/@arran4/tsobjectutils)
- [repository](https://github.com/arran4/tsobjectutils)

## Definitions

<!-- grep 'export' src/index.ts | sed 's/ *{$/;/' | sort -->

```typescript
export function GetDateArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): Date[] | R;
export function GetDateArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): Date[] | R;
export function GetDateArrayPropOrThrow(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): Date[];
export function GetDatePropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R | Date;
export function GetDatePropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R | Date;
export function GetDatePropOrThrow(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): Date;
export function GetNumberPropOrDefaultFunction<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetNumberPropOrDefault<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R;
export function GetNumberPropOrThrow<R extends number | null>(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): R;
export function GetObjectArrayFunctionPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: X): X;
export function GetObjectArrayFunctionPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>): X;
export function GetObjectArrayPropOrDefaultFunction<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => X): X;
export function GetObjectArrayPropOrDefault<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: X): X;
export function GetObjectArrayPropOrThrow<Y, X extends Y[] | null>(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): X;
export function GetObjectFunctionPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: Y): Y;
export function GetObjectFunctionPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>): Y;
export function GetObjectPropOrDefaultFunction<Y>(props: Record<string, any> | undefined | null, prop: string, constructorFunc: ConstructorFunc<Y>, defaultValue: () => Y): Y;
export function GetObjectPropOrDefault<Y>(props: Record<string, any> | undefined | null, prop: string, defaultValue: Y): Y;
export function GetObjectPropOrThrow<Y>(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): Y;
export function GetStringArrayPropOrDefaultFunction<R>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): string[] | R;
export function GetStringArrayPropOrDefault<R>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): string[] | R;
export function GetStringArrayPropOrThrow<T>(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): string[];
export function GetStringPropOrDefaultFunction<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultFunction: () => R): R;
export function GetStringPropOrDefault<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, defaultValue: R): R;
export function GetStringPropOrThrow<R extends string | null>(props: Record<string, any> | undefined | null, prop: string, errorMessage?: string): R;
export function GetBooleanPropOrThrow(props:any, prop:string):boolean
export function GetBooleanPropOrDefaultFunction(props:any, prop:string, defaultFunction:any):boolean
export function GetBooleanPropOrDefault(props:any, prop:string, defaultValue:boolean):boolean
export type ConstructorFunc<Y> = (params: Partial<Exclude<Y | undefined, null>>) => Y;
```

Check [Tests for example usage.](./src/index.test.ts)

