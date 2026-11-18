/**
 * OPC part-name validation and relationship target resolution.
 *
 * @remarks
 * ZIP entry names are mapped to absolute OPC part URIs (`/ppt/…`). Part names never
 * contain `.` / `..` traversal segments. Internal relationship `Target`s are resolved
 * per ECMA-376 Part 2 §6.4 (RFC 3986 §5 reference resolution): `.` and `..` dot
 * segments normalize **within the package root only**, and a target that would climb
 * above `/` is rejected fail-closed (ADR
 * `docs/adr/2026-09-10-office-relative-rel-targets.md`).
 */
import { InvalidPackageError } from '../security/errors';
/**
 * Converts a ZIP entry name into an absolute OPC part name (`/…`).
 *
 * @param entryName - Name from the ZIP central directory / local header.
 * @returns Absolute part URI with forward slashes and a leading `/`.
 * @throws {Error} when the name is empty, absolute externally,
 * contains `..`, backslashes, or drive/UNC forms.
 */
import { stringIncludes, arrayAt } from '../util/es5-compat';
/**
 *
 * @param {string} entryName - The entryName value.
 * @returns {string} The result.
 */
export function zipEntryToPartName(entryName: string): string {
    if (entryName.length === 0) {
        throw new InvalidPackageError('ZIP entry name is empty');
    }
    // Reject Windows separators early — OPC uses `/` only.
    if (stringIncludes(entryName, '\\')) {
        throw new InvalidPackageError('ZIP entry name must use forward slashes', {
            partName: entryName
        });
    }
    // Strip a single leading `/` for validation of segments; we re-add it.
    const withoutRoot: string = entryName.startsWith('/') ? entryName.slice(1) : entryName;
    if (withoutRoot.length === 0) {
        throw new InvalidPackageError('ZIP entry name resolves to package root only', {
            partName: entryName
        });
    }
    // Drive letter (C:…) or bare absolute without our leading slash handling.
    if (/^[a-zA-Z]:/u.test(withoutRoot) || withoutRoot.startsWith('//')) {
        throw new InvalidPackageError('ZIP entry name must not be an absolute or drive path', {
            partName: entryName
        });
    }
    const segments: Array<string> = withoutRoot.split('/');
    for (let i: number = 0; i < segments.length; i++) {
        const segment: string = arrayAt(segments, i);
        if (segment.length === 0) {
            throw new InvalidPackageError('ZIP entry name contains an empty path segment', {
                partName: entryName
            });
        }
        if (segment === '.' || segment === '..') {
            throw new InvalidPackageError('ZIP entry name must not contain "." or ".." segments', {
                partName: entryName
            });
        }

    }
    return `/${withoutRoot}`;
}
/**
 * Returns true when a part name is the reserved content-types stream.
 *
 * @param {string} partName - The partName value.
 * @returns {boolean} The result.
 */
export function isContentTypesPart(partName: string): boolean {
    return partName.toLowerCase() === '/[content_types].xml';
}
/**
 * Pattern for ECMA-376 Part 1 §9.1.5 Trash Items: `/[trash]/HHHH.dat`
 * (literal `[trash]/` then four hexadecimal digits and `.dat`). Matched
 * case-insensitively.
 *
 * @remarks
 * Citation: `specs/ecma/ECMA-376-1_5th_edition_december_2016/Ecma Office Open XML
 * Part 1 - Fundamentals And Markup Language Reference.md` §9.1.5 Trash Items —
 * producers name discarded package items `[trash]/HHHH.dat` (note the `/`
 * after `]`); such items **shall not** conform to OPC part naming and **shall
 * not** be associated with a content type. ECMA-376 Part 2 treats
 * `"/[trash]/0000.dat"` as a logical item that cannot be mapped to a part. The
 * library still retains the ZIP bytes for round-trip but never emits a
 * Content_Types Default/Override for them.
 */
const TRASH_ITEM_NAME: RegExp = /^\/\[trash\]\/[0-9a-fA-F]{4}\.dat$/iu;
/**
 * Returns true when a package path is an ECMA-376 trash item name.
 *
 * @param {string} partName - Absolute package path (leading `/`) or candidate URI.
 * @returns {boolean} `true` for `/[trash]/HHHH.dat` forms; otherwise `false`.
 */
export function isTrashItem(partName: string): boolean {
    return TRASH_ITEM_NAME.test(partName);
}
/**
 * Returns the relationships part name for a source part (or package root).
 *
 * @example relationshipsPartName('/') → `/_rels/.rels` relationshipsPartName('/ppt/presentation.xml') → `/ppt/_rels/presentation.xml.rels`
 * @param {string} sourcePartName - Absolute part URI, or `/` for package relationships.
 * @returns {string} Absolute URI of the `.rels` part.
 */
export function relationshipsPartName(sourcePartName: string): string {
    if (sourcePartName === '/' || sourcePartName === '') {
        return '/_rels/.rels';
    }
    const name: string = sourcePartName.startsWith('/') ? sourcePartName : `/${sourcePartName}`;
    const lastSlash: number = name.lastIndexOf('/');
    const dir: string = name.slice(0, lastSlash); // '' for top-level parts like /foo.xml → wait: name is /foo.xml, lastSlash=0, dir=''
    const file: string = name.slice(lastSlash + 1);
    // dir empty means part lives at package root: `/_rels/file.rels`
    if (dir.length === 0) {
        return `/_rels/${file}.rels`;
    }
    return `${dir}/_rels/${file}.rels`;
}
/**
 * Resolves an internal relationship Target against a source part URI.
 *
 * @remarks Follows ECMA-376 Part 2 §6.4 relative reference resolution (RFC 3986 §5): the target is merged onto the source part's directory
 * (the source part itself for part relationships; the package root `/` for package relationships), then dot segments are removed per RFC
 * 3986 §5.2.4. `..` may consume a preceding segment only while one exists inside the package — Microsoft Office authors targets such as
 * `../theme/theme1.xml` (real-deck forms; see the ADR). Normalization is confined to the package root: a target that would climb above `/`
 * names no legal OPC part and is rejected fail-closed rather than clamped.
 * @throws {Error} on traversal above the package root, drive/UNC paths, backslashes, or invalid segments.
 * @param {string} sourcePartName - Absolute URI of the source part (use `/` for package rels).
 * @param {string} target - Relationship Target attribute (may be relative or absolute-within-package).
 * @returns {string} Absolute part URI.
 */
export function resolveInternalTarget(sourcePartName: string, target: string): string {
    if (target.length === 0) {
        throw new InvalidPackageError('Relationship Target is empty', { partName: sourcePartName });
    }
    if (stringIncludes(target, '\\')) {
        throw new InvalidPackageError('Relationship Target must use forward slashes', {
            partName: sourcePartName
        });
    }
    if (/^[a-zA-Z]:/u.test(target) || target.startsWith('//')) {
        throw new InvalidPackageError('Relationship Target must not be a drive or UNC path', {
            partName: sourcePartName
        });
    }
    let absolute: string;
    if (target.startsWith('/')) {
        absolute = target;
    }
    else {
        const baseDir: string = sourcePartName === '/' || sourcePartName === ''
            ? ''
            : sourcePartName.slice(0, sourcePartName.lastIndexOf('/'));
        // Relative to the source part's directory (OPC).
        const joined: string = baseDir.length === 0 ? target : `${baseDir.slice(1)}/${target}`;
        absolute = `/${joined}`;
    }
    // Remove dot segments per RFC 3986 §5.2.4, confined to the package root:
    // `.` is skipped; `..` pops a preceding segment when one exists, and is a
    // package-root escape (fail-closed) when it does not.
    const segments: Array<string> = absolute.slice(1).split('/');
    const out: string[] = [];
    for (let i: number = 0; i < segments.length; i++) {
        const segment: string = arrayAt(segments, i);
        if (segment.length === 0) {
            throw new InvalidPackageError('Relationship Target contains an empty path segment', {
                partName: sourcePartName
            });
        }
        if (segment === '.') {
            continue;
        }
        if (segment === '..') {
            if (out.length === 0) {
                throw new InvalidPackageError('Relationship Target escapes the package root via ".." segments',
                                              { partName: sourcePartName });
            }
            out.pop();
            continue;
        }
        out.push(segment);

    }
    return `/${out.join('/')}`;
}
/**
 * Derives a ZIP entry name (no leading slash) from an absolute OPC part name.
 *
 * @param {string} partName - The partName value.
 * @returns {string} The result.
 */
export function partNameToZipEntry(partName: string): string {
    if (!partName.startsWith('/')) {
        throw new InvalidPackageError('OPC part name must be absolute', { partName });
    }
    return partName.slice(1);
}
/**
 * Computes the Office-authoring-form **relative** relationship `Target` for an
 * internal package relationship, expressed relative to the directory of the
 * source part per ECMA-376 Part 2 §6.4 (RFC 3986 §5 reference resolution).
 *
 * @remarks Microsoft PowerPoint authors internal `Target`s as relative paths with `..` dot segments (e.g.
 * `../slideLayouts/slideLayout1.xml`, `../theme/theme1.xml`) rather than absolute `/ppt/…` paths. Absolute Targets are legal OPC but
 * trigger repair prompts in some Office builds. This helper produces the same relative spelling Office uses so library-created packages
 * open without repair. Package relationships (`sourcePartName === '/'`) resolve against the package root, so a target such as
 * `/ppt/presentation.xml` becomes `ppt/presentation.xml` (no leading slash, same-directory relative) — matching the package-level rels
 * convention observed in real PowerPoint files.
 * @example relativeTarget('/ppt/slides/slide1.xml', '/ppt/slideLayouts/slideLayout1.xml') → '../slideLayouts/slideLayout1.xml'
 * relativeTarget('/', '/ppt/presentation.xml') → 'ppt/presentation.xml' relativeTarget('/ppt/slideMasters/slideMaster1.xml',
 * '/ppt/theme/theme1.xml') → '../theme/theme1.xml'
 * @param {string} sourcePartName - Absolute URI of the source part (use `/` for package rels).
 * @param {string} targetPartName - Absolute URI of the target part.
 * @returns {string} Relative `Target` attribute value (no leading `/`).
 */
export function relativeTarget(sourcePartName: string, targetPartName: string): string {
    if (!targetPartName.startsWith('/')) {
        throw new InvalidPackageError('Target part name must be absolute', {
            partName: targetPartName
        });
    }
    // Source directory segments (without the file name). Package root → [].
    let sourceDir: string[];
    if (sourcePartName === '/' || sourcePartName === '') {
        sourceDir = [];
    }
    else {
        if (!sourcePartName.startsWith('/')) {
            throw new InvalidPackageError('Source part name must be absolute', {
                partName: sourcePartName
            });
        }
        const lastSlash: number = sourcePartName.lastIndexOf('/');
        // Slice [1, lastSlash) then split → directory segments without leading '/'.
        sourceDir = sourcePartName.slice(1, lastSlash).split('/').filter((s: string) => s.length > 0);
    }
    const targetSegments: Array<string> = targetPartName.slice(1).split('/').filter((s: string) => s.length > 0);
    if (targetSegments.length === 0) {
        throw new InvalidPackageError('Target part name must not be the package root', {
            partName: targetPartName
        });
    }
    // Strip common leading directory segments shared by source dir and target.
    let common: number = 0;
    while (common < sourceDir.length &&
        common < targetSegments.length - 1 &&
        arrayAt(sourceDir, common) === arrayAt(targetSegments, common)) {
        common++;
    }
    // `..` for each remaining source directory segment after the common prefix.
    const ups: number = sourceDir.length - common;
    // Remaining target segments (the file name plus any non-common directories).
    const tail: Array<string> = targetSegments.slice(common);
    const parts: string[] = [];
    for (let i: number = 0; i < ups; i++) {
        parts.push('..');
    }
    parts.push(...tail);
    return parts.join('/');
}
