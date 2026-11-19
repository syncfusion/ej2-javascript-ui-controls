/**
 * Stable absolute OPC part URIs used by the create skeleton.
 *
 * @remarks
 * Slide order is **not** encoded in these names — only `p:sldIdLst` order matters.
 * Adding slides appends `slideN.xml` without renaming existing parts.
 */
/** Presentation main part. */
export const CREATE_PRESENTATION_PART: string = '/ppt/presentation.xml';
/** First slide master part. */
export const CREATE_SLIDE_MASTER_PART: string = '/ppt/slideMasters/slideMaster1.xml';
/**
 * Blank slide layout part from `defaultContent.zip` (`slideLayout7.xml`, `type="blank"`).
 * Layout file numbers are identity only; blank is not `slideLayout1` in that template.
 */
export const CREATE_SLIDE_LAYOUT_PART: string = '/ppt/slideLayouts/slideLayout7.xml';
/** Primary theme part. */
export const CREATE_THEME_PART: string = '/ppt/theme/theme1.xml';
/**
 * Conventional first slide part URI allocated by the first `slides.add`.
 *
 * @remarks
 * `Presentation.create` does **not** seed this part. The constant is the expected
 * path for the first added slide (`slide1.xml`); order still lives only in
 * `p:sldIdLst`, never in part names.
 */
export const CREATE_FIRST_SLIDE_PART: string = '/ppt/slides/slide1.xml';
/**
 * Presentation properties part (ECMA-376 Part 1 §13.3.7 — shall exist).
 * Conventional path: `/ppt/presProps.xml`.
 */
export const CREATE_PRES_PROPS_PART: string = '/ppt/presProps.xml';
/**
 * View properties part (ECMA-376 Part 1 §13.3.13 — zero-or-one).
 * Conventional path: `/ppt/viewProps.xml`.
 */
export const CREATE_VIEW_PROPS_PART: string = '/ppt/viewProps.xml';
/**
 * Table styles part (ECMA-376 Part 1 §14.2.9 — zero-or-one).
 * Conventional path: `/ppt/tableStyles.xml`.
 */
export const CREATE_TABLE_STYLES_PART: string = '/ppt/tableStyles.xml';
/**
 * Core properties part (ECMA-376-1 §15.2.12.1; ECMA-376-2 §8.2).
 * Conventional path: `/docProps/core.xml`. Package-level relationship target.
 */
export const CREATE_CORE_PROPS_PART: string = '/docProps/core.xml';
/**
 * Extended (application) properties part (ECMA-376-1 §15.2.12.3).
 * Conventional path: `/docProps/app.xml`. Package-level relationship target.
 */
export const CREATE_APP_PROPS_PART: string = '/docProps/app.xml';
/**
 * Builds `/ppt/slides/slide{n}.xml` for 1-based n.
 *
 * @param {number} index1Based - Slide file number (1, 2, …) — identity only, not list order.
 * @returns {string} The result.
 */
export function slidePartName(index1Based: number): string {
    return `/ppt/slides/slide${String(index1Based)}.xml`;
}
/**
 * Builds `/ppt/slideLayouts/slideLayout{n}.xml` for 1-based n.
 *
 * @param {number} index1Based - Layout file number (1, 2, …) — identity only; never encodes
 * @returns {string} The result.
 */
export function slideLayoutPartName(index1Based: number): string {
    return `/ppt/slideLayouts/slideLayout${String(index1Based)}.xml`;
}
