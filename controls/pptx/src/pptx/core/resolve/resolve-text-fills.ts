/** Pure character fill inheritance; MS-OI29500 2.1.1284 and 2.1.1298. */
import { TextLineStyleSnapshot } from '../text/text-line-style';
import { TextCharacterFills, TextFillSnapshot } from '../text/character-fills';
import { EffectiveGradientFill, GradientInheritanceSource } from './gradient-resolution-types';
import { resolveGradientFill } from './resolve-gradient';
import { arrayAt, objectSet } from '../util/es5-compat';
/** Applicable host tier, highest priority first. @public */
export interface TextFillInheritanceSource {
    readonly id: string;
    readonly fills: TextCharacterFills | undefined;
}
/** Selected fill and its carrier provenance; gradient fields carry finer provenance. @public */
export interface EffectiveTextFill {
    readonly fill: Exclude<TextFillSnapshot, { readonly kind: 'gradient'; }> | EffectiveGradientFill;
    readonly source?: string;
}
/** Independent decoration choice; follow-text references resolved glyph formatting. @public */
export interface EffectiveTextDecorationFill {
    readonly kind: 'missing' | 'line' | 'fill' | 'follow-text';
    readonly source?: string;
    readonly fill: EffectiveTextFill;
    /** Independently inherited source line geometry; no rendering defaults. */
    readonly lineStyle?: TextLineStyleSnapshot;
    /** Tier identity for each selected line-style field. */
    readonly lineStyleSources?: Readonly<Record<string, string>>;
}
/** Effective character fills, distinct from authored Font.characterFills. @public */
export interface EffectiveTextCharacterFills {
    readonly glyphFill: EffectiveTextFill;
    readonly outline: EffectiveTextDecorationFill;
    readonly underlineFill: EffectiveTextDecorationFill;
    readonly underlineLine: EffectiveTextDecorationFill;
}
/**
 * Resolves each carrier independently. Text grpFill becomes none only in this
 * view. Same-type gradient contributors use the shared sparse resolver; lists
 * and rectangles remain atomic. No color is replaced with resolved RGB.
 *
 * @param {ReadonlyArray<TextFillInheritanceSource>} sources - Applicable ordered tiers.
 * @returns {EffectiveTextCharacterFills} View-only fills and provenance.
 */
export function resolveTextCharacterFills(sources: ReadonlyArray<TextFillInheritanceSource>): EffectiveTextCharacterFills {
    const glyphs: { id: string; fill: TextFillSnapshot; }[] = [];
    for (let i: number = 0; i < sources.length; i++) {
        const source: TextFillInheritanceSource = arrayAt(sources, i);
        if (source.fills !== undefined) { glyphs.push({ id: source.id, fill: source.fills.glyphFill }); }
    }
    const glyphFill: EffectiveTextFill = resolveFill(glyphs);
    const outline: EffectiveTextDecorationFill = decoration(sources, 'outline', glyphFill);
    return { glyphFill, outline,
        underlineFill: decoration(sources, 'underlineFill', glyphFill),
        underlineLine: decoration(sources, 'underlineLine', glyphFill, outline) };
}
/**
 * @param {ReadonlyArray<TextFillInheritanceSource>} sources - Applicable tiers.
 * @param {string} key - Independent decoration lane.
 * @param {EffectiveTextFill} glyph - Follow-text target.
 * @param {EffectiveTextDecorationFill} outline - Resolved text stroke for uLnTx.
 * @returns {EffectiveTextDecorationFill} Selected carrier and compatible fill contributors.
 */
function decoration(sources: ReadonlyArray<TextFillInheritanceSource>,
                    key: 'outline' | 'underlineFill' | 'underlineLine', glyph: EffectiveTextFill, outline?: EffectiveTextDecorationFill): EffectiveTextDecorationFill {
    let selected: 'line' | 'fill' | undefined;
    let sourceId: string | undefined;
    const fills: { id: string; fill: TextFillSnapshot; }[] = [];
    for (let i: number = 0; i < sources.length; i++) {
        const source: TextFillInheritanceSource = arrayAt(sources, i);
        if (source.fills === undefined) { continue; }
        const carrier: TextCharacterFills[typeof key] = key === 'outline' ? source.fills.outline :
            key === 'underlineFill' ? source.fills.underlineFill : source.fills.underlineLine;
        if (carrier.kind === 'missing') { continue; }
        if (selected === undefined) {
            if (carrier.kind === 'follow-text') {
                return { kind: 'follow-text', source: source.id, fill: outline ? outline.fill : glyph,
                    ...(outline && outline.lineStyle ? { lineStyle: outline.lineStyle, lineStyleSources: outline.lineStyleSources } : {}) };
            }
            selected = carrier.kind; sourceId = source.id;
        }
        if (carrier.kind === selected && (carrier.kind === 'line' || carrier.kind === 'fill')) {
            fills.push({ id: source.id, fill: carrier.fill });
        }
    }
    return { kind: selected === undefined ? 'missing' : selected,
        ...(sourceId === undefined ? {} : { source: sourceId }), fill: resolveFill(fills),
        ...(selected === 'line' ? resolveLineStyles(sources, key) : {}) };
}
/**
 * @param {ReadonlyArray<GradientInheritanceSource>} sources - Direct fill contributors.
 * @returns {EffectiveTextFill} First selected choice and sparse gradient view when applicable.
 */
function resolveFill(sources: ReadonlyArray<{ readonly id: string; readonly fill: TextFillSnapshot; }>): EffectiveTextFill {
    for (let i: number = 0; i < sources.length; i++) {
        const source: { readonly id: string; readonly fill: TextFillSnapshot; } = arrayAt(sources, i);
        if (source.fill.kind === 'missing') { continue; }
        if (source.fill.kind === 'gradient') {
            const gradient: EffectiveGradientFill | undefined = resolveGradientFill(sources);
            if (gradient !== undefined) { return { fill: gradient, source: source.id }; }
        } else { return { fill: source.fill.kind === 'group' ? { kind: 'none' } : source.fill, source: source.id }; }
    }
    return { fill: { kind: 'missing' } };
}

/** @param {ReadonlyArray<TextFillInheritanceSource>} sources - Highest-priority tiers first.
 * @param {string} key - Independent line lane.
 * @returns {Object} Attribute-level inherited lexicals and their source tier, without defaults. */
function resolveLineStyles(sources: ReadonlyArray<TextFillInheritanceSource>, key: 'outline' | 'underlineFill' | 'underlineLine'):
{ readonly lineStyle?: TextLineStyleSnapshot; readonly lineStyleSources?: Readonly<Record<string, string>> } {
    let style: TextLineStyleSnapshot = {}; const provenance: Record<string, string> = {};
    for (let i: number = sources.length - 1; i >= 0; i--) {
        const source: TextFillInheritanceSource = arrayAt(sources, i);
        const carrier: TextCharacterFills[typeof key] | undefined = source.fills && (key === 'outline' ? source.fills.outline :
            key === 'underlineFill' ? source.fills.underlineFill : source.fills.underlineLine);
        if (!carrier || carrier.kind !== 'line' || !carrier.lineStyle) { continue; }
        style = { ...style, ...carrier.lineStyle };
        for (const field of Object.keys(carrier.lineStyle)) { objectSet(provenance, field, source.id); }
    }
    return Object.keys(style).length ? { lineStyle: style, lineStyleSources: provenance } : {};
}
