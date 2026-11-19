/** Comparison record for the AN4 source-versus-AL2 audit. @private */
export interface UnicodeSplitComparison {
    readonly input: string;
    readonly source: ReadonlyArray<string>;
    readonly al2: ReadonlyArray<string>;
    readonly differs: boolean;
}

/**
 * Exact behavioral port of `Paragraph.SplitTextByUnicode` at the inspected
 * development-source line 5344. The method uses .NET `char[]`, so a required
 * split is deliberately in UTF-16 code units, including surrogate halves.
 * This audit helper is not wired into layout while the AN invariant freezes
 * ordinary and East Asian AL2 output.
 * @private
 */
/**
 * Exact behavioral port of `Paragraph.SplitTextByUnicode` at the inspected
 * development-source line 5344. The method uses .NET `char[]`, so a required
 * split is deliberately in UTF-16 code units, including surrogate halves.
 * This audit helper is not wired into layout while the AN invariant freezes
 * ordinary and East Asian AL2 output.
 *
 * @param {string} text - Logical-order line text.
 * @returns {ReadonlyArray<string>} Source-rule split parts.
 * @private
 */
export function splitTextByUnicodeSource(text: string): ReadonlyArray<string> {
    let hasChinese: boolean = false;
    let hasSymbol: boolean = false;
    let hasText: boolean = false;
    let hasTab: boolean = false;
    let hasNewLine: boolean = false;
    text.split('').forEach((character: string): void => {
        const code: number = character.charCodeAt(0);
        if ((code >= 0x3000 && code <= 0x30ff) || (code >= 0xff00 && code <= 0xffef) ||
            (code >= 0x4e00 && code <= 0x9faf) || (code >= 0x3400 && code <= 0x4dbf)) {
            hasChinese = true;
        } else if ((code >= 0x25f0 && code <= 0x25ff) || (code >= 0xac00 && code <= 0xffef)) {
            hasSymbol = true;
        } else if (code === 0x0009) {
            hasTab = true;
        } else if (code === 0x000a) {
            hasNewLine = true;
        } else {
            hasText = true;
        }
    });
    const split: boolean = (hasChinese && hasSymbol) || (hasChinese && hasText) ||
        (hasSymbol && hasText) || hasTab || hasNewLine;
    return split ? text.split('') : [text];
}

/**
 * Records the existing AL2 whitespace tokenization beside the source rule.
 *
 * @param {string} text - Logical-order line text.
 * @returns {UnicodeSplitComparison} Source and AL2 splits with a differs flag.
 * @private
 */
export function compareAl2AndSourceUnicodeSplit(text: string): UnicodeSplitComparison {
    const source: ReadonlyArray<string> = splitTextByUnicodeSource(text);
    const al2: ReadonlyArray<string> = text.split(/(\t| +)/u).filter((part: string): boolean => part.length > 0);
    return { input: text, source, al2, differs: source.join('\u0000') !== al2.join('\u0000') };
}
