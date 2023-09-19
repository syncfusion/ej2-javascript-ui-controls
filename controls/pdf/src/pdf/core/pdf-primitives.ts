import { _PdfCrossReference } from './pdf-cross-reference';
import { _defaultToString } from './utils';
/* eslint-disable */
let nameCache = Object.create(null);
let cmdCache = Object.create(null);
let refCache = Object.create(null);
export class _PdfName {
    constructor(name: string) {
        this.name = name;
    }
    name: string;
    static get(name: string): _PdfName {
        return nameCache[name] || (nameCache[name] = new _PdfName(name));
    }
}
export class _PdfCommand {
    constructor(command: string) {
        this.command = command;
    }
    command: string;
    static get(command: string): _PdfCommand {
        return cmdCache[command] || (cmdCache[command] = new _PdfCommand(command));
    }
}
export class _PdfReference {
    constructor(objectNumber: number, gen: number) {
        this.objectNumber = objectNumber;
        this.generationNumber = gen;
    }
    objectNumber: number;
    generationNumber: number;
    _isNew: boolean = false;
    toString(): string {
        return `${this.objectNumber} ${this.generationNumber}`;
    }
    static get(objectNumber: number, generationNumber: number): _PdfReference {
        const key = generationNumber === 0 ? `${objectNumber}R` : `${objectNumber}R${generationNumber}`;
        return refCache[key] || (refCache[key] = new _PdfReference(objectNumber, generationNumber));
    }
}
export class _PdfReferenceSet {
    constructor(parent: any = null) {
        this._set = new Set(parent && parent._set);
    }
    _set: Set<_PdfReference>;
    has(ref: any): boolean {
        return this._set.has(ref.toString());
    }
    put(ref: any): void {
        this._set.add(ref.toString());
    }
    remove(ref: any): void {
        this._set.delete(ref.toString());
    }
    clear(): void {
        this._set.clear();
    }
}
export class _PdfReferenceSetCache {
    constructor() {
        this._map = new Map();
    }
    _map: any;
    get size(): number {
        return this._map.size;
    }
    get(ref: _PdfReference): any {
        return this._map.get(ref.toString());
    }
    has(ref: _PdfReference): boolean {
        return this._map.has(ref.toString());
    }
    put(ref: _PdfReference, obj: any): void {
        this._map.set(ref.toString(), obj);
    }
    set(objId: string, obj: any): void {
        this._map.set(objId, obj);
    }
    clear(): void {
        this._map.clear();
    }
}
export interface IDictionaryPair<K, V> {
    key: K;
    value: V;
}
export class Dictionary<K, V>{
    protected table: { [key: string]: IDictionaryPair<K, V> };
    protected nElements: number;
    protected toStr: (key: K) => string;
    public constructor(toStringFunction?: (key: K) => string) {
        this.table = {};
        this.nElements = 0;
        this.toStr = toStringFunction || _defaultToString;
    }
    public getValue(key: K): V {
        const pair: IDictionaryPair<K, V> = this.table['$' + this.toStr(key)];
        if (typeof pair === 'undefined') {
            return undefined;
        }
        return pair.value;
    }
    public setValue(key: K, value: V): V {
        let ret: V;
        const k: string = '$' + this.toStr(key);
        const previousElement: IDictionaryPair<K, V> = this.table[k];
        this.nElements++;
        ret = undefined;
        this.table[k] = {
            key: key,
            value: value
        };
        return ret;
    }
    public keys(): K[] {
        const keysArray: K[] = [];
        let namesOfKeys: string[] = Object.keys(this.table);
        for (let index1: number = 0; index1 < namesOfKeys.length; index1++) {
            const pair1: IDictionaryPair<K, V> = this.table[namesOfKeys[index1]];
            keysArray.push(pair1.key);
        }
        return keysArray;
    }
    public containsKey(key: K): boolean {
        let retutnValue: boolean = true;
        if (typeof this.getValue(key) === 'undefined') {
            retutnValue = true;
        } else {
            retutnValue = false;
        }
        return !retutnValue;
    }
    _size(): number {
        return this.nElements;
    }
}
export class _PdfDictionary {
    constructor(xref?: _PdfCrossReference) {
        this._initialize(xref);
    }
    _map: any;
    _crossReference: _PdfCrossReference;
    objId: any;
    _isNew: boolean;
    suppressEncryption: boolean;
    _updated: boolean;
    isCatalog: boolean;
    _currentObj: any;
    _isFont: boolean = false;
    get size(): number {
        return Object.keys(this._map).length;
    }
    assignXref(xref: any): void {
        this._crossReference = xref;
    }
    getRaw(key: string): any {
        return this._map[key];
    }
    getRawValues(): any {
        return this._map.values;
    }
    get(key1: string, key2?: string, key3?: string) {
        let value = this._get(key1, key2, key3);
        if (this._crossReference && typeof value !== 'undefined' && value instanceof _PdfReference) {
            value = this._crossReference._fetch(value);
        }
        return value;
    }
    getArray(key1: string, key2?: string, key3?: string) {
        let value = this.get(key1, key2, key3);
        if (this._crossReference && typeof value !== 'undefined' && Array.isArray(value)) {
            value = value.slice();
            for (let i: number = 0; i < value.length; i++) {
                const reference: _PdfReference = value[Number.parseInt(i.toString(), 10)];
                if (reference !== null && typeof reference !== 'undefined' && reference instanceof _PdfReference) {
                    value[Number.parseInt(i.toString(), 10)] = this._crossReference._fetch(reference);
                }
            }
        }
        return value;
    }
    set(key: string, value: any): void {
        this._map[key] = value;
    }
    has(key: string): boolean {
        return typeof this._map[key] !== 'undefined';
    }
    forEach(callback: any): void {
        for (const key in this._map) {
            callback(key, this.getRaw(key));
        }
    }
    update(key: string, value: any): void {
        if (this.has(key)) {
            let prevValue = this._map[key];
            if (prevValue !== null && typeof prevValue !== 'undefined' && prevValue instanceof _PdfReference && this._crossReference) {
                prevValue = this._crossReference._fetch(prevValue);
            }
            if (prevValue !== value) {
                this._map[key] = value;
                this._updated = true;
            }
        } else {
            this._map[key] = value;
            this._updated = true;
        }
    }
    static getEmpty(xref: _PdfCrossReference): _PdfDictionary {
        const emptyDict = new _PdfDictionary(xref);
        emptyDict.set = (key: string, value: any) => {
            throw new Error('Should not call set on the empty dictionary.');
        };
        return emptyDict;
    }
    static merge(xref: _PdfCrossReference, dictionaryArray: Array<any>, mergeSubDictionary: boolean = false): _PdfDictionary {
        const mergedDictionary: _PdfDictionary = new _PdfDictionary(xref);
        const properties = Object.create(null);
        for (const dictionary of dictionaryArray) {
            if (!(dictionary instanceof _PdfDictionary)) {
                continue;
            }
            for (const [key, value] of dictionary._map) {
                let property = properties.get(key);
                if (typeof property === 'undefined') {
                    property = [];
                    properties.set(key, property);
                } else if (!mergeSubDictionary || !(value instanceof _PdfDictionary)) {
                    continue;
                }
                property.push(value);
            }
        }
        for (const [name, values] of properties) {
            if (values.length === 1 || !(values[0] instanceof _PdfDictionary)) {
                mergedDictionary._map[name] = values[0];
                continue;
            }
            const subDict = new _PdfDictionary(xref);
            for (const dictionary of values) {
                for (const [key, value] of dictionary._map) {
                    if (typeof subDict._map[key] === 'undefined') {
                        subDict._map[key] = value;
                    }
                }
            }
            if (subDict.size > 0) {
                mergedDictionary._map[name] = subDict;
            }
        }
        properties.clear();
        return mergedDictionary.size > 0 ? mergedDictionary : _PdfDictionary.getEmpty(xref);
    }
    _initialize(xref?: _PdfCrossReference): void {
        this._map = Object.create(null);
        this.suppressEncryption = false;
        this._updated = false;
        this.isCatalog = false;
        this._isNew = false;
        if (xref) {
            this._crossReference = xref;
        }
    }
    _get(key1: string, key2?: string, key3?: string): any {
        let value = this._map[key1];
        if (typeof value === 'undefined') {
            value = this._map[key2];
            if (typeof key2 !== 'undefined' && key2 !== null) {
                value = this._map[key2];
            } else if (typeof key3 !== 'undefined' && key3 !== null) {
                value = this._map[key3];
            }
        }
        return value;
    }
}
export class _PdfNull {
    constructor(value: any = []) {
        this.value = value;
    }
    value: any;
}
export function _clearPrimitiveCaches(): void {
    nameCache = Object.create(null);
    cmdCache = Object.create(null);
    refCache = Object.create(null);
}
export function _isName(value: _PdfName, name: string): boolean {
    return value instanceof _PdfName && (typeof name === 'undefined' || value.name === name);
}
export function _isCommand(value: _PdfCommand, command: string): boolean {
    return value instanceof _PdfCommand && (typeof command === 'undefined' || value.command === command);
}
