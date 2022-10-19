# Usage
```
npm i make-try
```

# Why


### test function
```typescript
import { makeTry } from "ts-try-catch-wrap";

// test function
const getSyncFile = (filename: string) => {
  if (Math.random() < 0.5) {
    throw new Error("fail");
  }

  return filename;
};
```

## referencing variable repeatedly
Bad - referencing variable repeatedly

```typescript
(() => {
  let file; // first show file variable

  try {
    // second show file variable
    file = getSyncFile("my-file-name");
  } catch (err: unknown) {
    console.log("error!");
    return;
    // handle err
  }

  // using file variable
  console.log(file);
})();
```

Nice - assigned only once

```typescript
(() => {
  const tryGetFileName = makeTry(getSyncFile);

  // first show file variable;
  const { err, hasError, result: file } = tryGetFileName("my-file-name");

  if (hasError) {
    console.log("error!");
    return;
    // handle err
  }

  // using file variable
  console.log(file);
})();
```

## try catch hell

 Bad - try catch hell

```typescript
let file1;
let file2; // after assiging the file, file2 can be assigned.

try {
  // second show file variable
  file1 = getSyncFile("file1");
  try {
    file2 = getSyncFile("file2");
  } catch (err: unknown) {
    console.log("file2 error!");
    return;
    // handle err;
  }
} catch (err: unknown) {
  console.log("file1 error!");
  return;
  // handle err
}

// using variables
console.log(file1);
console.log(file2);
```

Nice - remove try catch hell

```typescript
(() => {
  const getTrySyncFile = makeTry(getSyncFile);

  const {
    result: file1,
    hasError: file1HasErr,
    err: file1Err,
  } = getTrySyncFile("file1");

  if (file1HasErr) {
    console.log("file1 error!");
    return;
    // handle err
  }

  const {
    result: file2,
    hasError: file2HasErr,
    err: file2Err,
  } = getTrySyncFile("file2");

  if (file2HasErr) {
    console.log("file1 error!");
    return;
    // handle err
  }

  // using variables
  console.log(file1);
  console.log(file2);
})();
```

## So what about asynchronous?
just using makeTry

```typescript
const getAsyncFile = async (filename: string) => {
    await new Promise(res => setTimeout(res, 10));
    return filename;
}

(async () => {
    const tryGetFileName = makeTry(getAsyncFile);

    const { 
        hasError: file1hasError, 
        result: file1 
    } = await tryGetFileName('async-my-file-name-1');

    const { 
        hasError: file2hasError, 
        result: file2 
    } = await tryGetFileName('async-my-file-name-2');

    if (file1hasError || file2hasError) {
        return;
    }

    console.log(file1);
    console.log(file2);
})();
```

## Abort 

```typescript
  const slowApi = async () => {
    await new Promise(res => setTimeout(res, 3000));
    return 'hi'
  }
  
  const trySlowApi = makeTry(slowApi, {
    abort: true,
    reason: 'slow api'
  });
  
  trySlowApi().then(console.log);
  
  setTimeout(trySlowApi.abort, 1500);
```
