/**
 * Core package infrastructure: errors, lengths, paper size, OPC, XML, zip.
 *
 * Root packaging entry for `generateRootFiles` (`core.ts` → `./src/xlsx/core/index`).
 */

export * from './errors';
export * from './length';
export * from './paper-size';

export * from './package/constants';
export * from './package/content-types';
export * from './package/opc-package';
export * from './package/part-names';
export * from './package/relationships';

export * from './xml/minimal-xml';

export * from './zip/limits';
export * from './zip/zip-reader';
export * from './zip/zip-writer';
