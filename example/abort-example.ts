import {makeTry} from "ts-try-catch-wrap";

const slowApi = async () => {
    await new Promise(res => setTimeout(res, 3000));
    return 'hi'
}

const trySlowApi = makeTry(slowApi, {
    abort: true,
    reason: 'slow api'
});

trySlowApi().then(console.log);

if(Math.random() < 0.5){
    setTimeout(trySlowApi.abort, 1500);
}
