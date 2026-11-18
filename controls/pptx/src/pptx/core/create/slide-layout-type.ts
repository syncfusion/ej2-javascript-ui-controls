/**
 * Predefined slide layout type tokens for {@link AddSlideOptions.layout}.
 *
 * @remarks
 * Values are **only** the Transitional `ST_SlideLayoutType` enumeration tokens
 * listed below — never invented strings. Public member names are PascalCase;
 * values are the OOXML tokens written to `p:sldLayout/@type`. Where the public
 * name is not an XSD token (`TitleAndContent` → `obj`), the value stays the
 * schema token.
 *
 * Citation: ECMA-376-1 §19.7.15 `ST_SlideLayoutType`; Transitional `pml.xsd`
 * `ST_SlideLayoutType` ~1415–1454.
 */
import { arrayIncludes } from '../util/es5-compat';
/**
 * Public layout names mapped to OOXML `ST_SlideLayoutType` tokens.
 *
 * @remarks
 * Covers the eleven common Office "New Slide" layout kinds requested for create
 * {@link SlideCollection.add}. Additional XSD enumerations (e.g. `cust`, `tx`,
 * `fourObj`) are intentionally not exposed until product direction expands the
 * surface. String enum so `SlideLayoutType.Title` is the wire token `title`.
 */
export enum SlideLayoutType {
    /** Blank (`blank`). */
    Blank = 'blank',
    /** Title slide (`title`). Default when `slides.add` omits `layout`. */
    Title = 'title',
    /** Title only (`titleOnly`). */
    TitleOnly = 'titleOnly',
    /** Title and content / object (`obj`). */
    TitleAndContent = 'obj',
    /** Two content / two objects (`twoObj`). */
    TwoContent = 'twoObj',
    /** Comparison — two text and two objects (`twoTxTwoObj`). */
    Comparison = 'twoTxTwoObj',
    /** Section header (`secHead`). */
    SectionHeader = 'secHead',
    /** Picture with caption (`picTx`). */
    PictureWithCaption = 'picTx',
    /** Content with caption (`objTx`). */
    ContentWithCaption = 'objTx',
    /** Title and vertical text (`vertTx`). */
    TitleAndVerticalText = 'vertTx',
    /** Vertical title and text (`vertTitleAndTx`). */
    VerticalTitleAndText = 'vertTitleAndTx'
}
/**
 * One public predefined layout token (`ST_SlideLayoutType` value).
 */
export type SlideLayoutTypeValue =
    | SlideLayoutType.Blank
    | SlideLayoutType.Title
    | SlideLayoutType.TitleOnly
    | SlideLayoutType.TitleAndContent
    | SlideLayoutType.TwoContent
    | SlideLayoutType.Comparison
    | SlideLayoutType.SectionHeader
    | SlideLayoutType.PictureWithCaption
    | SlideLayoutType.ContentWithCaption
    | SlideLayoutType.TitleAndVerticalText
    | SlideLayoutType.VerticalTitleAndText;
/** OOXML token used when {@link AddSlideOptions.layout} is omitted (`title`). */
export const DEFAULT_SLIDE_LAYOUT_TYPE: SlideLayoutType = SlideLayoutType.Title;
const SLIDE_LAYOUT_TYPE_VALUES: ReadonlyArray<string> = Object.freeze([
    SlideLayoutType.Blank,
    SlideLayoutType.Title,
    SlideLayoutType.TitleOnly,
    SlideLayoutType.TitleAndContent,
    SlideLayoutType.TwoContent,
    SlideLayoutType.Comparison,
    SlideLayoutType.SectionHeader,
    SlideLayoutType.PictureWithCaption,
    SlideLayoutType.ContentWithCaption,
    SlideLayoutType.TitleAndVerticalText,
    SlideLayoutType.VerticalTitleAndText
]);
/**
 * Returns `true` when `value` is one of the public {@link SlideLayoutType} tokens.
 *
 * @param {string} value - Candidate layout token.
 * @returns {boolean} The result.
 */
export function isSlideLayoutType(value: string): value is SlideLayoutTypeValue {
    return arrayIncludes(SLIDE_LAYOUT_TYPE_VALUES, value);
}
