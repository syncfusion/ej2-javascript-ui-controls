/**
 * IdGenerator — pluggable node ID generation interface.
 *
 * The default implementation uses crypto.randomUUID() (Node 14.17+ / all modern browsers).
 * Custom implementations can be injected via EditorConfig.idGenerator for testing
 * or collaboration providers that supply IDs from their own ID space.
 */
export interface IdGenerator {
    generate(): string;
}

/**
 * DefaultIdGenerator — production implementation using crypto.randomUUID().
 */
export class DefaultIdGenerator implements IdGenerator {
    public generate(): string {
        return crypto.randomUUID();
    }
}
