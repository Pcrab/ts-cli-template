# pls-storage

A simple typescript library to enhance browser local/session storage.

## Usage

`pls-storage` provides two storages: `lstorage` for `localStorage`, and `sstorage` for `sessionStorage`.

Value can be any primitive type, or object that contains primitive types.

Functions can be stored due to the implementation of custom storage, but after reloading the page, all the functions will be lost.

```typescript
import { lstorage } from "pls-storage";

/** 
 *  "$PLS_STORAGE_testKey1": '{"value":"testStringValue"}'
 */
lstorage.setItem("testKey1", "testStringValue");
lstorage.getItem("testKey1") // "testStringValue"

/** 
 *  "$PLS_STORAGE_testKey2": '{"value":{"someValue1":123,"someValue2":"123"}}'
 */
lstorage.setItem("testKey2", {
    someValue1: 123,
    someValue2: "123"
});
lstorage.getItem("testKey2") // {someValue1: 123, someValue2: "123"}
```

`pls-storage` supports `readOnly` and `expiresAt` options.

``` typescript
import { lstorage } from "pls-storage";

/** 
 *  "$PLS_STORAGE_testKey3": '{"value":"testStringValue","expiresAt":"2022-09-19T09:11:48.367Z"}'
 */
lstorage.setItem("testKey1", "testStringValue", {
    // new Date().toJSON();
    expiresAt: new Date('2022-09-19T09:11:48.367Z')
});
lstorage.getItem("testKey1") // undefined

/** 
 *  "$PLS_STORAGE_testKey3": '{"value":"testStringValue","readOnly":true}'
 */
lstorage.setItem("testKey2", "testStringValue", {
    readOnly: true
});
lstorage.setItem("testKey2", "changedValue");
lstorage.getItem("testKey2") // "testStringValue"
```
