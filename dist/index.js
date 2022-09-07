"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTry = exports.isPromise = void 0;
const isPromise = (value) => {
    return value instanceof Promise;
};
exports.isPromise = isPromise;
function makeTry(callback) {
    return (...args) => {
        try {
            const result = callback(...args);
            if ((0, exports.isPromise)(result)) {
                return new Promise(res => {
                    result.then((value) => {
                        res({
                            result: value,
                            hasError: false,
                            err: null
                        });
                    }).catch((e) => {
                        res({
                            result: null,
                            hasError: true,
                            err: e
                        });
                    });
                });
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
}
exports.makeTry = makeTry;
