import type { Bar } from "./bar";

export type Foo = string;

export function foo(arg: Foo) {
	return "Hello!";
}
// Uncomment to see TS error!

// export let x: Bar = foo(42);
