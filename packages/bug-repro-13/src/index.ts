
import { Bar } from "./bar";

export type Foo = string;

export function foo(arg: Foo) {
  return "Hello!";
}

export let x: Bar = foo(42);
