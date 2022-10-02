export declare type Function = (...args: any[]) => any;
export declare type AsyncFunction = (...args: any[]) => Promise<any>;
export declare type Fullfiled<T> = {
    err: null;
    hasError: false;
    result: T;
};
export declare type Rejected = {
    result: null;
    hasError: true;
    err: unknown;
};
export declare type MakeReturnPayload<T> = Rejected | Fullfiled<Awaited<T>>;
export declare type IsAsyncFunction<T extends Function> = ReturnType<T> extends never ? false : ReturnType<T> extends Promise<any> ? true : false;
export declare type MakeSyncReturn<T extends Function> = (...args: Parameters<T>) => MakeReturnPayload<ReturnType<T>>;
export declare type MakeAsyncReturn<T extends AsyncFunction> = (...args: Parameters<T>) => Promise<MakeReturnPayload<ReturnType<T>>> & CanAbort;
export declare type MakeTryReturn<T extends Function> = IsAsyncFunction<T> extends true ? MakeAsyncReturn<T> : MakeSyncReturn<T>;
export declare const isPromise: <T extends Promise<unknown>>(value: T) => boolean;
export interface CanAbort {
    abort(): void;
}
export declare type TryCatchWrapOption = {
    abort?: boolean;
    reason?: string;
};
export declare function makeTry<T extends AsyncFunction>(callback: T, options?: TryCatchWrapOption): MakeTryReturn<T> & CanAbort;
export declare function makeTry<T extends Function>(callback: T): MakeTryReturn<T>;
