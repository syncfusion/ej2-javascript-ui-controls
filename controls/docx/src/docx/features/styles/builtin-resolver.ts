/**
 * Generic built-in style resolver (spec
 * the format specification §5, §6, §8, §9).
 *
 * One algorithm for all four {@link DocxStyleType}s:
 * 1. document collection first (by `styleId`, then by display name) — an
 *    existing (possibly user-modified) style is used unchanged, never
 *    replaced by catalog defaults;
 * 2. built-in catalog second (canonical ID, then display name) —
 *    deep-cloned via {@link instantiateBuiltinStyle};
 * 3. dependencies (`basedOn`, `next`, `link`) resolved recursively with a
 *    visited-set (cycle-safe, duplicate-free, type-validated);
 * 4. unknown on both paths — `styles/undefined-style` at the public
 *    assignment bridges; preserved silently on the parsed/save path
 *    (round-trip compatibility).
 *
 * @private
 */
import { DocxError } from '../../core/errors/docx-error';
import { canonicalBuiltinStyleId, getBuiltinStyleTemplate, getBuiltinStyleTemplateByDisplayName, instantiateBuiltinStyle, normalizeStyleName, BuiltinStyleTemplate } from './builtin-catalog';
import { DocxStyle, DocxStyleType } from './style';
/**
 * Lookup / mutation surface the built-in catalog resolver needs.
 * Implemented by `StylesPart` (transitional DocxStyle projection) and seed bags.
 * Named distinctly from the public live {@link StyleCollection} DOM type.
 *
 * @private
 */
export interface StyleLookupSurface {
    getStyle(styleId: string): DocxStyle | undefined;
    /** Style whose `w:name` matches `name` after normalization. */
    findStyleByDisplayName(name: string): DocxStyle | undefined;
    addStyle(style: DocxStyle): void;
}
function throwUndefinedStyle(nameOrId: string, target: DocxStyleType): never {
    throw new DocxError('styles/undefined-style', `Style "${nameOrId}" is not defined in this document and is not a known built-in ${target} style`);
}
function invalidTypeForTarget(style: DocxStyle, target: DocxStyleType): DocxError {
    return new DocxError('styles/invalid-type-for-target', `Style "${style.styleId}" is a ${String(style.type)} style and cannot be used as a ${target} style`);
}
function assertType(style: DocxStyle, target: DocxStyleType): void {
    if (style.type !== target) {
        throw invalidTypeForTarget(style, target);
    }
}
/** Dependency edge kind, for diagnostics. */
type DependencyKind = 'basedOn' | 'link';
function oppositeType(type: DocxStyleType): DocxStyleType {
    return type === 'paragraph' ? 'character' : 'paragraph';
}
/**
 *  Style type for dependency resolution; untyped styles can't have typed deps validated.
 *
 * @param {DocxStyle} style - The style.
 * @returns {DocxStyleType} The result.
 */
function typeOf(style: DocxStyle): DocxStyleType {
    return style.type != null ? style.type : 'paragraph';
}
/**
 * Resolve one style (id or display name) into the collection for `target`,
 * following §5.1: document-first, catalog-second, dependencies recursive,
 * cycle-safe, duplicate-free. Returns the style — existing or newly
 * instantiated. Throws `styles/undefined-style` for unknown values.
 *
 * @param {StyleLookupSurface} collection - The collection.
 * @param {string} nameOrId - The name or id.
 * @param {DocxStyleType} target - The target.
 * @returns {DocxStyle} The result.
 * @private
 */
export function resolveStyleForTarget(collection: StyleLookupSurface, nameOrId: string, target: DocxStyleType): DocxStyle {
    let ts330: any; let ts331: any;
    if (nameOrId.trim().length === 0) {
        throw new DocxError('content/invalid-style-id', 'Style id must not be empty');
    }
    // 2. WordDocument collection: by id, then by display name. Existing style is
    // used unchanged (user modifications preserved).
    const existing: DocxStyle =
        ((ts330 = collection.getStyle(nameOrId)), ts330 != null ? ts330 : collection.findStyleByDisplayName(nameOrId));
    if (existing !== undefined) {
        assertType(existing, target);
        return existing;
    }
    // 3. Catalog: canonical ID, then display name.
    const template: BuiltinStyleTemplate =
        ((ts331 = getBuiltinStyleTemplate(nameOrId)), ts331 != null ? ts331 : getBuiltinStyleTemplateByDisplayName(nameOrId));
    if (template === undefined) {
        throwUndefinedStyle(nameOrId, target);
    }
    if (template.type !== target) {
        throw new DocxError('styles/invalid-type-for-target', `Built-in style "${template.styleId}" is a ${template.type} style and cannot be used as a ${target} style`);
    }
    const instance: DocxStyle = instantiateBuiltinStyle(template);
    resolveDependencies(collection, instance, new Set([template.styleId]));
    collection.addStyle(instance);
    return instance;
}
/**
 * Resolve `style`'s `basedOn` / `next` / `link` dependencies, recursively,
 * adding each missing dependency before its dependent (deterministic
 * order). `visited` is the cycle guard: it starts with the dependent's own
 * id and accumulates every id already resolved on this branch.
 *
 * @param {StyleLookupSurface} collection - The collection.
 * @param {DocxStyle} style - The style.
 * @param {Set<string>} visited - The visited.
 * @returns {void} Nothing is returned.
 * @private
 */
export function resolveDependencies(collection: StyleLookupSurface, style: DocxStyle, visited: Set<string>): void {
    const basedOn: string = style.basedOn;
    if (basedOn !== undefined && basedOn.length > 0) {
        resolveDependency(collection, style, basedOn, 'basedOn', typeOf(style), visited);
    }
    const next: string = style.next;
    if (next !== undefined && next.length > 0) {
        // `next` must exist when it is a known built-in; a custom next style is
        // the document's own and is never invented.
        const canonical: string = canonicalBuiltinStyleId(next);
        if (canonical !== undefined && collection.getStyle(next) === undefined) {
            resolveStyleForTarget(collection, next, typeOf(style));
        }
    }
    const link: string = style.link;
    if (link !== undefined && link.length > 0) {
        resolveDependency(collection, style, link, 'link', oppositeType(typeOf(style)), visited);
    }
}
function resolveDependency(
    collection: StyleLookupSurface,
    dependent: DocxStyle,
    dependencyId: string,
    kind: DependencyKind,
    expectedType: DocxStyleType,
    visited: Set<string>
): void {
    // Existing (possibly user-modified) dependency — reuse unchanged.
    const existing: DocxStyle = collection.getStyle(dependencyId);
    if (existing !== undefined) {
        if (existing.type !== expectedType) {
            throw new DocxError(kind === 'basedOn' ? 'styles/invalid-based-on' : 'styles/invalid-link', `Style "${dependent.styleId}" ${kind} "${dependencyId}" is a ${String(existing.type)} style; expected ${expectedType}`);
        }
        return;
    }
    // Cycle: the dependency chain returned to a style already on this
    // branch. Parsed cycles are preserved verbatim and only guarded here —
    // report and stop, never recurse.
    if (visited.has(dependencyId)) {
        throw new DocxError(kind === 'basedOn' ? 'styles/circular-based-on' : 'styles/circular-link', `Circular ${kind} relationship on style "${dependencyId}"`);
    }
    const template: BuiltinStyleTemplate = getBuiltinStyleTemplate(dependencyId);
    if (template === undefined) {
        // A catalog style referencing an unknown dependency: preserve the
        // reference verbatim (it round-trips); the document may define it later.
        return;
    }
    if (template.type !== expectedType) {
        throw new DocxError(kind === 'basedOn' ? 'styles/invalid-based-on' : 'styles/invalid-link', `Style "${dependent.styleId}" ${kind} "${dependencyId}" is a ${template.type} style; expected ${expectedType}`);
    }
    const instance: DocxStyle = instantiateBuiltinStyle(template);
    const branchVisited: Set<string> = new Set(visited);
    branchVisited.add(dependencyId);
    resolveDependencies(collection, instance, branchVisited);
    collection.addStyle(instance);
}
/**
 * Resolve a referenced style id at save time (pending materialization /
 * parsed references): document-first, catalog-second, unknown preserved
 * without error. `target` type-checks a catalog hit only (an unknown
 * reference that stays absent is valid OOXML — a dangling reference).
 *
 * @param {StyleLookupSurface} collection - The collection.
 * @param {string} styleId - The style id.
 * @param {DocxStyleType} target - The target.
 * @returns {DocxStyle | undefined} The result.
 * @private
 */
export function resolveReferencedStyle(collection: StyleLookupSurface, styleId: string, target: DocxStyleType): DocxStyle | undefined {
    let ts332: any; let ts333: any;
    const existing: DocxStyle =
        ((ts332 = collection.getStyle(styleId)), ts332 != null ? ts332 : collection.findStyleByDisplayName(styleId));
    if (existing !== undefined) {
        return existing;
    }
    const template: BuiltinStyleTemplate =
        ((ts333 = getBuiltinStyleTemplate(styleId)), ts333 != null ? ts333 : getBuiltinStyleTemplateByDisplayName(styleId));
    if (template === undefined) {
        return undefined;
    }
    if (template.type !== target) {
        throw new DocxError('styles/invalid-type-for-target', `Built-in style "${template.styleId}" is a ${template.type} style and cannot be used as a ${target} style`);
    }
    const instance: DocxStyle = instantiateBuiltinStyle(template);
    resolveDependencies(collection, instance, new Set([template.styleId]));
    collection.addStyle(instance);
    return instance;
}
/**
 * Normalize `nameOrId` to the canonical built-in id when it names a known
 * built-in (id or display name); otherwise return the value verbatim
 * (custom styles keep their id).
 *
 * @param {string} nameOrId - The name or id.
 * @returns {string} The result.
 * @private
 */
export function canonicalizeStyleReference(nameOrId: string): string {
    let ts334: any;
    return ((ts334 = canonicalBuiltinStyleId(nameOrId)), ts334 != null ? ts334 : nameOrId);
}
