import { PackageError } from '../errors/docx-error';

/**
 * ZIP item names map to OPC logical names by adding a leading `/`
 * (ECMA-376-2 §7.3.5). Reject traversal and filesystem-absolute names before
 * inflate (`.agent/policies/security.md`).
 *
 * @param {string} name - The name.
 * @returns {void} Nothing is returned.
 * @private
 */
export function assertSafeZipItemName(name: string): void {
    if (name.length === 0) {
        throw new PackageError('package/invalid-part-name', 'ZIP item name is empty');
    }
    if (name.includes('\0')) {
        throw new PackageError('package/invalid-part-name', 'ZIP item name contains a NUL');
    }
    // split/join: String.replaceAll is ES2021 and is not rewritten by target ES5.
    const withForwardSlashes: string = name.split('\\').join('/');
    if (withForwardSlashes.startsWith('/') || name.startsWith('\\')) {
        throw new PackageError(
            'package/invalid-part-name',
            `ZIP item name is an absolute path: ${name}`
        );
    }
    if (/^[a-zA-Z]:/.test(name)) {
        throw new PackageError('package/invalid-part-name', `ZIP item name has a drive letter: ${name}`);
    }
    if (withForwardSlashes.startsWith('//')) {
        throw new PackageError('package/invalid-part-name', `ZIP item name is a UNC path: ${name}`);
    }
    const segments: string[] = withForwardSlashes.split('/');
    for (const segment of segments) {
        if (segment === '..') {
            throw new PackageError('package/invalid-part-name', `ZIP item name contains '..': ${name}`);
        }
    }
}
