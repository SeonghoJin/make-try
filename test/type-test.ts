import {
    MakeTryReturn,
    Function,
    MakeSyncReturn,
    MakeAsyncReturn,
} from "../src";

export type True<T extends true> = T;
export type Equal<A, B> =
    A extends B ?
    B extends A ?
    true :
    false :
    false;

type TestCase<T extends Function> = (...args: Parameters<T>) => MakeTryReturn<T>;

type TestCases = [
    True<Equal<TestCase<() => void>, () => MakeSyncReturn<() => void>>>,
    True<Equal<TestCase<() => number>, () => MakeSyncReturn<() => number>>>,
    True<Equal<TestCase<(a: string, b: number) => number>, (a: string, b: number) => MakeSyncReturn<() => number>>>,
    True<Equal<TestCase<() => Promise<void>>, () => MakeAsyncReturn<() => Promise<void>>>>,
    True<Equal<TestCase<() => Promise<number>>, () => MakeAsyncReturn<() => Promise<number>>>>,
    True<Equal<TestCase<(a: number, b: number) => Promise<number>>, (a: number, b: number) => MakeAsyncReturn<() => Promise<number>>>>,
]
