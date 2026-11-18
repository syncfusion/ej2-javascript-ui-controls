import { PackageError } from '../errors/docx-error';

/**
 * OPC part name. Branded so it is not interchangeable with a ZIP item name or a
 * relationship Target string (`.agent/policies/typescript.md`).
 */
export type PartName = string & { readonly __brand: 'PartName' };

/**
 * ASCII case-insensitive part-name key (ECMA-376-2 §6.2.2.3).
 *
 * @param {string} name - The name.
 * @returns {string} The result.
 * @private
 */
export function partNameKey(name: string): string {
    return name.toLowerCase();
}

function rejectUnsafeSegments(logicalName: string): void {
    if (logicalName.includes('\0')) {
        throw new PackageError('package/invalid-part-name', 'Part name contains a NUL');
    }
    if (logicalName.includes('\\')) {
        throw new PackageError('package/invalid-part-name', `Part name contains a backslash: ${logicalName}`);
    }
    if (!logicalName.startsWith('/')) {
        throw new PackageError(
            'package/invalid-part-name',
            `OPC part names begin with '/': ${logicalName}`
        );
    }
    if (logicalName === '/') {
        throw new PackageError('package/invalid-part-name', 'Part name must have at least one segment');
    }
    if (logicalName.endsWith('/')) {
        throw new PackageError('package/invalid-part-name', `Part name must not end with '/': ${logicalName}`);
    }
    const segments: string[] = logicalName.slice(1).split('/');
    for (const segment of segments) {
        if (segment.length === 0) {
            throw new PackageError('package/invalid-part-name', `Part name has an empty segment: ${logicalName}`);
        }
        if (segment === '.' || segment === '..') {
            throw new PackageError(
                'package/invalid-part-name',
                `Part name contains a '.' or '..' segment: ${logicalName}`
            );
        }
        if (segment.endsWith('.')) {
            throw new PackageError(
                'package/invalid-part-name',
                `OPC forbids a path segment that ends with '.': ${logicalName}`
            );
        }
        if (/^[a-zA-Z]:/.test(segment)) {
            throw new PackageError('package/invalid-part-name', `Part name has a drive letter: ${logicalName}`);
        }
        if (/%2f/i.test(segment) || /%5c/i.test(segment)) {
            throw new PackageError(
                'package/invalid-part-name',
                `Part name has a percent-encoded slash: ${logicalName}`
            );
        }
    }
    if (!/^[\u0020-\u007e]+$/.test(logicalName)) {
        throw new PackageError(
            'package/invalid-part-name',
            `Phase 1 part names are ASCII (ECMA-376-2 §7.3.3 ZIP mapping): ${logicalName}`
        );
    }
}

/**
 * Validates and brands an OPC logical part name (leading `/`).
 * ECMA-376-2 §6.2.2.2 production `part_name = 1*( "/" isegment-nz )`.
 *
 * @param {string} value - The value.
 * @returns {PartName} The result.
 * @private
 */
export function partName(value: string): PartName {
    rejectUnsafeSegments(value);
    return value as PartName;
}

/**
 *  ZIP item name → logical part name (ECMA-376-2 §7.3.5).
 *
 * @param {string} zipItemName - The zip item name.
 * @returns {PartName} The result.
 * @private
 */
export function partNameFromZipItem(zipItemName: string): PartName {
    // split/join: String.replaceAll is ES2021 and is not rewritten by target ES5.
    const withForwardSlashes: string = zipItemName.split('\\').join('/');
    return partName(`/${withForwardSlashes}`);
}

/**
 *  Logical part name → ZIP item name (no leading `/`).
 *
 * @param {PartName} name - The name.
 * @returns {string} The result.
 * @private
 */
export function zipItemFromPartName(name: PartName): string {
    return name.slice(1);
}

export function partNamesEquivalent(left: string, right: string): boolean {
    return partNameKey(left) === partNameKey(right);
}

/**
 * True when `candidate` is derivable from `base` (ECMA-376-2 §6.2.2.3):
 * concatenating `base`, `/`, and some string S yields an equivalent name.
 *
 * @param {string} candidate - The candidate.
 * @param {string} base - The base.
 * @returns {boolean} The result.
 * @private
 */
export function isPartNameDerivableFrom(candidate: string, base: string): boolean {
    const child: string = partNameKey(candidate);
    const parent: string = partNameKey(base);
    return child.startsWith(`${parent}/`);
}

export function assertPartNameSetIntegrity(names: ReadonlyArray<PartName>): void {
    for (const [i, name] of names.entries()) {
        if (name === undefined) {
            continue;
        }
        for (let j: number = i + 1; j < names.length; j += 1) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const right: PartName = names[j];
            if (right === undefined) {
                continue;
            }
            if (partNamesEquivalent(name, right)) {
                throw new PackageError(
                    'package/duplicate-zip-entry',
                    `Equivalent part names in one package: ${name} and ${right} (ECMA-376-2 §6.2.2.3)`
                );
            }
            if (isPartNameDerivableFrom(name, right) || isPartNameDerivableFrom(right, name)) {
                throw new PackageError(
                    'package/invalid-part-name',
                    `Part name ${name} is derivable from ${right} (ECMA-376-2 §6.2.2.3)`
                );
            }
        }
    }
}

const RELS_SUFFIX: string = '.rels';

/**
 * Relationships parts: `/_rels/.rels` and `…/_rels/….rels` (ECMA-376-2 §6.5.2.2–§6.5.2.3).
 *
 * @param {PartName} name - The name.
 * @returns {boolean} The result.
 * @private
 */
export function isRelationshipsPartName(name: PartName): boolean {
    const segments: string[] = name.split('/').filter((segment: string) => segment.length > 0);
    if (segments.length < 2) {
        return false;
    }
    const last: string = segments[segments.length - 1];
    const secondLast: string = segments[segments.length - 2];
    if (last === undefined || secondLast === undefined) {
        return false;
    }
    return secondLast.toLowerCase() === '_rels' && last.toLowerCase().endsWith(RELS_SUFFIX);
}

export function isPackageRelationshipsPartName(name: PartName): boolean {
    return partNamesEquivalent(name, '/_rels/.rels');
}

/**
 *  Package Relationships part name (ECMA-376-2 §6.5.2.2).
 *
 * @returns {PartName} The result.
 * @private
 */
export function packageRelationshipsPartName(): PartName {
    return partName('/_rels/.rels');
}

/**
 * Part Relationships part name from a source part (ECMA-376-2 §6.5.2.3).
 *
 * @param {PartName} source - The source.
 * @returns {PartName} The result.
 * @private
 */
export function partRelationshipsPartName(source: PartName): PartName {
    const lastSlash: number = source.lastIndexOf('/');
    const directory: string = source.slice(0, lastSlash);
    const fileName: string = source.slice(lastSlash + 1);
    const relsDirectory: string = directory === '' ? '/_rels' : `${directory}/_rels`;
    return partName(`${relsDirectory}/${fileName}${RELS_SUFFIX}`);
}

/**
 * Inverse of {@link partRelationshipsPartName}. Package rels yield `undefined`.
 *
 * @param {PartName} relsPart - The rels part.
 * @returns {PartName | undefined} The result.
 * @private
 */
export function sourcePartNameFromRelationshipsPart(relsPart: PartName): PartName | undefined {
    if (!isRelationshipsPartName(relsPart)) {
        throw new PackageError('package/invalid-part-name', `Not a Relationships part: ${relsPart}`);
    }
    if (isPackageRelationshipsPartName(relsPart)) {
        return undefined;
    }
    const segments: string[] = relsPart.split('/');
    const last: string = segments[segments.length - 1];
    if (last === undefined || !last.toLowerCase().endsWith(RELS_SUFFIX)) {
        throw new PackageError('package/invalid-part-name', `Relationships part name is malformed: ${relsPart}`);
    }
    const sourceFile: string = last.slice(0, last.length - RELS_SUFFIX.length);
    const withoutRelsSegments: string[] = segments.slice(0, -2);
    return partName(`${withoutRelsSegments.join('/')}/${sourceFile}`);
}

function directoryOfPart(source: PartName): string {
    const lastSlash: number = source.lastIndexOf('/');
    if (lastSlash <= 0) {
        return '/';
    }
    return `${source.slice(0, lastSlash)}/`;
}

/**
 * Resolve an Internal relationship Target against a source part, or against the
 * package when `source` is omitted (package Relationships).
 *
 * @param {string} target - The target.
 * @param {PartName} source - The source.
 * @returns {PartName} The result.
 * @private
 */
export function resolveInternalTarget(target: string, source?: PartName): PartName {
    const trimmed: string = target.trim();
    if (trimmed.length === 0) {
        throw new PackageError('package/invalid-part-name', 'Internal relationship Target is empty');
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
        throw new PackageError(
            'package/invalid-part-name',
            `Internal relationship Target is not a package-relative reference: ${target}`
        );
    }
    let path: string;
    if (trimmed.startsWith('/')) {
        path = trimmed;
    } else {
        const basePath: string = source === undefined ? '/' : directoryOfPart(source);
        const resolved: URL = new URL(trimmed, `https://opc.invalid${basePath}`);
        path = resolved.pathname;
    }
    let decoded: string;
    try {
        decoded = decodeURIComponent(path);
    } catch {
        throw new PackageError('package/invalid-part-name', `Internal Target is not a valid URI path: ${target}`);
    }
    return partName(decoded);
}
