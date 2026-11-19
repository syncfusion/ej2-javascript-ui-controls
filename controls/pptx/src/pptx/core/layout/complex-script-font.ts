import { LayoutTextCharacterSnapshot, LayoutThemeSnapshot } from './layout-model';
import { arrayAt, arraySet } from '../util/es5-compat';

/** Script slots used by the guarded AN3 splitter. @private */
export type ComplexLayoutScript = 'latin' | 'complexScript';

/** One UTF-16-addressed font-script run. @private */
export interface ComplexScriptTextPart {
    readonly text: string;
    readonly script: ComplexLayoutScript;
    readonly startOffset: number;
    readonly endOffset: number;
}

/**
 * Ports `TextSplitter.IsComplexScript` and `GetUnicodeRanges`.
 *
 * @param {string} text - Logical text of the run.
 * @returns {boolean} Whether any character is in a complex-script range.
 * @private
 */
export function containsComplexScript(text: string): boolean {
    return Array.from(text).some((character: string): boolean => isComplexCodePoint(character.codePointAt(0) as number));
}

/**
 * Ports the script-splitting role of `Paragraph.SplitTextParts`. Latin
 * letters, digits and punctuation retain the AL2 slot. A space joins a
 * complex run only when both neighbouring characters are complex.
 *
 * @param {string} text - Logical text of the run.
 * @returns {ReadonlyArray<ComplexScriptTextPart>} Script-labelled UTF-16 runs.
 * @private
 */
export function splitComplexScriptText(text: string): ReadonlyArray<ComplexScriptTextPart> {
    if (!containsComplexScript(text)) {
        return [{ text, script: 'latin', startOffset: 0, endOffset: text.length }];
    }
    const characters: string[] = Array.from(text);
    const complex: boolean[] = characters.map((character: string): boolean =>
        isComplexCodePoint(character.codePointAt(0) as number));
    for (let index: number = 1; index + 1 < characters.length; index++) {
        if (arrayAt(characters, index) === ' ' && arrayAt(complex, index - 1) && arrayAt(complex, index + 1)) {
            arraySet(complex, index, true);
        }
    }
    const parts: ComplexScriptTextPart[] = [];
    let value: string = '';
    let script: ComplexLayoutScript = arrayAt(complex, 0) ? 'complexScript' : 'latin';
    let startOffset: number = 0;
    let offset: number = 0;
    characters.forEach((character: string, index: number): void => {
        const current: ComplexLayoutScript = arrayAt(complex, index) ? 'complexScript' : 'latin';
        if (value.length > 0 && current !== script) {
            parts.push({ text: value, script, startOffset, endOffset: offset });
            value = '';
            startOffset = offset;
            script = current;
        }
        value += character;
        offset += character.length;
    });
    if (value.length > 0) {
        parts.push({ text: value, script, startOffset, endOffset: offset });
    }
    return parts;
}

/**
 * Ports `Font.GetDefaultFontName` for a proven complex-script run.
 *
 * @param {LayoutTextCharacterSnapshot} run - Character snapshot of the complex run.
 * @param {string} paragraphFamily - Latin family resolved for the paragraph.
 * @param {LayoutThemeSnapshot} theme - Effective theme snapshot.
 * @param {string} paragraphComplexFamily - Paragraph-level complex-script family.
 * @returns {string} Complex-script family to render with.
 * @private
 */
export function resolveComplexScriptFont(
    run: LayoutTextCharacterSnapshot,
    paragraphFamily: string,
    theme?: LayoutThemeSnapshot,
    paragraphComplexFamily?: string
): string {
    const direct: string | undefined = run.complexScriptFontFamily;
    if (direct) {
        return materializeComplexThemeFont(direct, paragraphFamily, theme);
    }
    if (paragraphComplexFamily) {
        return materializeComplexThemeFont(paragraphComplexFamily, paragraphFamily, theme);
    }
    const fonts: LayoutThemeSnapshot['fonts'] | undefined = theme ? theme.fonts : undefined;
    if (fonts) {
        if (paragraphFamily === fonts.major.latin && fonts.major.complexScript) {
            return fonts.major.complexScript;
        }
        if (paragraphFamily === fonts.minor.latin && fonts.minor.complexScript) {
            return fonts.minor.complexScript;
        }
    }
    return run.fontFamily || paragraphFamily || 'Arial';
}

function materializeComplexThemeFont(
    family: string, fallback: string, theme?: LayoutThemeSnapshot
): string {
    if (family === '+mj-cs') {
        return theme && theme.fonts ? theme.fonts.major.complexScript || fallback : fallback;
    }
    if (family === '+mn-cs') {
        return theme && theme.fonts ? theme.fonts.minor.complexScript || fallback : fallback;
    }
    return family;
}

function isComplexCodePoint(code: number): boolean {
    return inRanges(code, [
        [0x0590, 0x08ff], [0x0900, 0x0fff], [0x1000, 0x109f],
        [0x1200, 0x167f], [0x1780, 0x19ff], [0x1a00, 0x1a1f],
        [0x1c50, 0x1c7f], [0x1cd0, 0x1cff], [0x2d30, 0x2d7f],
        [0xa000, 0xa4cf], [0xa840, 0xa87f], [0xa8e0, 0xa8ff],
        [0xa980, 0xa9df], [0xaa60, 0xaa7f], [0xfb1d, 0xfeff],
        [0x10480, 0x104af], [0x110d0, 0x110ff]
    ]);
}

function inRanges(code: number, ranges: ReadonlyArray<[number, number]>): boolean {
    return ranges.some((range: [number, number]): boolean => code >= range[0] && code <= range[1]);
}
