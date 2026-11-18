/**
 * Direct placeholder metadata from `p:ph` (no inheritance resolve).
 */
import { PlaceholderType } from './constants';
/**
 * Authored placeholder attributes after applying XSD defaults for matching.
 *
 * @remarks
 * Values are **direct** from the shape's own `p:ph` (or the matched layout/master
 * shape's `p:ph`). This is not resolved style inheritance (TASK-1014).
 *
 * Defaults: omitted `@type` → {@link DEFAULT_PLACEHOLDER_TYPE} (`obj`);
 * omitted `@idx` → {@link DEFAULT_PLACEHOLDER_IDX} (`0`). Citation: Transitional
 * `pml.xsd` `CT_Placeholder`.
 */
export interface PlaceholderInfo {
    /**
     * Effective `p:ph/@type` after XSD default `obj` when the attribute is omitted.
     *
     * @remarks
     * Known tokens are {@link PlaceholderType}. Unknown tokens are preserved as
     * authored strings so matching still keys on the literal value.
     */
    readonly type: PlaceholderType | string;
    /**
     * Effective `p:ph/@idx` after XSD default `0` when omitted.
     */
    readonly idx: number;
    /**
     * Optional `p:ph/@orient` when present (`ST_Direction`).
     */
    readonly orient?: string;
    /**
     * Optional `p:ph/@sz` when present (`ST_PlaceholderSize`).
     */
    readonly sz?: string;
    /**
     * Optional `p:ph/@hasCustomPrompt` when present (`xsd:boolean` token as authored).
     */
    readonly hasCustomPrompt?: string;
    /**
     * Authored `cNvPr/@id` of the shape that carries this `p:ph`.
     *
     * @remarks
     * Never renumbered by the library.
     */
    readonly shapeId: string;
}
/**
 * Result of matching a slide placeholder to layout and master counterparts.
 *
 * @remarks
 * Match key is `${type}\0${idx}` after XSD defaults. Layout and master entries
 * are present only when a placeholder with the same key exists on that part
 * (first in document walk order wins on duplicate keys).
 */
export interface PlaceholderMatch {
    /**
     * Slide-side placeholder (always set when match is produced from a ph shape).
     */
    readonly slide: PlaceholderInfo;
    /**
     * Matching layout placeholder, when the slide's layout part has the same type+idx.
     */
    readonly layout?: PlaceholderInfo;
    /**
     * Matching master placeholder, when the master part has the same type+idx.
     */
    readonly master?: PlaceholderInfo;
}
