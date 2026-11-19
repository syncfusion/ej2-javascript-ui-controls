import { Literal } from '../../core/literal-type';
/**
 * Cited Office Math Markup Language (OMML) constants.
 *
 * Sources:
 * - ECMA-376 Part 1 §22.1 (Office Math)
 * - ECMA-376 Part 4 Annex A.8.1 `shared-math.xsd`
 * - ECMA-376 Part 1 WordprocessingML transitional namespace
 * - W3C XML 1.0 `xml:` namespace (xml:space on m:t)
 */

/**
 * Office Math namespace URI (`m:`).
 *
 * Source: ECMA-376-1 §22.1 /
 * `http://schemas.openxmlformats.org/officeDocument/2006/math`.
 *
 * @public
 */
export const MATH_NAMESPACE: Literal<'http://schemas.openxmlformats.org/officeDocument/2006/math'> =
  'http://schemas.openxmlformats.org/officeDocument/2006/math';

/**
 * Preferred math prefix candidates for save-scoped registry.
 * First unused candidate wins: `m`, then `m1`, `m2`, …
 *
 * Source: mathml-spec §1.9 / §9.3.
 *
 * @public
 */
export const MATH_PREFIX_FALLBACKS: string[] = ['m', 'm1', 'm2', 'm3', 'm4', 'm5'];

/**
 * WordprocessingML transitional namespace (`w:`).
 *
 * Used when bridging `w:rPr` / run content under `m:r` and `m:ctrlPr`
 * (ECMA-376-4 Annex A.8.1 `CT_R` / `CT_CtrlPr`).
 *
 * Source: ECMA-376-1 —
 * `http://schemas.openxmlformats.org/wordprocessingml/2006/main`.
 *
 * @public
 */
export const WML_TRANSITIONAL_NAMESPACE: Literal<'http://schemas.openxmlformats.org/wordprocessingml/2006/main'> =
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

/**
 * XML namespace used by `xml:space` on `m:t` (same policy as `w:t`).
 *
 * Source: W3C XML 1.0 — `http://www.w3.org/XML/1998/namespace`.
 *
 * @public
 */
export const XML_NAMESPACE: Literal<'http://www.w3.org/XML/1998/namespace'> = 'http://www.w3.org/XML/1998/namespace';
