import { Paragraph } from '../document/paragraph';
import { TextRange } from '../document/text-range';

import { effectiveBold, effectiveItalic, EMPTY_MODELED_RUN_PROPERTIES, mergeModeledRunProperties, parseDirectRunFontProperties, ModeledRunProperties } from './run-properties';
import { ThemeFontSlot, ThemePart } from './theme';
import { CharacterFormat, CharacterFormatSnapshot } from '../document/character-format';
import { halfPointsToPoint } from '../document/length';
/**
 * Effective run formatting after document defaults, paragraph style, character
 * style inheritance, and direct run properties.
 *
 * @private
 */
export type ResolvedRunFormatting = {
    readonly bold: boolean;
    readonly italic: boolean;
    readonly fontSize: number | undefined;
    readonly asciiFont: string | undefined;
    readonly hAnsiFont: string | undefined;
};
/** @public Style data required to resolve run formatting. */
export interface StyleFormatAccess {
    docDefaultsRunProperties(): ModeledRunProperties;
    styleRunProperties(styleId: string): ModeledRunProperties | undefined;
    styleBasedOn(styleId: string): string | undefined;
}
function directRunProperties(run: TextRange): ModeledRunProperties {
    const cf: CharacterFormat = run.characterFormat;
    // Only the run's own (direct) values may override the cascade. The public getters fall back to
    // defaults, which would otherwise mask docDefaults and style values.
    const direct: CharacterFormatSnapshot = cf.snapshot();
    return {
        ...EMPTY_MODELED_RUN_PROPERTIES,
        bold: cf.bold,
        italic: cf.italic,
        fontSize: direct.fontSizeValue === undefined ? undefined : halfPointsToPoint(direct.fontSizeValue as number),
        kerning: direct.kerningValue === undefined ? undefined : cf.kerning,
        ...parseDirectRunFontProperties(run)
    };
}
function characterStyleChainProperties(styleId: string | undefined, styles: StyleFormatAccess): ModeledRunProperties {
    if (styleId === undefined) {
        return EMPTY_MODELED_RUN_PROPERTIES;
    }
    const chain: string[] = [];
    const seen: Set<string> = new Set<string>();
    let current: string | undefined = styleId;
    while (current !== undefined && current.length > 0 && !seen.has(current)) {
        seen.add(current);
        chain.push(current);
        current = styles.styleBasedOn(current);
    }
    let merged: ModeledRunProperties = EMPTY_MODELED_RUN_PROPERTIES;
    for (let index: number = chain.length - 1; index >= 0; index -= 1) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const id: string = chain[index];
        if (id === undefined) {
            continue;
        }
        const layer: ModeledRunProperties = styles.styleRunProperties(id);
        if (layer !== undefined) {
            merged = mergeModeledRunProperties(merged, layer);
        }
    }
    return merged;
}
function resolveEffectiveFont(
    explicit: string | undefined,
    themeSlot: ThemeFontSlot | undefined,
    theme: ThemePart | undefined
): string | undefined {
    if (themeSlot !== undefined) {
        if (theme === undefined) {
            return undefined;
        }
        return theme.typefaceFor(themeSlot);
    }
    return explicit;
}
/**
 * @param {StyleFormatAccess} styles - The styles.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {TextRange} run - The run.
 * @param {ThemePart | undefined} theme - The theme.
 * @returns {ResolvedRunFormatting} The result.
 * @private
 */
export function resolveRunFormattingWithStyles(
    styles: StyleFormatAccess,
    paragraph: Paragraph,
    run: TextRange,
    theme: ThemePart | undefined
): ResolvedRunFormatting {
    let merged: ModeledRunProperties = styles.docDefaultsRunProperties();
    const paragraphStyleId: string = paragraph.styleId;
    if (paragraphStyleId !== undefined) {
        const paragraphStyle: ModeledRunProperties = styles.styleRunProperties(paragraphStyleId);
        if (paragraphStyle !== undefined) {
            merged = mergeModeledRunProperties(merged, paragraphStyle);
        }
    }
    merged = mergeModeledRunProperties(merged, characterStyleChainProperties(run.characterFormat.characterStyle, styles));
    merged = mergeModeledRunProperties(merged, directRunProperties(run));
    return {
        bold: effectiveBold(merged),
        italic: effectiveItalic(merged),
        fontSize: merged.fontSize,
        asciiFont: resolveEffectiveFont(merged.asciiFont, merged.asciiTheme, theme),
        hAnsiFont: resolveEffectiveFont(merged.hAnsiFont, merged.hAnsiTheme, theme)
    };
}
