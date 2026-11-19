/**
 * Explicit-value tracking for Math properties.
 *
 * Public getters return effective (Compression-compatible) defaults while the
 * store separately remembers which keys were assigned or parsed, so the
 * serializer emits only explicit values.
 */

/**
 * Reusable keyed property store.
 *
 * @public
 */
export class ExplicitPropertyStore {
    private readonly _values: Map<number, unknown> = new Map<number, unknown>();

    /**
     * Whether the key was explicitly assigned or parsed.
     *
     * @param {number} key - The key.
     * @returns {boolean} The result.
     */
    protected hasProperty(key: number): boolean {
        return this._values.has(key);
    }

    /**
     * Returns the explicit value, or the lazily computed effective default.
     *
     * @param {number} key - The key.
     * @param {Function} defaultValue - The default value.
     * @returns {T} The result.
     */
    protected getProperty<T>(key: number, defaultValue: () => T): T {
        return this._values.has(key) ? (this._values.get(key) as T) : defaultValue();
    }

    /**
     * Assigns a value and marks it explicit, even when equal to the default.
     *
     * @param {number} key - The key.
     * @param {T} value - The value.
     * @returns {void} Nothing is returned.
     */
    protected setProperty<T>(key: number, value: T): void {
        this._values.set(key, value);
        this.propertyChanged();
    }

    /**
     * Removes the explicit value so the effective default applies again.
     *
     * @param {number} key - The key.
     * @returns {void} Nothing is returned.
     */
    protected clearProperty(key: number): void {
        if (this._values.delete(key)) {
            this.propertyChanged();
        }
    }

    /**
     * Whether a property was explicitly set or parsed from source.
     * Serializers use this to emit only explicit values.
     *
     * @param {number} key - The key.
     * @returns {boolean} The result.
     */
    isExplicit(key: number): boolean {
        return this.hasProperty(key);
    }

    /**
     * Copies every explicit property of `source` into this store, keeping explicitness.
     *
     * @param {ExplicitPropertyStore} source Store to copy from.
     * @returns {void}
     * @private
     */
    copyExplicitFrom(source: ExplicitPropertyStore): void {
        source._values.forEach((value: unknown, key: number) => this._values.set(key, value));
    }

    /**
     * Whether both stores hold the same explicit keys with equal values.
     *
     * @param {ExplicitPropertyStore} other Store to compare with.
     * @returns {boolean} True when the explicit properties are identical.
     * @private
     */
    explicitEquals(other: ExplicitPropertyStore): boolean {
        if (this._values.size !== other._values.size) { return false; }
        let equal: boolean = true;
        this._values.forEach((value: unknown, key: number) => {
            if (!other._values.has(key) || other._values.get(key) !== value) { equal = false; }
        });
        return equal;
    }

    /**
     * Hook invoked after any mutation of the store.
     *
     * @returns {void} Nothing is returned.
     */
    protected propertyChanged(): void {
    // overridden by owner-aware subclasses
    }
}
