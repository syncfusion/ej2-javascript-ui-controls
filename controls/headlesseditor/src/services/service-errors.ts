/**
 * DuplicateServiceError — thrown when a token is registered more than once
 * without the `override` flag.
 *
 * @hidden
 */
export class DuplicateServiceError extends Error {
    constructor(tokenDisplayName: string) {
        super(`Service already registered for token "${tokenDisplayName}". Use { override: true } to replace it.`);
        this.name = 'DuplicateServiceError';
    }
}

/**
 * ServiceNotFoundError — thrown when `resolve()` is called for an unregistered token.
 *
 * @hidden
 */
export class ServiceNotFoundError extends Error {
    constructor(tokenDisplayName: string) {
        super(`No service registered for token "${tokenDisplayName}".`);
        this.name = 'ServiceNotFoundError';
    }
}

/**
 * CircularDependencyError — thrown when a circular dependency cycle is detected.
 *
 * @hidden
 */
export class CircularDependencyError extends Error {
    constructor(cycle: string[]) {
        super(`Circular dependency detected: ${cycle.join(' → ')}`);
        this.name = 'CircularDependencyError';
    }
}
