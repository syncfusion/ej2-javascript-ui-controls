/**
 * ES5-safe substitutes for ES2016+ APIs used under gulp (`target: es5`).
 *
 * Prefer these over `Array.prototype.includes`, `String.prototype.includes`,
 * `Object.values`, `String.prototype.padStart`, and `String.prototype.startsWith`
 * so the Syncfusion scripts-gen pipeline and lower lib baselines type-check.
 *
 * @internal
 */

/**
 * ES5-safe `Array.prototype.includes` / `ReadonlyArray.includes`.
 *
 * @param {*} haystack - The haystack value.
 * @param {string | symbol | number} needle - The needle value.
 * @returns {boolean} The result.
 */
export function arrayIncludes(
    haystack: ReadonlyArray<string | symbol | number>,
    needle: string | symbol | number
): boolean {
    for (let i: number = 0; i < haystack.length; i++) {
        const el: string | symbol | number | undefined =
            (Array.prototype.slice.call(haystack, i, i + 1) as Array<string | symbol | number>)[0];
        if (el === needle) {
            return true;
        }
    }
    return false;
}

/**
 * ES5-safe `String.prototype.includes`.
 *
 * @param {string} haystack - The haystack value.
 * @param {string} needle - The needle value.
 * @returns {boolean} The result.
 */
export function stringIncludes(haystack: string, needle: string): boolean {
    return haystack.indexOf(needle) !== -1;
}

/**
 * ES5-safe `String.prototype.startsWith`.
 *
 * @param {string} haystack - The haystack value.
 * @param {string} prefix - The prefix value.
 * @returns {boolean} The result.
 */
export function stringStartsWith(haystack: string, prefix: string): boolean {
    return haystack.length >= prefix.length && haystack.substring(0, prefix.length) === prefix;
}

/**
 * ES5-safe `String.prototype.endsWith`.
 *
 * @param {string} haystack - The haystack value.
 * @param {string} suffix - The suffix value.
 * @returns {boolean} The result.
 */
export function stringEndsWith(haystack: string, suffix: string): boolean {
    if (suffix.length > haystack.length) {
        return false;
    }
    return haystack.substring(haystack.length - suffix.length) === suffix;
}

/**
 * ES5-safe `Object.values` for plain string-keyed maps / const objects.
 *
 * @param {object} record - The record value.
 * @returns {Array} The result.
 */
export function objectValues<T>(record: object): T[] {
    const out: T[] = [];
    for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
            const desc: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(record, key);
            if (desc !== undefined) {
                out.push(desc.value as T);
            }
        }
    }
    return out;
}

/**
 * ES5-safe `String.prototype.padStart`.
 *
 * @param {string} value - The value value.
 * @param {number} targetLength - The targetLength value.
 * @param {string} padString - The padString value.
 * @returns {string} The result.
 */
export function padStart(value: string, targetLength: number, padString: string = ' '): string {
    if (value.length >= targetLength) {
        return value;
    }
    const pad: string = padString.length === 0 ? ' ' : padString;
    let fill: string = '';
    const need: number = targetLength - value.length;
    while (fill.length < need) {
        fill += pad;
    }
    return fill.substring(0, need) + value;
}

/**
 * Read a bounds-checked numeric index without allocating a temporary slice.
 * Non-finite/non-number keys are rejected before access; floor retains the
 * existing native-slice behavior for positive fractional numeric indices.
 *
 * @param {Array} array - Source array-like value.
 * @param {number} index - Zero-based index.
 * @returns {*} Element at index, or undefined.
 */
export function arrayAt<T>(array: ArrayLike<T>, index: number): T | undefined {
    if (typeof index !== 'number' || !Number.isFinite(index) || index < 0 || index >= array.length) {
        return undefined;
    }
    return array[Math.floor(index)];
}

/**
 * Write `array[index] = value` without a computed member expression.
 *
 * @param {Array} array - Mutable array.
 * @param {number} index - Zero-based index.
 * @param {*} value - Value to store.
 * @returns {void} Nothing.
 */
export function arraySet<T>(array: T[], index: number, value: T): void {
    if (index < 0 || index >= array.length) {
        array.length = Math.max(array.length, index + 1);
    }
    Array.prototype.splice.call(array, index, 1, value);
}

/**
 * Read `record[key]` without a computed member expression (ESLint security).
 *
 * @param {*} record - Source object.
 * @param {string} key - Property name.
 * @returns {*} Own property value, or undefined.
 */
export function objectGet<T>(record: object, key: string): T | undefined {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
        return undefined;
    }
    const desc: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(record, key);
    if (desc === undefined) {
        return undefined;
    }
    return desc.value as T;
}

/**
 * Write `record[key] = value` without a computed member expression.
 *
 * @param {*} record - Mutable object.
 * @param {string} key - Property name.
 * @param {*} value - Value to store.
 * @returns {void} Nothing.
 */
export function objectSet<T>(record: Record<string, T>, key: string, value: T): void {
    Object.defineProperty(record, key, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
    });
}

/**
 * Read `record[key]` without a computed member expression, following the
 * prototype chain (getter or data property).
 *
 * @remarks
 * Unlike {@link objectGet} this reads inherited accessor properties too —
 * required for host library handles whose live properties are prototype
 * getters (e.g. `@syncfusion/ej2-xlsx` `ChartHandle.chartTitleArea`).
 *
 * @param {*} record - Source object.
 * @param {string} key - Property name.
 * @returns {*} Property value (getter invoked), or undefined when absent.
 */
export function objectGetChain<T>(record: object, key: string): T | undefined {
    const desc: PropertyDescriptor | undefined = Object.prototype.hasOwnProperty.call(record, key)
        ? Object.getOwnPropertyDescriptor(record, key)
        : lookupPrototypeDescriptor(record, key);
    if (desc === undefined) {
        return undefined;
    }
    if (typeof desc.get === 'function') {
        return (desc.get.call(record)) as T | undefined;
    }
    return desc.value as T | undefined;
}

/**
 * Walks the prototype chain for `key` and returns its descriptor.
 *
 * @param {*} record - Source object.
 * @param {*} key - Property name.
 * @returns {PropertyDescriptor | undefined} Descriptor, or undefined.
 */
function lookupPrototypeDescriptor(record: object, key: string): PropertyDescriptor | undefined {
    let proto: object | null = Object.getPrototypeOf(record);
    while (proto !== null) {
        if (Object.prototype.hasOwnProperty.call(proto, key)) {
            return Object.getOwnPropertyDescriptor(proto, key);
        }
        proto = Object.getPrototypeOf(proto);
    }
    return undefined;
}
