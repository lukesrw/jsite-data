/*global describe context it*/

/**
 * Node.js packages
 */
const { inspect } = require("util");

/**
 * Npm modules
 */
const { expect } = require("chai");

/**
 * Lib Files
 */
const Data = require("../index");

/**
 * Sample data
 */
/**
 * @returns {void}
 */
class MyClass1 {}
function MyClass2() {} // eslint-disable-line

/**
 * Constants
 */
const VOWELS = ["a", "e", "i", "o", "u"];
const TYPES = {
    Array: [],
    Boolean: true,
    Function: MyClass1,
    NaN,
    Null: null,
    Number: 1,
    Object: {},
    String: "string",
    Symbol: Symbol("symbol"),
    Undefined: undefined
};
const ISTYPE_INPUTS = [[], [false], [true]];
const ISTYPE_INPUT_TYPES = 3;
const ISEQUAL_INPUTS = [[], [true, false], [false, false], [true, true], [false, true]];
const ISIN_JSON_ONLY = [false, false, true, false, false, true];

/**
 * Tests
 */
let tests = {
    _getLength: {
        cases: {
            Arrays: {
                "0 items should have length of 0": [[], 0],
                "1 items should have length of 1": [["one"], 1],
                "2 items should have length of 2": [["one", "two"], 2]
            },
            Booleans: {
                "False should have length of 1": [false, 1],
                "True should have length of 1": [true, 1]
            },
            Functions: {
                "Function should have length of constructor name": [TYPES.Function, TYPES.Function.name.length]
            },
            NaN: {
                "NaN should have length of 0": [NaN, 0]
            },
            Null: {
                "Null should have length of 0": [null, 0]
            },
            Numbers: {
                "Number 0 should have length of 0": [0, 0],
                "Number 1 should have length of 1": [1, 1],
                "Number 10 should have length of 10": [10, 10],
                "Number 2 should have length of 2": [2, 2]
            },
            Objects: {
                "0 keys should have length of 0": [{}, 0],
                "1 key should have length of 1": [{ one: 1 }, 1],
                "2 keys should have length of 2": [{ one: 1, two: 2 }, 2]
            },
            Strings: {
                "String of value '' should have length of 0": ["", 0],
                "String of value '1' should have length of 1": ["1", 1],
                "String of value '10' should have length of 2": ["10", 2],
                "String of value '2' should have length of 1": ["2", 1],
                "String of value 'a' should have length of 1": ["a", 1],
                "String of value 'ab' should have length of 2": ["ab", 2]
            },
            Symbols: {
                "Symbol of description '' should have length of 0": [Symbol(""), 0],
                "Symbol of description '1' should have length of 1": [Symbol("1"), 1],
                "Symbol of description '10' should have length of 2": [Symbol("10"), 2],
                "Symbol of description '2' should have length of 1": [Symbol("2"), 1],
                "Symbol of description 'a' should have length of 1": [Symbol("a"), 1],
                "Symbol of description 'ab' should have length of 2": [Symbol("ab"), 2]
            },
            Undefined: {
                "Undefined should have length of 0": [undefined, 0],
                "Void 0 should have length of 0": [void 0, 0]
            }
        }
    },
    _getType: {
        cases: {
            Arrays: {
                "Array is an array": [[], "array"]
            },
            Functions: {
                "Class is a function": [MyClass1, "function"],
                "Function is a function": [MyClass2, "function"]
            },
            NaN: {
                "NaN is NaN": [NaN, "nan"]
            },
            Null: {
                "Null is null": [null, "null"]
            },
            Numbers: {
                "Infinity is a number": [Infinity, "number"],
                "Number is a number": [1, "number"],
                "PI is a number": [Math.PI, "number"]
            },
            Objects: {
                "Class instance is an object": [new MyClass1(), ["object", "object", "myclass1"]],
                "Function instance (class) is an object": [new MyClass2(), ["object", "object", "myclass2"]],
                "Object is an object": [{}, "object"]
            },
            Strings: {
                "String is a string": ["string", "string"]
            },
            Symbols: {
                "Symbol is symbol": [Symbol("Symbol"), "symbol"]
            },
            Undefined: {
                "Undefined is undefined": [undefined, "undefined"],
                "Void 0 is undefined": [void 0, "undefined"]
            }
        },
        inputs: [[], [false], [true]]
    },
    _isEqual: {
        cases: {
            Arrays: {
                "Array comparisons": [[], [false, false, false, true, true, false]]
            },
            Booleans: {
                "Boolean comparisons": [
                    true,
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array].length)
                        .fill(false)
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(true))
                        .concat(
                            new Array(ISEQUAL_INPUTS.length * [TYPES.Function, TYPES.NaN, TYPES.Null].length).fill(
                                false
                            )
                        )
                        .concat([false, false, true, false])
                ]
            },
            Functions: {
                "Function comparisons": [
                    MyClass1,
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array, TYPES.Boolean].length)
                        .fill(false)
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(true))
                        .concat(
                            new Array(
                                ISEQUAL_INPUTS.length *
                                    [TYPES.NaN, TYPES.Null, TYPES.Number, TYPES.Object, TYPES.String].length
                            ).fill(false)
                        )
                        .concat([false, false, false, true, true, false, false, false, true, true, false])
                ]
            },
            NaN: {
                "NaN comparisons": [
                    NaN,
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array, TYPES.Boolean, TYPES.Function].length)
                        .fill(false)
                        .concat([false, false, false, true, true, false, false, false, true, true, false])
                ]
            },
            Null: {
                "Null comparisons": [
                    null,
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array, TYPES.Boolean, TYPES.Function].length)
                        .fill(false)
                        .concat([false, false, false, true, true])
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(true))
                        .concat(
                            new Array(
                                ISEQUAL_INPUTS.length * [TYPES.Number, TYPES.Object, TYPES.String, TYPES.Symbol].length
                            ).fill(false)
                        )
                        .concat([false, false, true, false, false])
                ]
            },
            Numbers: {
                "Number comparisons": [
                    1,
                    new Array(ISEQUAL_INPUTS.length)
                        .fill(false)
                        .concat([false, false, true, false, false])
                        .concat(
                            new Array(ISEQUAL_INPUTS.length * [TYPES.Function, TYPES.NaN, TYPES.Null].length).fill(
                                false
                            )
                        )
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(true))
                        .concat(false)
                ]
            },
            Objects: {
                "Object comparisons": [
                    {},
                    new Array(
                        ISEQUAL_INPUTS.length *
                            [TYPES.Array, TYPES.Boolean, TYPES.Function, TYPES.NaN, TYPES.Null, TYPES.Number].length
                    )
                        .fill(false)
                        .concat([false, false, false, true, true])
                        .concat(false)
                ]
            },
            Strings: {
                "String comparisons": [
                    "string",
                    new Array(
                        ISEQUAL_INPUTS.length *
                            [
                                TYPES.Array,
                                TYPES.Boolean,
                                TYPES.Function,
                                TYPES.NaN,
                                TYPES.Null,
                                TYPES.Number,
                                TYPES.Object
                            ].length
                    )
                        .fill(false)
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(true))
                        .concat(false)
                ]
            },
            Symbols: {
                "Symbol comparisons": [
                    Symbol("symbol"),
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array, TYPES.Boolean].length)
                        .fill(false)
                        .concat([false, false, false, true, true])
                        .concat(
                            new Array(
                                ISEQUAL_INPUTS.length *
                                    [TYPES.NaN, TYPES.Null, TYPES.Number, TYPES.Object, TYPES.String].length
                            ).fill(false)
                        )
                        .concat([false, false, false, true, true, false, false, false, true, true])
                        .concat(false)
                ]
            },
            Undefined: {
                "Undefined comparisons": [
                    undefined,
                    new Array(ISEQUAL_INPUTS.length * [TYPES.Array, TYPES.Boolean].length)
                        .fill(false)
                        .concat([false, false, false, true, true])
                        .concat(new Array(ISEQUAL_INPUTS.length).fill(false))
                        .concat([false, false, true, false, false])
                        .concat(
                            new Array(ISEQUAL_INPUTS.length * [TYPES.Number, TYPES.Object, TYPES.String].length).fill(
                                false
                            )
                        )
                        .concat([false, false, false, true, true, true, true, true, true, true])
                        .concat(false)
                ]
            }
        },
        // see below
        inputs: []
    },
    _isFrozen: {
        cases: {
            Objects: {
                "Object is frozen": [Object.freeze({}), true],
                "Object is not frozen": [{}, false]
            }
        }
    },
    _isIn: {
        cases: {
            Arrays: {
                "Array doesn't exist in the container": [["one"], false],
                "Array exists in container": [[], ISIN_JSON_ONLY]
            },
            Booleans: {
                "Boolean doesn't exist in the container": [false, false],
                "Boolean exists in the container": [true, true]
            },
            Functions: {
                "Function doesn't exist in the container": [MyClass2, ISIN_JSON_ONLY],
                "Function exists in the container": [MyClass1, true]
            },
            NaN: {
                "NaN exists in the container": [NaN, [false, false, true, false]]
            },
            Numbers: {
                "Number doesn't exist in the container": [1, false],
                "Number exists in the container": [2, true]
            },
            Objects: {
                "Object doesn't exist in the container": [{ one: 1 }, false],
                "Object exists in the container": [{}, ISIN_JSON_ONLY]
            },
            Strings: {
                "String doesn't exist in the container": ["b", false],
                "String exists in the container": ["a", true]
            },
            Symbol: {
                "Symbol exists in the container": [Symbol("symbol1"), ISIN_JSON_ONLY]
            },
            Undefined: {
                "Undefined doesn't exist in the container": [undefined, ISIN_JSON_ONLY]
            }
        },
        inputs: [
            [["a", 2, {}, [], true, MyClass1, NaN, Symbol("symbol")]],
            [["a", 2, {}, [], true, MyClass1, NaN, Symbol("symbol")], false],
            [["a", 2, {}, [], true, MyClass1, NaN, Symbol("symbol")], true],
            [
                {
                    five: true,
                    four: [],
                    one: "a",
                    seven: Symbol("symbol"),
                    six: MyClass1,
                    three: {},
                    two: 2
                }
            ],
            [
                {
                    five: true,
                    four: [],
                    one: "a",
                    seven: Symbol("symbol"),
                    six: MyClass1,
                    three: {},
                    two: 2
                },
                false
            ],
            [
                {
                    five: true,
                    four: [],
                    one: "a",
                    seven: Symbol("symbol"),
                    six: MyClass1,
                    three: {},
                    two: 2
                },
                true
            ]
        ]
    },
    _isInstance: {
        cases: {
            Objects: {
                "MyClass1 is instance": [new MyClass1(), [true, false]],
                "MyClass2 is instance": [new MyClass2(), [false, true]]
            }
        },
        inputs: [[MyClass1], [MyClass2]]
    },
    _isLength: {
        cases: {
            /**
             * Intentionally not adding cases for other data types
             * This is sufficient as long as _getLength tests pass
             */
            Numbers: {
                /* eslint-disable */
                "Number Of Zero": [0, [false, false, false, true]],
                "Length Of One": [1, [true, false, false, true]],
                "Length Of Two": [2, [false, true, false, true]],
                "Length Of Three": [3, [false, true, true, true]],
                "Length Of Four": [4, [false, true, true, true]],
                "Length Of Five": [5, [false, true, true, true]],
                "Length Of Six": [6, [false, true, false, true]],
                "Length Of Seven": [7, [false, true, false, false]]
                /* eslint-enable */
            }
        },
        inputs: [[1], [2, null], [3, 5], [null, 6]] // eslint-disable-line
    },
    _isProperty: {
        cases: {
            Objects: {
                "String is property of object": ["one", [true, false]],
                "String is property of second object": ["two", [false, true]],
                "String isn't property of any object": ["three", false]
            }
        },
        inputs: [
            [
                {
                    one: true
                },
                {
                    two: false
                },
                {
                    nope: "string"
                }
            ]
        ]
    },
    _isRegex: {
        cases: {
            Strings: {
                "String doesn't match any regex": ["something", false],
                "String doesn't match regex": ["alphabet", false],
                "String matches at least one regex": ["xyz", [false, true]],
                "String matches regex": ["string", [true, false]]
            }
        },
        inputs: [[new RegExp("rin", "u")], [[new RegExp("abc", "u"), new RegExp("xyz", "u")]]]
    },
    _isSealed: {
        cases: {
            Objects: {
                "Object is not sealed": [{}, false],
                "Object is sealed": [Object.seal({}), true]
            }
        }
    }
};

/**
 * _isType tests (dynamically created)
 */
tests._isType = {
    cases: {},
    inputs: []
};

Object.keys(TYPES).forEach((type, type_i) => {
    let description = `${type} is a${
        VOWELS.indexOf(type.toLowerCase().substr(0, 1)) > -1 ? "n" : ""
    } ${type.toLowerCase()}`;

    let expect = new Array(ISTYPE_INPUTS.length * ISTYPE_INPUT_TYPES * type_i)
        .fill(false)
        .concat(new Array(ISTYPE_INPUTS.length * ISTYPE_INPUT_TYPES).fill(true))
        .concat(false);

    Object.assign(tests._isType.cases, {
        [type]: {
            [`${description}`]: [TYPES[type], expect]
        }
    });

    ISTYPE_INPUTS.forEach(inputs => {
        tests._isType.inputs.push(
            [type.toLowerCase()].concat(inputs),
            [[type.toLowerCase()]].concat(inputs),
            [{ [type.toLowerCase()]: true }].concat(inputs)
        );
    });

    ISEQUAL_INPUTS.forEach(inputs => {
        tests._isEqual.inputs.push([TYPES[type]].concat(inputs));
    });
});

/**
 * For debugging, save test json
 */
// const fs = require("fs");
// fs.promises.writeFile("./test.json", JSON.stringify(tests, null, 4));

/**
 * Run the tests object
 */
Object.keys(tests).forEach(method => {
    if (!Object.prototype.hasOwnProperty.call(tests[method], "inputs")) {
        tests[method].inputs = [[]];
    }

    describe(method, () => {
        Object.keys(tests[method].cases).forEach(name => {
            context(name, () => {
                if (Array.isArray(tests[method].cases[name])) {
                    throw new Error("Missing Context Name");
                }

                Object.keys(tests[method].cases[name]).forEach(desc => {
                    /**
                     * If test case "expected" values isn't an array, make array with single value
                     */
                    if (!Array.isArray(tests[method].cases[name][desc][1])) {
                        tests[method].cases[name][desc][1] = [tests[method].cases[name][desc][1]];
                    }

                    /**
                     * If test case "expected" array is shorter than number of tests, repeat last value
                     */
                    if (tests[method].cases[name][desc][1].length < tests[method].inputs.length) {
                        tests[method].cases[name][desc][1] = tests[method].cases[name][desc][1].concat(
                            new Array(tests[method].inputs.length - tests[method].cases[name][desc][1].length).fill(
                                tests[method].cases[name][desc][1][tests[method].cases[name][desc][1].length - 1]
                            )
                        );
                    }

                    tests[method].inputs.forEach((test, test_i) => {
                        let args = `(${[tests[method].cases[name][desc][0]]
                            .concat(test)
                            .map(item => inspect(item))
                            .join(", ")})`;

                        it(desc + (test.length > 0 ? `, arguments: ${args}` : ""), () => {
                            expect(Data[method](tests[method].cases[name][desc][0], ...test)).to.equal(
                                tests[method].cases[name][desc][1][test_i]
                            );
                        });
                    });
                });
            });
        });
    });
});
