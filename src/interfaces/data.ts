import { DataModifierType } from "../types/data";

export interface DataTypeInterface {
    [test: string]: any;
    get?: DataModifierType;
    default?: any;
    post?: DataModifierType;
    set?: DataModifierType;
    null?: boolean;
    undefined?: boolean;
}

export interface DataSetInterface {
    [name: string]: DataTypeInterface;
}

export interface DataInterface {
    [name: string]: any;
    _properties: DataSetInterface;
}
