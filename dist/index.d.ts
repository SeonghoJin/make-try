export declare type Function = (...args: any[]) => any;
export declare type AsyncFunction = (...args: any[]) => Promise<any>;
export declare type UnPackPromise<T> = T extends Promise<infer Payload> ? Payload : T;
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
export declare type MakeReturnPayload<T> = Rejected | Fullfiled<UnPackPromise<T>>;
export declare type IsAsyncFunction<T extends Function> = ReturnType<T> extends never ? false : T extends (...args: any[]) => infer R ? R extends Promise<any> ? true : false : false;
export declare type MakeSyncReturn<T extends Function> = (...args: Parameters<T>) => MakeReturnPayload<ReturnType<T>>;
export declare type MakeAsyncReturn<T extends AsyncFunction> = (...args: Parameters<T>) => Promise<MakeReturnPayload<ReturnType<T>>>;
export declare type MakeTryReturn<T extends Function> = IsAsyncFunction<T> extends true ? MakeAsyncReturn<T> : MakeSyncReturn<T>;
export declare const isPromise: <T extends Promise<unknown>>(value: T) => boolean;
export declare function makeTry<T extends AsyncFunction>(callback: T): MakeTryReturn<T>;
export declare function makeTry<T extends Function>(callback: T): MakeTryReturn<T>;
