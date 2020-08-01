# JSite Data

It's a generic object for holding data, with set validations.

## Validation

JSite Data comes with built-in data validation methods, these are:

-   \_isEqual, check if a variable equals a given variable
-   \_isFrozen, check if a variable is a frozen object
-   \_isIn, check if a variable exists in a given object/array
-   \_isInstance, check if a variable is an instance of another object
-   \_isLength, check if a variable is greater than, less than, between, or equal to a length
-   \_isProperty, check if a variable is a property of a given object
-   \_isRegex, check if a variable matches a given regex
-   \_isSealed, check if a variable is a sealed object
-   \_isType, check if a variable is of a certain type
-   \_isValid, check if a variable is valid for a given property

Previous versions of JSite Data also had:

-   isBetween (superseded by \_isLength)

These can be used standalone, or when building an extension object.
...for arguments and usage, see the source code - easier than explaining.

---

## Examples

### Validation, without extending

JSite Data can be used without extending, you can call any of the static functions against a given set of arguments (see source code for more).

```js
const Data = require("jsite-data");

let foo = "this is a string";
Data._isType(foo, "string"); // returns true, "foo" is a string
Data._isType(foo, ["string", "object"]); // returns true, "foo" is one of the provided types
Data._isType(foo, { string: true, object: true }); // returns true, "foo" is one of the propeties
```

## Extension (extend)

JSite Data's main purpose is to be extended into further objects for use in applications, ensuring that validation is met before the property is set on the object. You can extend the class as follows:

```js
const Data = require("jsite-data");

class YourObect extends Data {
    constructor(values) {
        // if you have a constructor
        super(values);
    }

    // you need a getProperties static
    static getProperties() {
        return {
            name: {
                default: "foo",
                equal: [["test"], "Custom Error"],
                frozen: [[], "Custom Error"],
                get: value => value.substr(1),
                in: [["value"], "Custom Error"],
                instance: [[Data], "Custom Error"],
                length: [[1, 2], "Custom Error"],
                null: true,
                property: [["test"], "Custom Error"],
                regex: [[/es/u], "Custom Error"],
                sealed: [[], "Custom Error"],
                set: value => String(value).substr(1),
                type: [["string"], "Custom Error"],
                valid: [["other_property"], "Custom Error"]
            }
        };
    }
}

// use it...
let Instance = new YourObject({
    name: "atest"
});
```
