"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTry = exports.isPromise = void 0;
const isPromise = (value) => {
    return value instanceof Promise;
};
exports.isPromise = isPromise;
function makeTry(callback, options) {
    let controller = null;
    const wrapFunc = (...args) => {
        try {
            const result = callback(...args);
            if ((0, exports.isPromise)(result)) {
                controller === null || controller === void 0 ? void 0 : controller.abort();
                const promise = new Promise((res, rej) => {
                    if (options === null || options === void 0 ? void 0 : options.abort) {
                        controller = new AbortController();
                    }
                    controller === null || controller === void 0 ? void 0 : controller.signal.addEventListener('abort', () => {
                        var _a;
                        res({
                            result: null,
                            hasError: true,
                            err: new Error((_a = options === null || options === void 0 ? void 0 : options.reason) !== null && _a !== void 0 ? _a : 'abort'),
                        });
                    });
                    result.then((value) => {
                        res({
                            result: value,
                            hasError: false,
                            err: null,
                        });
                    }).catch((e) => {
                        res({
                            result: null,
                            hasError: true,
                            err: e,
                        });
                    });
                });
                return promise;
            }
            return {
                hasError: false,
                result,
                err: null
            };
        }
        catch (err) {
            return {
                result: null,
                hasError: true,
                err
            };
        }
    };
    if (options === null || options === void 0 ? void 0 : options.abort) {
        wrapFunc.abort = () => controller === null || controller === void 0 ? void 0 : controller.abort();
    }
    return wrapFunc;
}
exports.makeTry = makeTry;
