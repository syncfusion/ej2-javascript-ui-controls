/**
 * Reads an own property of a lookup table, ignoring inherited members.
 * Used where the key comes from input text, so names such as `constructor` never
 * resolve to `Object.prototype` members.
 *
 * @param {object} table - Lookup table (plain object).
 * @param {string | number | symbol} key - Property key to read.
 * @returns {T | undefined} The own value, or `undefined` when the table has no own `key`.
 * @private
 */
export function ownValue<T>(table: object, key: string | number | symbol): T | undefined {
    const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(table, key);
    return descriptor === undefined ? undefined : descriptor.value as T;
}

/**
 * Defines (or overwrites) an own enumerable, writable property, like `table[key] = value`
 * for a plain object or array.
 *
 * @param {object} table - Object to write to.
 * @param {string | number | symbol} key - Property key to write.
 * @param {unknown} value - Value to store.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setOwnValue(table: object, key: string | number | symbol, value: unknown): void {
    Object.defineProperty(table, key, { value, writable: true, enumerable: true, configurable: true });
}
