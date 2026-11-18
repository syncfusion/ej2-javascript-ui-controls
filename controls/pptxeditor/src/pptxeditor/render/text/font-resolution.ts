import { SlideFrameFontCollection } from '../../main-slide/slide-frame-model';

/** Fonts pinned by the Stage 1 reference and browser baseline policy, in fallback order.  @internal */
/**
 * @internal
 */
export const PINNED_FONT_FAMILIES: ReadonlyArray<string> = Object.freeze([
    'Arial', 'Courier New', 'Times New Roman'
]);

/** Script families distinguished by DrawingML font properties.  @internal */
/**
 * @internal
 */
export type TextScript = 'latin' | 'eastAsian' | 'complexScript';

/** Major and minor font collections from the effective presentation theme.  @internal */
/**
 * @internal
 */
export interface ThemeFontCollections {
    /** Major theme font collection. */
    readonly major: SlideFrameFontCollection;
    /** Minor theme font collection. */
    readonly minor: SlideFrameFontCollection;
}

/** Inputs needed to resolve an authored or theme font without mutating the document.  @internal */
/**
 * @internal
 */
export interface FontResolutionRequest {
    /** Direct family or DrawingML `+mj`/`+mn` theme token. */
    readonly typeface?: string;
    /** Script category of the text being resolved. */
    readonly script: TextScript;
    /** DrawingML supplemental script tag such as `Jpan` or `Arab`. */
    readonly unicodeScript?: string;
    /** Theme role used when no explicit theme token is present. @defaultValue `minor`. */
    readonly defaultThemeRole?: 'major' | 'minor';
}

/** Direct and render-selected font families kept as separate values.  @internal */
/**
 * @internal
 */
export interface ResolvedFontFamily {
    /** Family selected by authored/theme/default resolution before baseline substitution. */
    readonly requestedFamily: string;
    /** Pinned family used by the Stage 1 renderer. */
    readonly selectedFamily: string;
    /** Remaining pinned families in deterministic fallback order. */
    readonly fallbackFamilies: ReadonlyArray<string>;
    /** Whether the pinned renderer substituted the requested family. */
    readonly substituted: boolean;
    /** Resolution level that supplied `requestedFamily`. */
    readonly source: 'direct' | 'theme-major' | 'theme-minor' | 'default';
}

/**
 * Ports `Font.GetFontNameToRender` and `Helper.GetDefaultFontName` ordering.
 * Authored/theme values remain inputs; this render-time result is never written back.
 *
 * @param {FontResolutionRequest} request - Authored family/token and script context.
 * @param {ThemeFontCollections} theme - Effective major/minor theme font collections.
 * @returns {ResolvedFontFamily} Separate requested and pinned render families with provenance.
 * @internal
 */
export function resolveFontFamily(
    request: FontResolutionRequest,
    theme: ThemeFontCollections
): ResolvedFontFamily {
    const token: { readonly role: 'major' | 'minor'; readonly script: TextScript; } = parseThemeToken(request.typeface);
    const role: 'major' | 'minor' = optionalProperty(token, 'role') || request.defaultThemeRole || 'minor';
    const script: TextScript = optionalProperty(token, 'script') || request.script;
    const collection: SlideFrameFontCollection = theme[role];
    const themed: string = supplementalTypeface(collection, request.unicodeScript) || collection[script];
    const direct: string | undefined = request.typeface && !token ? request.typeface : undefined;
    const platformDefault: string = script === 'eastAsian' ? 'MS Gothic' : 'Arial';
    const requestedFamily: string = direct || themed || platformDefault;
    const selectedFamily: string = pinnedFamily(requestedFamily) || 'Arial';
    const source: ResolvedFontFamily['source'] = direct ? 'direct' : themed ?
        (role === 'major' ? 'theme-major' : 'theme-minor') : 'default';
    return {
        requestedFamily,
        selectedFamily,
        fallbackFamilies: PINNED_FONT_FAMILIES.filter((family: string): boolean => family !== selectedFamily),
        substituted: selectedFamily !== requestedFamily,
        source
    };
}

function supplementalTypeface(collection: SlideFrameFontCollection, script: string | undefined): string {
    if (!script) {
        return '';
    }
    const supplementalFonts: ReadonlyArray<{ readonly script: string; readonly typeface: string; }> | undefined =
        collection.supplementalFonts;
    const match: { readonly script: string; readonly typeface: string; } | undefined = supplementalFonts !== undefined ?
        supplementalFonts.find((font: { readonly script: string; readonly typeface: string; }): boolean =>
            font.script === script) : undefined;
    return optionalProperty(match, 'typeface') || '';
}

function pinnedFamily(value: string): string | undefined {
    const normalized: string = value.toLocaleLowerCase('en-US');
    return PINNED_FONT_FAMILIES.find((family: string): boolean =>
        family.toLocaleLowerCase('en-US') === normalized);
}

function parseThemeToken(value: string | undefined): { readonly role: 'major' | 'minor'; readonly script: TextScript } | undefined {
    const match: RegExpMatchArray | null = ((value) !== undefined && (value) !== null ? (value).match(/^\+(mj|mn)-(lt|ea|cs)$/u) : undefined) || null;
    if (!match) {
        return undefined;
    }
    return {
        role: match[1] === 'mj' ? 'major' : 'minor',
        script: match[2] === 'ea' ? 'eastAsian' : match[2] === 'cs' ? 'complexScript' : 'latin'
    };
}

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    return value !== undefined && value !== null ? value[key] : undefined;
}
