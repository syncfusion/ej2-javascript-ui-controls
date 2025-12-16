export class _PdfCertificateTable {
    private _orig: Map<string, any> = new Map(); // eslint-disable-line
    private _keys: Map<string, string>;
    constructor() {
        this._orig = new Map();
        this._keys = new Map();
    }
    _getKeys(): string[] {
        const result: string[] = [];
        this._orig.forEach((value: string, key: string) => {
            result.push(key);
        });
        return result;
    }
    _clear(): void {
        this._orig.clear();
        this._keys.clear();
    }
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
