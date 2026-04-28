/**
 * Case-insensitive lookup table for certificate-related entries.
 *
 * @private
 */
export class _PdfCertificateTable {
    private _orig: Map<string, any> = new Map(); // eslint-disable-line
    private _keys: Map<string, string>;
    constructor() {
        this._orig = new Map();
        this._keys = new Map();
    }
    /**
     * Return all original keys currently stored in the table.
     *
     * @private
     * @returns {string[]} Array of stored keys.
     */
    _getKeys(): string[] {
        const result: string[] = [];
        this._orig.forEach((value: string, key: string) => {
            result.push(key);
        });
        return result;
    }
    /**
     * Clears all stored entries from both the original map and the internal key map.
     *
     * @private
     * @returns {void} nothing.
     */
    _clear(): void {
        this._orig.clear();
        this._keys.clear();
    }
    /**
     * Remove an entry by key (case-insensitive) and return its value.
     *
     * @private
     * @param {string} key - Key of the entry to remove.
     * @returns {any} The removed value or null when not found.
     */
    _remove(key: string): any { // eslint-disable-line
        const lower: string = key.toLowerCase();
        let actualKey: string;
        this._keys.forEach((mappedKey: string, tempKey: string) => {
            if (tempKey.toLowerCase() === lower) {
                actualKey = mappedKey;
            }
        });
        if (!actualKey) {
            return null;
        }
        this._keys.delete(lower);
        const value: string = this._orig.get(actualKey);
        this._orig.delete(actualKey);
        return value;
    }
    /**
     * Retrieve a value by key (case-insensitive).
     *
     * @private
     * @param {string} key - Lookup key.
     * @returns {any} The stored value or null if missing.
     */
    _get(key: string): any { // eslint-disable-line
        const lower: string = key.toLowerCase();
        let actualKey: string;
        const entries: any[] = []; // eslint-disable-line
        this._keys.forEach((value: string, key: string) => {
            entries.push([key, value]);
        });
        for (let i: number = 0; i < entries.length; i++) {
            const [tempKey, mappedKey] = entries[<number>i];
            if (tempKey.toLowerCase() === lower) {
                actualKey = mappedKey;
                break;
            }
        }
        return actualKey ? this._orig.get(actualKey) : null;
    }
    /**
     * Set or replace a value for the given key (case-insensitive).
     *
     * @private
     * @param {string} key - The key to set.
     * @param {any} value - The value to associate with the key.
     * @returns {void}
     */
    _setValue(key: string, value: any): void { // eslint-disable-line
        const lower: string = key.toLowerCase();
        let existingKey: string;
        const entries: any[] = []; // eslint-disable-line
        this._keys.forEach((value: string, key: string) => {
            entries.push([key, value]);
        });
        for (let i: number = 0; i < entries.length; i++) {
            const [tempKey, mappedKey]: [string, string] = entries[<number>i];
            if (tempKey.toLowerCase() === lower) {
                existingKey = mappedKey;
                break;
            }
        }
        if (existingKey) {
            this._orig.delete(existingKey);
        }
        this._keys.set(lower, key);
        this._orig.set(key, value);
    }
}
