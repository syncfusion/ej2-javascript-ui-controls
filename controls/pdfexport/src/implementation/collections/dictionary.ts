/**
 * Dictionary.ts class for EJ2-PDF
 * @private
 * @hidden
 */
import {defaultToString} from './utils';
// Used internally by dictionary
/**
 * @private
 * @hidden
 */
export interface IDictionaryPair<K, V> {
    key: K;
    value: V;
}
/**
 * @private
 * @hidden
 */
export class Dictionary<K, V>{
    /**
     * @private
     * @hidden
     */
    protected table: { [key: string]: IDictionaryPair<K, V> };
    //: [key: K] will not work since indices can only by strings in javascript and typescript enforces this.
    /**
     * @private
     * @hidden
     */
    protected nElements: number;
    /**
     * @private
     * @hidden
     */
    protected toStr: (key: K) => string;
    /**
     * @private
     * @hidden
     */
    public constructor(toStringFunction?: (key: K) => string) {
        this.table = {};
        this.nElements = 0;
        this.toStr = toStringFunction || defaultToString;
    }
    /**
     * @private
     * @hidden
     */
    public getValue(key: K): V {
        const pair: IDictionaryPair<K, V> = this.table['$' + this.toStr(key)];
        if (typeof pair === 'undefined') {
            return undefined;
        }
        return pair.value;
    }
    /**
     * @private
     * @hidden
     */
    public setValue(key: K, value: V): V {
        // if (typeof key === 'undefined' || typeof value === 'undefined') {
        //     return undefined;
        // }
        let ret: V;
        const k : string = '$' + this.toStr(key);
        const previousElement: IDictionaryPair<K, V> = this.table[k];
        // if (typeof previousElement === 'undefined') {
        this.nElements++;
        ret = undefined;
        // }
        this.table[k] = {
            key: key,
            value: value
        };
        return ret;
    }
    /**
     * @private
     * @hidden
     */
    public remove(key: K): V {
        const k : string = '$' + this.toStr(key);
        const previousElement: IDictionaryPair<K, V> = this.table[k];
        // if (typeof previousElement !== 'undefined') {
        delete this.table[k];
        this.nElements--;
        return previousElement.value;
        // }
        // return undefined;
    }
    /**
     * @private
     * @hidden
     */
    public keys(): K[] {
        const keysArray: K[] = [];
        let namesOfKeys : string[] = Object.keys(this.table);
        for (let index1 : number = 0; index1 < namesOfKeys.length; index1++) {
            // if (Object.prototype.hasOwnProperty.call(this.table, namesOfKeys[index1])) {
            const pair1: IDictionaryPair<K, V> = this.table[namesOfKeys[index1]];
            keysArray.push(pair1.key);
            // }
        }
        return keysArray;
    }
    /**
     * @private
     * @hidden
     */
    public values(): V[] {
        const valuesArray: V[] = [];
        let namesOfValues : string[] = Object.keys(this.table);
        for (let index2 : number = 0; index2 < namesOfValues.length; index2++) {
            // if (Object.prototype.hasOwnProperty.call(this.table, namesOfValues[index2])) {
            const pair2: IDictionaryPair<K, V> = this.table[namesOfValues[index2]];
            valuesArray.push(pair2.value);
            // }
        }
        return valuesArray;
    }
    /**
     * @private
     * @hidden
     */
    public containsKey(key: K): boolean {
        let retutnValue : boolean = true;
        if (typeof this.getValue(key) === 'undefined') {
            retutnValue = true;
        } else {
            retutnValue = false;
        }
        return !retutnValue;
    }
    /**
     * @private
     * @hidden
     */
    public clear() : void {
        this.table = {};
        this.nElements = 0;
    }
    /**
     * @private
     * @hidden
     */
    public size(): number {
        return this.nElements;
    }
} // End of dictionary