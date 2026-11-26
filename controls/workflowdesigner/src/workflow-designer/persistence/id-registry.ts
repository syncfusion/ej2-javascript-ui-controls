/**
 * Tracks workflow IDs in one shared namespace across all workflow item types.
 *
 * @private
 */
export class IdRegistry {
    private readonly ids: Set<string> = new Set<string>();

    /**
     * Registers an ID when it is non-empty and has not already been used.
     *
     * @param {string} id The workflow item ID to register.
     * @returns {boolean} `true` when the ID was registered; otherwise `false`.
     * @private
     */
    public register(id: string): boolean {
        if (!id || this.ids.has(id)) {
            return false;
        }
        this.ids.add(id);
        return true;
    }

    /**
     * Removes an ID from the registry.
     *
     * @param {string} id The workflow item ID to remove.
     * @returns {void}
     * @private
     */
    public unregister(id: string): void {
        this.ids.delete(id);
    }

    /**
     * Determines whether an ID is registered.
     *
     * @param {string} id The workflow item ID to check.
     * @returns {boolean} `true` when the ID is registered; otherwise `false`.
     * @private
     */
    public has(id: string): boolean {
        return this.ids.has(id);
    }

    /**
     * Removes all registered IDs.
     *
     * @returns {void}
     * @private
     */
    public clear(): void {
        this.ids.clear();
    }
}
