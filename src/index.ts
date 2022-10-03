export type Function = (...args: any[]) => any;

export type AsyncFunction = (...args: any[]) => Promise<any>;

export type Fullfiled<T> = {
    err: null;
    hasError: false;
    result: T;
}

export type Rejected = {
    result: null;
    hasError: true;
    err: unknown;
}

export type MakeReturnPayload<T> =
    Rejected |
    Fullfiled<Awaited<T>>;

export type IsAsyncFunction<T extends Function> =
    ReturnType<T> extends never ?
    false :
    ReturnType<T> extends Promise<any>
    ? true
    : false;

export type MakeSyncReturn<T extends Function> =
    (...args: Parameters<T>) => MakeReturnPayload<ReturnType<T>>

export type MakeAsyncReturn<T extends AsyncFunction> =
    (...args: Parameters<T>) => Promise<MakeReturnPayload<ReturnType<T>>>

export type MakeTryReturn<T extends Function> =
    IsAsyncFunction<T> extends true
    ? MakeAsyncReturn<T>
    : MakeSyncReturn<T>;

export const isPromise = <T extends Promise<unknown>>(value: T) => {
    return value instanceof Promise;
}

export interface CanAbort {
    abort(): void;
}

export type TryCatchWrapOption = {
    abort?: boolean;
    reason?: string;
    latest?: boolean;
};

export function makeTry<T extends AsyncFunction, K extends TryCatchWrapOption>(callback: T, options?: K): MakeTryReturn<T> & (K['abort'] extends true ? CanAbort : {});
export function makeTry<T extends Function>(callback: T): MakeTryReturn<T>;
export function makeTry<T extends Function>(callback: T, options?: TryCatchWrapOption): unknown {
    let controller: AbortController | null = null;
    const wrapFunc = (...args: Parameters<T>) => {
        try {
            const result = callback(...args);
            if (isPromise(result)) {
                if(options?.latest){
                    controller?.abort();
                }
                const promise = new Promise((res, rej) => {
                    if(options?.abort){
                        controller = new AbortController();
                    }
                    controller?.signal.addEventListener('abort', () => {
                        res({
                            result: null,
                            hasError: true,
                            err: new Error(options?.reason ?? 'abort'),
                        });
                    })
                    result.then((value: Awaited<ReturnType<T>>) => {
                        res({
                            result: value,
                            hasError: false,
                            err: null,
                        });
                    }).catch((e: unknown) => {
                        res({
                            result: null,
                            hasError: true,
                            err: e,
                        });
                    })
                });

                return promise;
            }
            return {
                hasError: false,
                result,
                err: null
            }
        } catch (err) {
            return {
                result: null,
                hasError: true,
                err
            }
        }
    }

    if(options?.latest && !options?.abort){
        throw new Error('The abort option must be true to use the only option.');
    }

    wrapFunc.abort = () => {
        if(options?.abort){
            controller?.abort();
            return;
        }
        throw new Error('not defined abort, if you want use abort, abort is true in options');
    } ;

    return wrapFunc;
}
