import { arrayAt } from '../util/es5-compat';
/**
 * Index and match placeholders by type+idx across slide / layout / master.
 */
import { Shape } from '../shapes/shape';
import { PlaceholderMatch, PlaceholderInfo } from './placeholder-info';
/**
 * Composite match key: type and idx after XSD defaults.
 *
 * @internal
 * @param {string} type - The type value.
 * @param {number} idx - The idx value.
 * @returns {string} The result.
 */
export { placeholderMatchKey } from './match-key';
import { placeholderMatchKey } from './match-key';
/**
 * Indexed placeholder maps for one common-slide-data part (layout or master).
 *
 * @remarks
 * First shape in document walk order wins for a given key. Duplicates are listed
 * in {@link PlaceholderIndex.duplicateKeys} for diagnostics (spec: first-wins).
 *
 * @internal
 */
export interface PlaceholderIndex {
    /** First shape per `${type}\0${idx}`. */
    readonly byKey: ReadonlyMap<string, Shape>;
    /** Keys that appeared more than once (document order; first kept in `byKey`). */
    readonly duplicateKeys: ReadonlyArray<string>;
}
/**
 * Builds a type+idx index from shapes on a layout or master part.
 *
 * @internal
 * @param {*} shapes - Walk order from {@link walkSlideShapeTree}.
 * @returns {PlaceholderIndex} Index for matching.
 */
export function buildPlaceholderIndex(shapes: ReadonlyArray<Shape>): PlaceholderIndex {
    const byKey: Map<string, Shape> = new Map<string, Shape>();
    const duplicateKeys: string[] = [];
    const seenDup: Set<string> = new Set<string>();
    for (let i: number = 0; i < shapes.length; i++) {
        const shape: Shape = arrayAt(shapes, i);
        const info: PlaceholderInfo = shape.placeholder;
        if (info === undefined) {
            continue;
        }
        const key: string = placeholderMatchKey(info.type, info.idx);
        const existing: Shape = byKey.get(key);
        if (existing === undefined) {
            byKey.set(key, shape);
            continue;
        }
        if (!seenDup.has(key)) {
            seenDup.add(key);
            duplicateKeys.push(key);
        }

    }
    return {
        byKey,
        duplicateKeys: Object.freeze([...duplicateKeys])
    };
}
/**
 * Matches a slide placeholder shape to layout and master indexes.
 *
 * @remarks Non-placeholder shapes return `undefined` (no false match). Matching never mutates DOM or renumbers `cNvPr` ids.
 * @internal
 * @param {Shape} slideShape - Shape on the slide (must carry `p:ph`).
 * @param {PlaceholderIndex | undefined} layoutIndex - Index of the slide's layout placeholders, if loaded.
 * @param {PlaceholderIndex | undefined} masterIndex - Index of the master placeholders, if loaded.
 * @returns {PlaceholderMatch | undefined} Match with slide info and optional layout/master, or `undefined` if not a ph.
 */
export function matchPlaceholderShape(slideShape: Shape, layoutIndex: PlaceholderIndex | undefined,
                                      masterIndex: PlaceholderIndex | undefined): PlaceholderMatch | undefined {
    const slideInfo: PlaceholderInfo = slideShape.placeholder;
    if (slideInfo === undefined) {
        return undefined;
    }
    const key: string = placeholderMatchKey(slideInfo.type, slideInfo.idx);
    const layoutShape: Shape = layoutIndex != null ? layoutIndex.byKey.get(key) : undefined;
    const masterShape: Shape = masterIndex != null ? masterIndex.byKey.get(key) : undefined;
    const layoutInfo: PlaceholderInfo = layoutShape != null ? layoutShape.placeholder : undefined;
    const masterInfo: PlaceholderInfo = masterShape != null ? masterShape.placeholder : undefined;
    return {
        slide: slideInfo,
        ...(layoutInfo !== undefined ? { layout: layoutInfo } : {}),
        ...(masterInfo !== undefined ? { master: masterInfo } : {})
    };
}
