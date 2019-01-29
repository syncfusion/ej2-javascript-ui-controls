import { isNullOrUndefined } from '@syncfusion/ej2-base';
/** 
 * @private
 */
export interface DictionaryInfo<K, V> {
    /* tslint:disable */
}
/** 
 * @private
 */
export class Dictionary<K, V> implements DictionaryInfo<K, V> {
    private keysInternal: K[] = [];
    private valuesInternal: V[] = [];
    private item: K[] = [];

    /**
     * @private
     */
    get length(): number {
        return this.keysInternal.length;
    }
    /**
     * @private
     */
    get keys(): K[] {
        return this.getItem();
    }
    /**
     * @private
     */
    public getItem(): K[] {
        this.item = [];
        for (let i: number = 0; i < this.keysInternal.length; i++) {
            this.item.push(this.keysInternal[i]);
        }
        return this.item;
    }
    /**
     * @private
     */
    public add(key: K, value: V): number {
        if (isNullOrUndefined(key)) {
            throw new ReferenceError('Provided key or value is not valid.');
        }
        let index: number = this.keysInternal.indexOf(key);
        // if (index < 0 || index > this.keysInternal.length - 1) {
        if (index < 0) {
            this.keysInternal.push(key);
            this.valuesInternal.push(value);
        }
        return 1;
        // else {
        //     throw new RangeError('An item with the same key has already been added.');
        // }
    }
    /**
     * @private
     */
    public get(key: K): V {
        if (isNullOrUndefined(key)) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.keysInternal.indexOf(key);
        if (index < 0 || index > this.keysInternal.length - 1) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            return this.valuesInternal[index];
        }
    }
    /**
     * @private
     */
    public set(key: K, value: V): void {
        if (isNullOrUndefined(key)) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.keysInternal.indexOf(key);
        if (index < 0 || index > this.keysInternal.length - 1) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            this.valuesInternal[index] = value;
        }
    }
    /**
     * @private
     */
    public remove(key: K): boolean {
        if (isNullOrUndefined(key)) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.keysInternal.indexOf(key);
        if (index < 0 || index > this.keysInternal.length - 1) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            this.keysInternal.splice(index, 1);
            this.valuesInternal.splice(index, 1);
            return true;
        }
    }
    /**
     * @private
     */
    public containsKey(key: K): boolean {
        if (isNullOrUndefined(key)) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.keysInternal.indexOf(key);
        if (index < 0 || index > this.keysInternal.length - 1) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public clear(): void {        
        this.keysInternal = [];
        this.valuesInternal = [];
    }
    /**
     * @private
     */
    public destroy(): void {
        this.clear();
        this.keysInternal = undefined;
        this.valuesInternal = undefined;
    }
}