/**
 * OPC part name normalization and relationship target resolution.
 *
 * Part names use forward-slash absolute grammar (`/xl/workbook.xml`).
 * Relationship targets resolve relative to the source part URI
 * (ECMA-376-2 Relationships).
 *
 * @private
 */

import { InvalidPackageError } from '../errors';

/**
 * Normalize a ZIP entry name or part name to an absolute OPC part name. - Backslashes → forward slashes - Ensure leading `/` - Collapse duplicate slashes - Remove `.` segments; reject `..` escape above root
 *
 * @param {string} name - The name parameter.
 * @returns {string} - Returns the result.
 */
export function normalizePartName(name: string): string {
    let n: string = name.replace(/\\/g, '/').trim();
    if (n.length === 0) {
        throw new InvalidPackageError('Part name is empty');
    }
    // Content types and rels may appear without leading slash in ZIP.
    if (!n.startsWith('/')) {
        n = `/${n}`;
    }
    const segments: string[] = n.split('/');
    const out: string[] = [];
    for (let i: number = 0; i < segments.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const seg: string = segments[i];
        if (seg === undefined || seg.length === 0) {
            // Leading empty from initial `/` or duplicate slash — skip extras.
            if (i === 0) {
                continue;
            }
            continue;
        }
        if (seg === '.') {
            continue;
        }
        if (seg === '..') {
            if (out.length === 0) {
                throw new InvalidPackageError(`Part name escapes package root: "${name}"`);
            }
            out.pop();
            continue;
        }
        out.push(seg);
    }
    return `/${out.join('/')}`;
}

/**
 * Case-insensitive compare of OPC part names (used for Override PartName).
 *
 * @param {string} a - The a parameter.
 * @param {string} b - The b parameter.
 * @returns {boolean} - Returns the result.
 */
export function partNamesEqual(a: string, b: string): boolean {
    return normalizePartName(a).toLowerCase() === normalizePartName(b).toLowerCase();
}

/**
 * Extension (without dot) for Default content type matching, lower-cased. Returns undefined when the part has no extension.
 *
 * @param {string} partName - The partName parameter.
 * @returns {string} - Returns the result.
 */
export function partExtension(partName: string): string | undefined {
    const normalized: string = normalizePartName(partName);
    const base: string = normalized.slice(normalized.lastIndexOf('/') + 1);
    const dot: number = base.lastIndexOf('.');
    // Allow leading-dot names such as `.rels` → extension `rels` (OPC package rels).
    if (dot < 0 || dot === base.length - 1) {
        return undefined;
    }
    return base.slice(dot + 1).toLowerCase();
}

/**
 * ZIP entry name for an absolute OPC part name (strip leading `/`).
 *
 * @param {string} partName - The partName parameter.
 * @returns {string} - Returns the result.
 */
export function partNameToZipName(partName: string): string {
    const n: string = normalizePartName(partName);
    return n.startsWith('/') ? n.slice(1) : n;
}

/**
 * Absolute OPC name of the relationships part for `sourcePart`. Package-level: `sourcePart` is `null` → `/_rels/.rels`. Part-level: `/xl/workbook.xml` → `/xl/_rels/workbook.xml.rels`.
 *
 * @param {string} sourcePart - The sourcePart parameter.
 * @returns {string} - Returns the result.
 */
export function relationshipsPartNameFor(sourcePart: string | null): string {
    if (sourcePart === null || sourcePart === '/' || sourcePart === '') {
        return '/_rels/.rels';
    }
    const name: string = normalizePartName(sourcePart);
    const slash: number = name.lastIndexOf('/');
    const dir: string = slash <= 0 ? '' : name.slice(0, slash);
    const file: string = name.slice(slash + 1);
    return `${dir}/_rels/${file}.rels`;
}

/**
 * Resolve a relationship Target URI against a source part. External targets are returned as-is (not fetched).
 *
 * @param {string} sourcePart - The sourcePart parameter.
 * @param {string} target - The target parameter.
 * @param {*} targetMode - The targetMode parameter.
 * @returns {string} - Returns the result.
 */
export function resolveRelationshipTarget(
    sourcePart: string | null,
    target: string,
    targetMode: 'Internal' | 'External' | undefined
): string {
    if (targetMode === 'External') {
        return target;
    }

    // Absolute package URI
    if (target.startsWith('/')) {
        return normalizePartName(target);
    }

    // Relative to source part's directory (package root when source is null).
    let baseDir: string;
    if (sourcePart === null || sourcePart === '/' || sourcePart === '') {
        baseDir = '/';
    } else {
        const src: string = normalizePartName(sourcePart);
        const slash: number = src.lastIndexOf('/');
        baseDir = slash <= 0 ? '/' : src.slice(0, slash + 1);
    }

    const combined: string =
        baseDir.endsWith('/') || baseDir === '/' ? `${baseDir === '/' ? '/' : baseDir}${target}` : `${baseDir}/${target}`;
    return normalizePartName(combined);
}
