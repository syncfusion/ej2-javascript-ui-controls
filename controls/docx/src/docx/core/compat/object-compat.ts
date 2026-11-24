/**
 * ES5/ES2015-safe replacements for `Object.values` / `Object.entries`.
 *
 * The project's TypeScript `lib` is intentionally capped at ES5 + ES2015
 * (see `tsconfig.json`); `Object.values` / `Object.entries` are ES2017
 * (the type declarations) and must not be relied on directly. These
 * helpers provide the same semantics using only `Object.keys` (ES5).
 *
 * @private
 */

/**
 * ES5-safe equivalent of `Object.values`.
 *
 * @param {Object} obj - Plain object whose own enumerable string-keyed values are collected.
 * @returns {T[]} Array of the object's own enumerable property values, in `Object.keys` order.
 * @private
 */
export function objectValues<T>(obj: { [key: string]: T }): T[] {
    const keys: string[] = Object.keys(obj);
    const result: T[] = [];
    for (let i: number = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- key comes from Object.keys of the same object, not external input
        result.push(obj[keys[i]]);
    }
    return result;
}

/**
 * Collects the member values of a string enum.
 *
 * A TypeScript enum object has no index signature, so it cannot be passed to {@link objectValues}.
 * String enums have no reverse mapping, so every own key is a member name.
 *
 * @param {Object} enumObject - The string enum object.
 * @returns {T[]} The enum member values, in declaration order.
 * @private
 */
export function enumValues<T extends string>(enumObject: object): T[] {
    const keys: string[] = Object.keys(enumObject);
    const result: T[] = [];
    for (let i: number = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- key comes from Object.keys of the same object, not external input
        result.push(enumObject[keys[i]]);
    }
    return result;
}

/**
 * Returns the string enum member whose value equals `raw`, or `undefined` when there is none.
 *
 * Used where a wire string read from XML must become a typed enum value without a type assertion.
 *
 * @param {Object} enumObject - The string enum object.
 * @param {string} raw - The candidate wire value.
 * @returns {T | undefined} The matching member, or `undefined`.
 * @private
 */
export function enumFromValue<T extends string>(enumObject: object, raw: string): T | undefined {
    const values: T[] = enumValues<T>(enumObject);
    for (let i: number = 0; i < values.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        if (values[i] === raw) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            return values[i];
        }
    }
    return undefined;
}

/**
 * ES5-safe equivalent of `Object.entries`.
 *
 * @param {Object} obj - Plain object whose own enumerable string-keyed entries are collected.
 * @returns {*} Array of `[key, value]` tuples, in `Object.keys` order.
 * @private
 */
export function objectEntries<T>(obj: { [key: string]: T }): Array<[string, T]> {
    const keys: string[] = Object.keys(obj);
    const result: Array<[string, T]> = [];
    for (let i: number = 0; i < keys.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- key comes from Object.keys of the same object, not external input
        result.push([keys[i], obj[keys[i]]]);
    }
    return result;
}

/**
 * Reads an own property from a string-keyed lookup table. Keys inherited from
 * `Object.prototype` (for example `constructor` or `__proto__`) yield `undefined`.
 *
 * @param {Object} table - Plain string-keyed lookup table.
 * @param {string} key - Property name to read.
 * @returns {T | undefined} The own property value, or `undefined` when the table has no own `key`.
 * @private
 */
export function ownGet<T>(table: { [key: string]: T }, key: string): T | undefined {
    // eslint-disable-next-line security/detect-object-injection
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

/**
 * Writes a property on a string-keyed lookup table, ignoring the `__proto__` key so
 * input-derived keys can never reach the prototype chain.
 *
 * @param {Object} table - Plain string-keyed lookup table.
 * @param {string} key - Property name to write.
 * @param {T} value - Value to store.
 * @returns {void} Nothing is returned.
 * @private
 */
export function ownSet<T>(table: { [key: string]: T }, key: string, value: T): void {
    if (key === '__proto__') {
        return;
    }
    // eslint-disable-next-line security/detect-object-injection
    table[key] = value;
}

/**
 * Removes an own property from a string-keyed lookup table.
 *
 * @param {Object} table - Plain string-keyed lookup table.
 * @param {string} key - Property name to remove.
 * @returns {void} Nothing is returned.
 * @private
 */
export function ownDelete<T>(table: { [key: string]: T }, key: string): void {
    if (Object.prototype.hasOwnProperty.call(table, key)) {
        // eslint-disable-next-line security/detect-object-injection
        delete table[key];
    }
}
