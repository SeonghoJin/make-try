export type Function = (...args: any[]) => any;

export type AsyncFunction = (...args: any[]) => Promise<any>;

export type UnPackPromise<T> = T extends Promise<infer Payload>
    ? Payload
    : T;

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
    Fullfiled<UnPackPromise<T>>;

export type IsAsyncFunction<T extends Function> =
    ReturnType<T> extends never ?
    false :
    T extends (...args: any[]) => infer R
    ? R extends Promise<any>
    ? true
    : false
    : false;

export const isPromise = <T extends Promise<unknown>>(value: T) => {
    return value instanceof Promise;
}

export type MakeSyncReturn<T extends Function> =
    (...args: Parameters<T>) => MakeReturnPayload<ReturnType<T>>

export type MakeAsyncReturn<T extends AsyncFunction> =
    (...args: Parameters<T>) => Promise<MakeReturnPayload<ReturnType<T>>>;

export type MakeTryReturn<T extends Function> =
    IsAsyncFunction<T> extends true
    ? MakeAsyncReturn<T>
    : MakeSyncReturn<T>;

export const makeTry = <T extends Function>(callback: T):
    MakeTryReturn<T> => {

    // @ts-ignore
    return (...args: Parameters<T>) => {
        try {
            const result = callback(...args);
            if (isPromise(result)) {
                return new Promise(res => {
                    result.then((value: UnPackPromise<ReturnType<T>>) => {
                        res({
                            result: value,
                            hasError: false,
                            err: null
                        });
                    }).catch((e: unknown) => {
                        res({
                            result: null,
                            hasError: true,
                            err: e
                        });
                    })
                })
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
}