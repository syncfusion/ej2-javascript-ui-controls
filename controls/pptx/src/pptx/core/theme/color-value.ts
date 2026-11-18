/**
 * DrawingML colour choice values under `EG_ColorChoice` (`dml-main.xsd`).
 *
 * @remarks
 * These are **direct** authored colours on the theme scheme (or other colour
 * carriers). A `scheme` kind is still a reference — it is not an RGB resolve
 * result. Never treat a resolved RGB view as interchangeable with these values.
 */
/**
 * Direct colour value parsed from one `EG_ColorChoice` alternative.
 *
 * @remarks
 * Discriminated by `kind`. Transform children (`EG_ColorTransform`) are out of
 * scope for theme-part load (TASK-1011); only the choice element and its
 * required attributes are modelled.
 */
export type ColorValue = SrgbColorValue | ScrgbColorValue | HslColorValue | SysColorValue | SchemeColorValue | PrstColorValue;
/** `a:srgbClr` — hex RGB (`s:ST_HexColorRGB`). */
export interface SrgbColorValue {
    /** Discriminant for a:srgbClr. */
    readonly kind: 'srgb';
    /** Six hex digits without `#` (e.g. `FF0000`). */
    readonly val: string;
}
/** `a:scrgbClr` — percentage RGB components. */
export interface ScrgbColorValue {
    /** Discriminant for a:scrgbClr. */
    readonly kind: 'scrgb';
    /** Red component as a percentage string (a:scrgbClr/@r). */
    readonly r: string;
    /** Green component as a percentage string (a:scrgbClr/@g). */
    readonly g: string;
    /** Blue component as a percentage string (a:scrgbClr/@b). */
    readonly b: string;
}
/** `a:hslClr` — hue / saturation / luminance. */
export interface HslColorValue {
    /** Discriminant for a:hslClr. */
    readonly kind: 'hsl';
    /** Hue value string (a:hslClr/@hue). */
    readonly hue: string;
    /** Saturation value string (a:hslClr/@sat). */
    readonly sat: string;
    /** Luminance value string (a:hslClr/@lum). */
    readonly lum: string;
}
/** `a:sysClr` — system colour token with optional `lastClr`. */
export interface SysColorValue {
    /** Discriminant for a:sysClr. */
    readonly kind: 'sys';
    /** System colour token (a:sysClr/@val). */
    readonly val: string;
    /** Optional last-used sRGB hex snapshot (a:sysClr/@lastClr). */
    readonly lastClr: string | undefined;
}
/**
 * `a:schemeClr` — scheme / map colour reference (`ST_SchemeColorVal`).
 *
 * @remarks
 * This is a **reference**, not a resolved RGB. Resolve through the effective
 * colour map is TASK-1012.
 */
export interface SchemeColorValue {
    /** Discriminant for a:schemeClr (reference, not resolved RGB). */
    readonly kind: 'scheme';
    /** Scheme colour token (a:schemeClr/@val, ST_SchemeColorVal). */
    readonly val: string;
}
/** `a:prstClr` — preset colour name (`ST_PresetColorVal`). */
export interface PrstColorValue {
    /** Discriminant for a:prstClr. */
    readonly kind: 'prst';
    /** Preset colour name (a:prstClr/@val, ST_PresetColorVal). */
    readonly val: string;
}
