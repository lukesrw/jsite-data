/**
 * Constants
 */
// what order rules are defined in
const INDEX_ARGUMENTS = 0;
const INDEX_ERROR = 1;
const INDEX_INVERT = 2;

// what we start a validation method with
const PREFIX_IS = "_is";

/**
 * Interfaces
 */
import * as Generic from "./interfaces/generic";
import { DataInterface, DataSetInterface } from "./interfaces/data";

export = class Data implements DataInterface {
    [name: string]: any;
    _properties: DataSetInterface;

    /**
     * Data instance, for controlled and validated operations
     *
     * @param {object} [values={}] initial values
     */
    constructor(values = {}) {
        // blank object, for later setting values of
        this._properties = {};

        // ensure values is an object
        if (!Data._isType(values, "object")) values = {};

        // define properties of this Data instance
        let properties = Data.getProperties();
        Object.keys(properties).forEach(property => {
            // using defineProperty, to allow us to control getter/setter
            Object.defineProperty(this, property, {
                configurable: true,
                get: () => {
                    // if the template has a "get" property
                    if (Object.prototype.hasOwnProperty.call(properties[property], "get")) {
                        // if the template "get" property is a function
                        if (Data._getType(properties[property].get) === "function") {
                            // run the current value through the function, then return
                            return properties[property].get(this._properties[property]);
                        }

                        return properties[property].get;
                    }

                    return this._properties[property];
                },
                set: value => {
                    if (
                        // if the template says this value can be null (and it is)
                        (Object.prototype.hasOwnProperty.call(properties[property], "null") &&
                            properties[property].null &&
                            value === null) ||
                        // if the template says this value can be undefined (and it is)
                        (Object.prototype.hasOwnProperty.call(properties[property], "undefined") &&
                            properties[property].undefined &&
                            value === undefined)
                    ) {
                        // skip and don't validate
                        return true;
                    }

                    // template might not be careful with custom setter
                    try {
                        // if the template has supplied a "set" and it's a function
                        if (
                            Object.prototype.hasOwnProperty.call(properties[property], "set") &&
                            Data._isType(properties[property].set, "function")
                        ) {
                            // run given value through custom setter before validating
                            value = properties[property].set(value, this);
                        }
                    } catch (error) {
                        // any setter errors will be logged, but not displayed
                        console.error(error);

                        throw new Error(`Invalid ${property}, unable to run setter.`);
                    }

                    // all rules passed, set the value
                    if (Data._isValid(value, property, true)) {
                        // if the template has supplied a "post" and it's a function
                        if (
                            Object.prototype.hasOwnProperty.call(properties[property], "post") &&
                            Data._isType(properties[property].post, "function")
                        ) {
                            // run post function
                            value = properties[property].post(value, this);
                        }

                        this._properties[property] = value;
                    }

                    return this;
                }
            });
        });

        this._fromObject(values);
    }

    /**
     * ...just in case the end user doesn't define it.
     *
     * @returns {object} literally {}
     */
    static getProperties(): DataSetInterface {
        return {};
    }

    // Normalizers

    /**
     * Get the length of a variable
     *
     * @param {*} of_variable to get the length of
     * @returns {number} length of the variable
     */
    static _getLength(of_variable: any) {
        switch (this._getType(of_variable)) {
            case "array":
                break;

            case "object":
                of_variable = Object.values(of_variable);
                break;

            case "function":
                of_variable = of_variable.name;
                break;

            case "boolean":
                return 1;

            case "symbol":
                /**
                 * https://developer.mozilla.org/en-US/docs/Glossary/Symbol
                 * ...of_variable.description doesn't seem to work at all.
                 */
                return of_variable.toString().length - "Symbol()".length;

            case "null":
            case "undefined":
            case "nan":
                return 0;

            case "number":
            case "bigint":
                return of_variable;

            default:
                of_variable = String(of_variable);
        }

        return of_variable.length;
    }

    /**
     * Get the type of a variable
     *
     * @param {*} of_variable to get the type of
     * @param {boolean} [strict_objects=false] whether to be strict with objects
     * @returns {string} type of the variable
     */
    static _getType(of_variable: any, strict_objects = false) {
        if (Number.isNaN(of_variable)) return "nan";

        if (!strict_objects && typeof of_variable === "object" && !Array.isArray(of_variable) && of_variable !== null) {
            return "object";
        }

        try {
            of_variable = Object.getPrototypeOf(of_variable).constructor.name.toLowerCase();
        } catch (ignore) {
            of_variable = Object.prototype.toString.call(of_variable).replace(/^\[object\s(.*)\]$/u, "$1");
        }

        return of_variable.toLowerCase();
    }

    // Validators

    /**
     * Validate the object property
     *
     * @param {*} variable to test
     * @param {string} property to validate against
     * @param {boolean} [is_strict=false] whether to throw errors
     * @returns {boolean} whether all rules pass
     */
    static _isValid(variable: any, property: string, is_strict = false) {
        let properties = this.getProperties();

        if (!Object.prototype.hasOwnProperty.call(properties, property)) {
            throw new Error(`${property} is not a valid property.`);
        }

        return Object.keys(properties[property]).every(rule => {
            let is_method = (PREFIX_IS + rule.substr(0, 1).toUpperCase() + rule.substr(1)) as keyof typeof Data;
            let get_method = `_get${rule.substr(0, 1).toUpperCase() + rule.substr(1)}` as keyof typeof Data;

            // if method exists with property
            if (typeof this[is_method] === "function") {
                let rule_display = rule.substr(0, 1).toUpperCase() + rule.substr(1);

                if (
                    !(
                        Array.isArray(properties[property][rule]) &&
                        this._isType(properties[property][rule][INDEX_ERROR], ["undefined", "string", "array"])
                    )
                ) {
                    throw new Error(`${rule_display} rule is invalid, bad array setup.`);
                }

                if (!this._isType(properties[property][rule][INDEX_ARGUMENTS], "array")) {
                    properties[property][rule][INDEX_ARGUMENTS] = [properties[property][rule][INDEX_ARGUMENTS]];
                }

                // run validation
                let result = (this[is_method] as Function)(variable, ...properties[property][rule][INDEX_ARGUMENTS]);
                if (
                    this._isType(properties[property][rule][INDEX_INVERT], "boolean") &&
                    properties[property][rule][INDEX_INVERT]
                ) {
                    result = !result;
                }

                if (!result) {
                    if (is_strict) {
                        switch (this._getType(properties[property][rule][INDEX_ERROR])) {
                            case "string":
                                throw new Error(properties[property][rule][INDEX_ERROR]);

                            case "function":
                                throw new Error(properties[property][rule][INDEX_ERROR](variable));
                        }

                        let error;
                        if (this._isType(this[get_method], "function")) {
                            error = ` is ${(this[get_method] as Function)(variable)}`;
                        }

                        throw new Error(
                            `${property} should be ${rule} of ${
                                properties[property][rule][INDEX_ARGUMENTS].join("/") + error
                            }`
                        );
                    }

                    return false;
                }
            }

            // no errors found on this rule
            return true;
        });
    }

    /**
     * Validate whether object is sealed
     *
     * @param {*} variable to test
     * @returns {boolean} whether object is sealed
     */
    static _isSealed(variable: any) {
        return typeof variable === "object" && Object.isSealed(variable);
    }

    /**
     * Validate whether object is frozen
     *
     * @param {*} variable to test
     * @returns {boolean} whether object is frozen
     */
    static _isFrozen(variable: any) {
        return typeof variable === "object" && Object.isFrozen(variable);
    }

    /**
     * Validate the type of variable
     *
     * @param {*} variable to test
     * @param {string|array|object} type to check
     *  - string, "array"
     *  - array, ["string", "array"]
     *  - object, { string: true, array: true }
     *
     * @param {boolean} [strict_objects=false] strict object checking
     * @returns {boolean} whether type matches
     */
    static _isType(variable: any, type: string | string[], strict_objects = false) {
        variable = this._getType(variable, strict_objects);

        if (Array.isArray(type)) {
            return type.includes(variable);
        }

        if (typeof type === "string") {
            return variable === type.toLowerCase();
        }

        if (typeof type === "object") {
            return Object.prototype.hasOwnProperty.call(type, variable) && type[variable];
        }

        // ensure type is one of above supported types
        throw new Error(`Invalid Type (${this._getType(type)})`);
    }

    /**
     * Validate whether variable is instance of class
     *
     * @param {*} variable to test
     * @param {function} Instance to verify
     * @returns {boolean} whether instance of
     */
    static _isInstance(variable: any, Instance: Function) {
        return this._isType(Instance, "function") && variable instanceof Instance;
    }

    /**
     * Validate the length of variable
     *
     * @param {*} variable to test
     * @param {number} minimum length of variable
     * @param {number} maximum length of variable
     * @returns {boolean} whether length conditions met
     */
    static _isLength(variable: any, minimum: number, maximum: number) {
        variable = this._getLength(variable);

        if (this._getType(maximum) === "undefined") maximum = minimum;

        return !(
            (this._getType(minimum) === "number" && variable < minimum) ||
            (this._getType(maximum) === "number" && variable > maximum)
        );
    }

    /**
     * Validate whether variables are the same
     *
     * @param {*} variable to test
     * @param {*} comparison to check
     * @param {boolean} [is_strict=true] whether to use strict comparison
     * @param {boolean} [compare_as_json=false] whether to compare as JSON
     * @param {boolean} [is_not=false] whether to invert result
     * @returns {boolean} whether variable match
     */
    static _isEqual(variable: any, comparison: any, is_strict = true, compare_as_json = false) {
        if (compare_as_json) {
            variable = JSON.stringify(variable);
            comparison = JSON.stringify(comparison);
        }

        return is_strict ? variable === comparison : variable == comparison; // eslint-disable-line
    }

    /**
     * Validate the pattern of variable
     *
     * @param {*} variable to test
     * @param {RegExp|array} regexp to match
     * @returns {boolean} whether regex matched
     */
    static _isRegex(variable: any, regexp: RegExp | RegExp[]) {
        if (!Array.isArray(regexp)) {
            regexp = [regexp];
        }

        return regexp.some(regex => regex.test(variable));
    }

    /**
     * Validate whether property exists on object
     *
     * @param {*} variable to test
     * @param {*} object to check property of
     * @returns {boolean} whether property found
     */
    static _isProperty(variable: any, object: Generic.Object) {
        return typeof object === "object" && Object.prototype.hasOwnProperty.call(object, variable);
    }

    /**
     * Validate whether variable exists in object
     *
     * @param {*} variable to find
     * @param {object|array} container to locate inside of
     * @param {boolean} [compare_as_json=false] whether to stringify before checking
     * @returns {boolean} whether property found
     */
    static _isIn(variable: any, container: Generic.Object | any[], compare_as_json: boolean = false) {
        if (compare_as_json) {
            variable = JSON.stringify(variable);
            container = Object.values(container).map(value => JSON.stringify(value));
        } else {
            container = Object.values(container);
        }

        return typeof container === "object" && container.includes(variable);
    }

    // Transportation

    /**
     * Retrieve properties from object
     *
     * @param {object|array|undefined} object to store into
     * @param {array} [skip=[]] properties to skip
     * @returns {object|array} properties requested
     */
    _toObject(object?: Generic.Object | any[], skip = []) {
        if (object && object !== undefined) {
            switch (Data._getType(object)) {
                case "object":
                    Object.keys(object).forEach(property => {
                        if (!Array.isArray(object) && object) {
                            if (skip.includes(property as never)) {
                                object[property] = this[property];
                                if (Data._isType(object[property]._toObject, "function")) {
                                    object[property] = object[property]._toObject();
                                }
                            }
                        }
                    });

                    return object;

                case "array":
                    return object.map((property: any) => {
                        if (skip.includes(property as never)) return undefined;

                        if (Data._isType(this[property]._toObject, "function")) {
                            return this[property]._toObject();
                        }

                        return this[property];
                    });

                default:
            }
        }

        object = {} as Generic.Object;

        Object.keys(Data.getProperties()).forEach(property => {
            if (skip.includes(property as never) && !Array.isArray(object) && object) {
                object[property] = this[property];
                if (
                    Data._isType(object[property], "object") &&
                    Object.prototype.hasOwnProperty.call(object[property], "_properties") &&
                    Data._isType(object[property]._toObject, "function")
                ) {
                    object[property] = object[property]._toObject();
                }
            }
        });

        return JSON.parse(JSON.stringify(object));
    }

    /**
     * Set object values from another object
     *
     * @param {object} object to retrieve from
     * @param {boolean} do_reset whether to reset any values
     * @returns {object} instance of object
     */
    _fromObject(object: DataSetInterface, do_reset = true) {
        // ensure properties is an object
        if (!Data._isType(object, "object")) {
            throw new Error(`Invalid Properties (${Data._getType(object)})`);
        }

        // clear existing values
        if (do_reset) this._properties = {};

        let properties = Data.getProperties();
        Object.keys(properties).forEach(property => {
            if (!Object.prototype.hasOwnProperty.call(object, property)) {
                object[property] = properties[property].default;
            }

            this[property] = object[property];
        });

        return this;
    }
};
