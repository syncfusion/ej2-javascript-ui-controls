/**
 * Dictionary class
 *
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
     * @returns {number} .
     * @hidden
     * @private
     */
    public size(): number {
        return this.mKeys.length;
    }
    /**
     * @template K
     * @template V
     * @param {K} key .
     * @param {V} value .
     * @returns {void} .
     * @hidden
     * @private
     */
    public add(key: K, value: V): number {
        if (key === undefined || key === null || value === undefined || value === null) {
            throw new ReferenceError('Provided key or value is not valid.');
        }
        const index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            this.mKeys.push(key);
            this.mValues.push(value);
            return 1;
        } else {
            throw new RangeError('An item with the same key has already been added.');
        }
    }
    /**
     * @template K
     * @returns {K[]} .
     * @hidden
     * @private
     */
    public keys(): K[] {
        return this.mKeys;
    }
    /**
     * @template V
     * @returns {V[]} .
     * @hidden
     * @private
     */
    public values(): V[] {
        return this.mValues;
    }
    /**
     * @template K
     * @template V
     * @param {K} key .
     * @returns {V} .
     * @hidden
     * @private
     */
    public getValue(key: K): V {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        const index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            return this.mValues[index as number];
        }
    }
    /**
     * @template K
     * @template V
     * @param {K} key .
     * @param {V} value .
     * @returns {void} .
     * @hidden
     * @private
     */
    public setValue(key: K, value: V): void {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        const index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            this.mKeys.push(key);
            this.mValues.push(value);
        } else {
            this.mValues[index as number] = value;
        }
    }
    /**
     * @template K
     * @param {K} key .
     * @returns {boolean} .
     * @hidden
     * @private
     */
    public remove(key: K): boolean {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        const index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            throw new RangeError('No item with the specified key has been added.');
        } else {
            this.mKeys.splice(index, 1);
            this.mValues.splice(index, 1);
            return true;
        }
    }
    /**
     * @template K
     * @param {K} key .
     * @returns {boolean} .
     * @hidden
     * @private
     */
    public containsKey(key: K): boolean {
        if (key === undefined || key === null) {
            throw new ReferenceError('Provided key is not valid.');
        }
        const index: number = this.mKeys.indexOf(key);
        if (index < 0) {
            return false;
        }
        return true;
    }
    /**
     * @returns {void} .
     * @hidden
     * @private
     */
    public clear(): void {
        this.mKeys = [];
        this.mValues = [];
    }
}
