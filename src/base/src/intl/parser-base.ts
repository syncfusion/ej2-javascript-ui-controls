/**
 * Parser 
 */

const defaultNumberingSystem: Object = {
    'latn': {
        '_digits': '0123456789',
        '_type': 'numeric'
    }
};

import {isUndefined, getValue} from '../util';
const latnRegex: RegExp = /^[0-9]*$/;
const defaultNumberSymbols: Object = {
    'decimal': '.',
    'group': ',',
    'percentSign': '%',
    'plusSign': '+',
    'minusSign': '-',
    'infinity': '∞',
    'nan': 'NaN',
    'exponential': 'E'
};
const latnNumberSystem: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/**
 * Interface for numeric Options
 */
export interface NumericOptions {
    numericPair?: Object;
    numericRegex?: string;
    numberParseRegex?: RegExp;
    symbolNumberSystem?: Object;
    symbolMatch?: Object;
    numberSystem?: string;
}
/**
 * Interface for numeric object
 */
export interface NumericObject {
    obj?: Object;
    nSystem?: string;
}
/**
 * Interface for number mapper
 */
export interface NumberMapper {
    mapper?: Object;
    timeSeparator?: string;
    numberSymbols?: Object;
    numberSystem?: string;
}
/**
 * Interface for parser base
 * @private
 */
export class ParserBase {
    public static nPair: string = 'numericPair';
    public static nRegex: string = 'numericRegex';
    public static numberingSystems: Object = defaultNumberingSystem;
    /**
     * Returns the cldr object for the culture specifies
     * @param {Object} obj - Specifies the object from which culture object to be acquired.
     * @param {string} cName - Specifies the culture name.
     * @returns {Object}
     */
    public static getMainObject(obj: Object, cName: string): Object {
        return getValue('main.' + cName, obj);
    }
    /**
     * Returns the numbering system object from given cldr data.
     * @param {Object} obj - Specifies the object from which number system is acquired.
     * @returns {Object}
     */
    public static getNumberingSystem(obj: Object): Object {
        return getValue('supplemental.numberingSystems', obj) || this.numberingSystems;
    }
    /**
     * Returns the reverse of given object keys or keys specified.
     * @param {Object} prop - Specifies the object to be reversed.
     * @param {number[]} keys - Optional parameter specifies the custom keyList for reversal.
     * @returns {Object}
     */
    public static reverseObject(prop: Object, keys?: number[]): Object {
        let propKeys: string[] | number[] = keys || Object.keys(prop);
        let res: Object = {};
        for (let key of propKeys) {
            /* tslint:disable no-any */
            if (!res.hasOwnProperty((<any>prop)[key])) {
                (<any>res)[(<any>prop)[key]] = key;
            }
        }
        return res;
    }
    /**
     * Returns the symbol regex by skipping the escape sequence.
     * @param {string[]} props - Specifies the array values to be skipped.
     * @returns {RegExp}
     */
    public static getSymbolRegex(props: string[]): RegExp {
        let regexStr: string = props.map((str: string): string => {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        }).join('|');
        return new RegExp(regexStr, 'g');
    }
    private static getSymbolMatch(prop: Object): Object {
        let matchKeys: string[] = Object.keys(defaultNumberSymbols);
        let ret: Object = {};
        for (let key of matchKeys) {
            (<any>ret)[(<any>prop)[key]] = (<any>defaultNumberSymbols)[key];
        }
        return ret;
    }
    /**
     * Returns regex string for provided value
     * @param {string} val 
     * @returns {string}
     */
    private static constructRegex(val: string): string {
        let len: number = val.length;
        let ret: string = '';
        for (let i: number = 0; i < len; i++) {
            if (i !== len - 1) {
                ret += val[i] + '|';
            } else {
                ret += val[i];
            }
        }
        return ret;
    }
    /**
     * Returns the replaced value of matching regex and obj mapper.
     * @param {string} value - Specifies the  values to be replaced.
     * @param {RegExp} regex - Specifies the  regex to search.
     * @param {Object} obj - Specifies the  object matcher to be replace value parts.
     * @returns {string}
     */
    public static convertValueParts(value: string, regex: RegExp, obj: Object): string {
        return value.replace(regex, (str: string): string => {
            return (<any>obj)[str];
        });
    }
    /**
     * Returns default numbering system object for formatting from cldr data
     * @param {Object} obj 
     * @returns {NumericObject}
     */
    public static getDefaultNumberingSystem(obj: Object): NumericObject {
        let ret: NumericObject = {};
        ret.obj = getValue('numbers', obj);
        ret.nSystem = getValue('defaultNumberingSystem', ret.obj);
        return ret;
    }
    /**
     * Returns the replaced value of matching regex and obj mapper.
     */
    public static getCurrentNumericOptions(curObj: Object, numberSystem: Object, needSymbols?: boolean): Object {
        let ret: NumericOptions = {};
        let cur: NumericObject = this.getDefaultNumberingSystem(curObj);
        if (!isUndefined(cur.nSystem)) {
            let digits: string = getValue(cur.nSystem + '._digits', numberSystem);
            if (!isUndefined(digits)) {
                ret.numericPair = this.reverseObject(digits, latnNumberSystem);
                ret.numberParseRegex = new RegExp(this.constructRegex(digits), 'g');
                ret.numericRegex = '[' + digits[0] + '-' + digits[9] + ']';
                if (needSymbols) {
                    ret.numericRegex = digits[0] + '-' + digits[9];
                    ret.symbolNumberSystem = getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
                    ret.symbolMatch = this.getSymbolMatch(ret.symbolNumberSystem);
                    ret.numberSystem = cur.nSystem;
                }
            }
        }
        return ret;
    }
    /**
     * Returns number mapper object for the provided cldr data
     * @param {Object} curObj
     * @param {Object} numberSystem
     * @param {boolean} isNumber
     * @returns {NumberMapper}
     */
    public static getNumberMapper(curObj: Object, numberSystem: Object, isNumber?: boolean): NumberMapper {
        let ret: NumberMapper = { mapper: {} };
        let cur: NumericObject = this.getDefaultNumberingSystem(curObj);
        if (!isUndefined(cur.nSystem)) {
            ret.numberSystem = cur.nSystem;
            ret.numberSymbols = getValue('symbols-numberSystem-' + cur.nSystem, cur.obj);
            ret.timeSeparator = getValue('timeSeparator', ret.numberSymbols);
            let digits: string = getValue(cur.nSystem + '._digits', numberSystem);
            if (!isUndefined(digits)) {
                for (let i of latnNumberSystem) {
                    (<any>ret).mapper[i] = digits[i];
                }
            }
        }
        return ret;
    }
}