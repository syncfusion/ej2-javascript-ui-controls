/**
 * Placeholder type tokens (`ST_PlaceholderType`) and XSD defaults.
 *
 * @remarks
 * Citation: Transitional `pml.xsd` `ST_PlaceholderType` (~1213–1231),
 * `CT_Placeholder` (~1240–1249): `type` default **obj**, `idx` default **0**.
 */
/**
 * `ST_PlaceholderType` enumeration tokens (Transitional `pml.xsd`).
 */
import { arrayIncludes } from '../util/es5-compat';
export const PLACEHOLDER_TYPES: ReadonlyArray<string> = Object.freeze([
    'title',
    'body',
    'ctrTitle',
    'subTitle',
    'dt',
    'sldNum',
    'ftr',
    'hdr',
    'obj',
    'chart',
    'tbl',
    'clipArt',
    'dgm',
    'media',
    'sldImg',
    'pic'
]);
/**
 * One `ST_PlaceholderType` token.
 */
export type PlaceholderType = (typeof PLACEHOLDER_TYPES)[number];
/** XSD default for omitted `p:ph/@type` (`CT_Placeholder`). */
export const DEFAULT_PLACEHOLDER_TYPE: PlaceholderType = 'obj';
/** XSD default for omitted `p:ph/@idx` (`CT_Placeholder`). */
export const DEFAULT_PLACEHOLDER_IDX: number = 0;
/**
 * Returns true when `value` is a known `ST_PlaceholderType` token.
 *
 * @param {string} value - The value value.
 * @returns {boolean} The result.
 */
export function isPlaceholderType(value: string): value is PlaceholderType {
    return arrayIncludes(PLACEHOLDER_TYPES as ReadonlyArray<string>, value);
}
