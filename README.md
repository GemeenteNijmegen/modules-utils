# Nijmegen Utils

A library of utilities used by the municipality of Nijmegen.

## Available utilities:
- [BSN validator](#bsn)
- [AWS utilities](#aws)

### BSN 
A convenience class wrapping a BSN-number. It validates them on creation, ensuring that further use of the BSN is safe. Useage:

```ts
const { Bsn } = require('@gemeentenijmegen/utils');

try {
    const myBsn = new Bsn('999996708');
    doSomethingWith(myBsn.bsn);
} catch (err) {
    console.error('The BSN wasn't valid');
}
```


### AWS
A utility with two methods `getParameter(name: string)` and `getSecret(arn: string)` for fetching parameters and secret strings from the parameter store or secret manager. Both functions return a promise.

```ts
const { AWS } = require('@gemeentenijmegen/utils');
const param = await AWS.getParameter('/cdk/path/to/ssm/param/');
const secret = await AWS.getSecret('/cdk/path/to/secrets/manager/secret');
```