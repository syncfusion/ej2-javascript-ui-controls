/**
 * Dictionary class
 * @private
 * @hidden
 */
export class TemporaryDictionary<K, V> {
    /**
     * @hidden
     * @private
     */
    private mKeys: K[] = [];
    /**
     * @hidden
     * @private
     */
    private mValues: V[] = [];
    /**
     * @hidden
     * @private
     */
    public size(): number {
        return this.mKeys.length;
    }
    /**
     * @hidden
     * @private
     */
    public add(key: K, value: V): number {
        if (key === undefined || key === null || value === undefined || value === null) {
            throw new ReferenceError('Provided key or value is not valid.');
        }
        let index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            this.mKeys.push(key);
            this.mValues.push(value);
            return 1;
        } else {
            throw new RangeError('An item with the same key has already been added.');
        }
    }
    /**
     * @hidden
     * @private
     */
    public keys(): K[] {
        return this.mKeys;
    }
    /**
     * @hidden
     * @private
     */
    public values(): V[] {
        return this.mValues;
    }
    /**
     * @hidden
     * @private
     */
    public getValue(key: K): V {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            return this.mValues[index];
        }
    }
    /**
     * @hidden
     * @private
     */
    public setValue(key: K, value: V): void {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            this.mKeys.push(key);
            this.mValues.push(value);
        } else {
            this.mValues[index] = value;
        }
    }
    /**
     * @hidden
     * @private
     */
    public remove(key: K): boolean {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            this.mKeys.splice(index, 1);
            this.mValues.splice(index, 1);
            return true;
        }
    }
    /**
     * @hidden
     * @private
     */
    public containsKey(key: K): boolean {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        let index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            return false;
        }
        return true;
    }
    /**
     * @hidden
     * @private
     */
    public clear(): void {
        this.mKeys = [];
        this.mValues = [];
    }
}