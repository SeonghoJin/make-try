import { makeTry } from "../src/index";

test("make try function - async(success)", async () => {
    const tryTest1 = makeTry(async () => {
        return {
            a: 1,
            b: 2,
        };
    });

    const { result, err, hasError } = await tryTest1();
    expect(hasError).toBeFalsy();
    if (hasError === false) {
        expect(result.a).toEqual(1);
        expect(result.b).toEqual(2);
        expect(err).toEqual(null);
    }
});

test("make try function - async(fail)", async () => {
    const tryTest1 = makeTry(async () => {
        throw new Error();
    });

    const { result, err, hasError } = await tryTest1();
    expect(hasError).toBeTruthy();
    if (hasError) {
        expect(result).toEqual(null);
        expect(err).toBeInstanceOf(Error);
    }
});

test("make try function - abort", (done) => {
    const tryTest1 = makeTry(async () => {
        await new Promise(res => setTimeout(res, 1000));
        return 'hi';
    }, {
        abort: true,
        reason: 'hi',
    });

    let response = tryTest1();

    setTimeout(() => {
        tryTest1.abort();
    }, 500)

    response.then(({hasError, result, err}) => {
        expect(hasError).toBeTruthy();
        if (hasError) {
            expect(result).toEqual(null);
            expect(err).toBeInstanceOf(Error);
        }
    })
    setTimeout(() => {
        const response2 = tryTest1();

        setTimeout(() => {
            tryTest1.abort();
        }, 900)

        response2.then(({hasError, result, err}) => {
            expect(hasError).toBeTruthy();
            if (hasError) {
                expect(result).toEqual(null);
                expect(err).toBeInstanceOf(Error);
            }
            done();
        })
    }, 1500);
});

test("make try function - sync(success)", () => {
    const tryTest1 = makeTry(() => {
        return {
            a: 1,
            b: 2,
        };
    });

    const { result, err, hasError } = tryTest1();
    expect(hasError).toBeFalsy();
    if (hasError === false) {
        expect(result.a).toEqual(1);
        expect(result.b).toEqual(2);
        expect(err).toEqual(null);
        expect(hasError).toEqual(false);
    }
});

test("make try function - sync(fail)", () => {
    const tryTest1 = makeTry(() => {
        throw new Error();
    });

    const { result, err, hasError } = tryTest1();
    expect(hasError).toBeTruthy();
    if (hasError === true) {
        expect(result).toEqual(null);
        expect(err).toBeInstanceOf(Error);
    }
});
