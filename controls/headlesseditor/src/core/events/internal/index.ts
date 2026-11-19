/**
 * Internal events — infrastructure-level signals used only within the
 * Headless Editor runtime. These types are NOT exported from the public
 * package index and carry @hidden annotations.
 *
 * Consumers must not import from this path.
 *
 * @hidden
 */
export * from './document-events';
export * from './editor-state-events';
export * from './extension-events';
