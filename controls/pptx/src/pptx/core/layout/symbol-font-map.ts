/** A Unicode replacement for a legacy symbol-font bullet. */
export interface SymbolFontBulletReplacement {
    /** Unicode character rendered by the browser and worker. */
    readonly character: string;
    /** Broadly available visual fallback; this is not the source mapping. */
    readonly displayCharacter?: string;
    /** Ordered family stack used for measurement and painting. */
    readonly fontFamily: string;
    /** Ordered open/system fallback faces for measurement and painting. */
    readonly fontCandidates: ReadonlyArray<string>;
}

interface SymbolFontMapEntry {
    readonly typeface: string;
    readonly code: number;
    readonly character: string;
    readonly displayCharacter?: string;
}

const SYMBOL_FONT_FAMILY: string = '"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif';
const SYMBOL_FONT_CANDIDATES: ReadonlyArray<string> = ['Segoe UI Symbol', 'Apple Symbols', 'Noto Sans Symbols 2'];

// Source: Unicode WG2 N4363, Proposal for addition of Wingdings and Webdings
// symbols (2013-05-28). Only mappings evidenced by that table are included.
const SYMBOL_FONT_MAP: ReadonlyArray<SymbolFontMapEntry> = [
    // N4363 IDs 1108, 1110, 1113, 1162, 1167 and 1168.
    { typeface: 'wingdings', code: 0x6c, character: '\u26ab' },
    { typeface: 'wingdings', code: 0x6e, character: '\u25fc' },
    { typeface: 'wingdings', code: 0x71, character: '\u2751' },
    { typeface: 'wingdings', code: 0xa2, character: '\ud83d\udf86' },
    { typeface: 'wingdings', code: 0xa7, character: '\u25aa' },
    { typeface: 'wingdings', code: 0xa8, character: '\ud83d\udf8e' },
    // N4363 ID 1224: Wingdings E0 -> U+1F86A WIDE-HEADED RIGHTWARDS BARB ARROW.
    { typeface: 'wingdings', code: 0xe0, character: '\ud83e\udc6a', displayCharacter: '\u2192' },
    // N4363 IDs 2151, 2161 and 2164.
    { typeface: 'wingdings 2', code: 0x96, character: '\u2022' },
    { typeface: 'wingdings 2', code: 0x97, character: '\u2981' },
    { typeface: 'wingdings 2', code: 0xa0, character: '\u25aa' },
    { typeface: 'wingdings 2', code: 0xa1, character: '\u25fe' },
    { typeface: 'wingdings 2', code: 0xa4, character: '\ud83d\udf91' },
    // N4363 IDs 3117 and 3173.
    { typeface: 'wingdings 3', code: 0x7d, character: '\u25b6' },
    { typeface: 'wingdings 3', code: 0xad, character: '\ud83e\udc9d' }
];

/**
 * Resolves a sourced Unicode equivalent for a legacy symbol-font bullet.
 * Unknown pairs deliberately stay unresolved rather than guessing a glyph.
 * @param {string} typeface - Authored bullet typeface.
 * @param {string} character - Authored bullet character.
 * @returns {SymbolFontBulletReplacement | undefined} Sourced replacement, when known.
 */
export function resolveSymbolFontBullet(
    typeface: string,
    character: string
): SymbolFontBulletReplacement | undefined {
    const characters: string[] = Array.from(character);
    if (characters.length !== 1) {
        return undefined;
    }
    let code: number | undefined = characters[0].codePointAt(0);
    if (code === undefined) {
        return undefined;
    }
    if (code >= 0xf000 && code <= 0xf0ff) {
        code -= 0xf000;
    }
    const normalizedTypeface: string = typeface.trim().toLowerCase();
    const entry: SymbolFontMapEntry | undefined = SYMBOL_FONT_MAP.find(
        (candidate: SymbolFontMapEntry): boolean =>
            candidate.typeface === normalizedTypeface && candidate.code === code);
    return entry ? {
        character: entry.character,
        displayCharacter: entry.displayCharacter,
        fontFamily: SYMBOL_FONT_FAMILY,
        fontCandidates: SYMBOL_FONT_CANDIDATES
    } : undefined;
}
