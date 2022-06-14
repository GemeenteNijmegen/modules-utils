# Nijmegen Utils

A library of utilities used by the municipality of Nijmegen.

## Available utilities:
- **BSN**: A convenience class wrapping a BSN-number. It validates them on creation, ensuring that further use of the BSN is safe. Useage:

```
const { Bsn } = require('@gemeentenijmegen/utils');

try {
    const myBsn = new Bsn('999996708');
    doSomethingWith(myBsn.bsn);
} catch (err) {
    console.error('The BSN wasn't valid');
}