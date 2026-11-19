import { TextCharacterFills } from '../core/text/character-fills';
import { EffectiveTextCharacterFills, TextFillInheritanceSource, resolveTextCharacterFills } from '../core/resolve/resolve-text-fills';
/** Clone-safe point/percentage spacing authored on one paragraph style tier. */
export interface TextStyleSpacingSnapshot {
    readonly type: 'points' | 'percent';
    readonly value: number;
}

/** Clone-safe tab stop authored on one paragraph style tier. */
export interface TextStyleTabSnapshot {
    readonly positionPt: number;
    readonly alignment?: string;
}

/** Bullet font selection authored on a paragraph tier. */
export type TextBulletFontSnapshot =
    { readonly kind: 'followText' } |
    { readonly kind: 'explicit'; readonly family: string };

/** Bullet size selection authored on a paragraph tier. */
export type TextBulletSizeSnapshot =
    { readonly kind: 'followText' } |
    { readonly kind: 'percent'; readonly value: number } |
    { readonly kind: 'points'; readonly value: number };

/** Bullet colour selection authored on a paragraph tier. */
export type TextBulletColorSnapshot =
    { readonly kind: 'followText' } |
    { readonly kind: 'explicit'; readonly color: import('./rich-text-snapshot').TextColorSnapshot };

interface TextBulletAppearanceSnapshot {
    readonly font?: TextBulletFontSnapshot;
    readonly size?: TextBulletSizeSnapshot;
    readonly color?: TextBulletColorSnapshot;
}

/** Clone-safe direct bullet/numbering choice. */
export type TextBulletSnapshot =
    { readonly kind: 'none' } |
    (TextBulletAppearanceSnapshot & { readonly kind: 'character'; readonly character: string }) |
    (TextBulletAppearanceSnapshot & { readonly kind: 'numbered'; readonly scheme: string; readonly startAt?: number }) |
    (TextBulletAppearanceSnapshot & { readonly kind: 'picture'; readonly relationshipId?: string;
        readonly target?: string; readonly dataUri?: string });

/** Sparse, direct paragraph values from one OOXML inheritance tier. */
export interface DirectTextParagraphStyleSnapshot {
    /** Additive direct defRPr fill carriers; inheritance is a separate stage. */
    readonly characterFills?: import('../core/text/character-fills').TextCharacterFills;
    readonly alignment?: string;
    readonly leftMarginPt?: number;
    readonly indentPt?: number;
    readonly lineSpacing?: TextStyleSpacingSnapshot;
    readonly spaceBefore?: TextStyleSpacingSnapshot;
    readonly spaceAfter?: TextStyleSpacingSnapshot;
    readonly tabs?: ReadonlyArray<TextStyleTabSnapshot>;
    readonly fontFamily?: string;
    readonly eastAsianFontFamily?: string;
    readonly complexScriptFontFamily?: string;
    readonly fontSizePt?: number;
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly caps?: string;
    /** Direct `a:defRPr` text colour; scheme values remain unresolved. */
    readonly color?: import('./rich-text-snapshot').TextColorSnapshot;
    readonly bullet?: TextBulletSnapshot;
    readonly rightToLeft?: boolean;
    readonly eastAsianLineBreak?: boolean;
    readonly latinLineBreak?: boolean;
    readonly hangingPunctuation?: boolean;
}

/** One `lvl1pPr`…`lvl9pPr` style entry; `level` is zero-based. */
export interface TextStyleLevelSnapshot extends DirectTextParagraphStyleSnapshot {
    /** Zero through eight; -1 is a canonical defPPr fill-only fallback. */
    readonly level: number;
}

/** Clone-safe master `p:txStyles` buckets. */
export interface TextMasterStyleSnapshot {
    readonly titleStyle: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly bodyStyle: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly otherStyle: ReadonlyArray<TextStyleLevelSnapshot>;
}

/** Source that supplied one resolved paragraph property. */
export type TextStyleInheritanceSource = 'direct' | 'shapeList' | 'layout' | 'master' |
'txStyles' | 'defaultTextStyle' | 'theme' | 'tableStyle';

/** Per-property provenance for a resolved paragraph style. */
export type TextStylePropertySources = Readonly<Partial<Record<keyof DirectTextParagraphStyleSnapshot,
TextStyleInheritanceSource>>>;

/** View-only paragraph values after first-defined-wins resolution. */
export interface ResolvedTextParagraphStyleSnapshot extends DirectTextParagraphStyleSnapshot {
    /** Independent resolved fill lanes; direct characterFills remain authored data. */
    readonly effectiveCharacterFills?: EffectiveTextCharacterFills;
    readonly sources: TextStylePropertySources;
}

/** Typed input to the non-mutating paragraph-style resolver. */
export interface TextStyleResolutionInput {
    readonly level: number;
    readonly direct: DirectTextParagraphStyleSnapshot;
    /** Selected table-cell defaults, separate from direct body/list formatting. */
    readonly tableStyle?: DirectTextParagraphStyleSnapshot;
    readonly shapeList: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly layoutDirect: DirectTextParagraphStyleSnapshot;
    readonly layoutList: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly masterDirect: DirectTextParagraphStyleSnapshot;
    readonly masterList: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly masterTextStyle: ReadonlyArray<TextStyleLevelSnapshot>;
    readonly presentationDefault: ReadonlyArray<TextStyleLevelSnapshot>;
    /** Canonical fontRef glyph fallback retaining ordered transforms. */
    readonly fontReferenceFills?: TextCharacterFills;
    readonly themeFontFamily?: string;
    readonly themeEastAsianFontFamily?: string;
    readonly themeComplexScriptFontFamily?: string;
}

/**
 * Selects the master `p:txStyles` bucket for a placeholder type.
 *
 * @remarks Mirrors the library's semantic resolver: title/ctrTitle use
 * `titleStyle`, content placeholders use `bodyStyle`, and residual types use
 * `otherStyle`. The returned array is clone-safe direct data, not a resolved
 * or mutable OOXML element.
 *
 * @param {TextMasterStyleSnapshot} styles - Clone-safe master text-style buckets.
 * @param {string | undefined} placeholderType - OOXML placeholder type, when authored.
 * @returns {ReadonlyArray<TextStyleLevelSnapshot>} The matching sparse title,
 * body, or other style levels.
 */
export function selectTextMasterStyleBucket(
    styles: TextMasterStyleSnapshot,
    placeholderType: string | undefined
): ReadonlyArray<TextStyleLevelSnapshot> {
    switch (placeholderType) {
    case 'title':
    case 'ctrTitle':
        return styles.titleStyle;
    case 'body':
    case 'obj':
    case 'subTitle':
    case 'chart':
    case 'tbl':
    case 'clipArt':
    case 'dgm':
    case 'media':
    case 'sldImg':
    case 'pic':
        return styles.bodyStyle;
    default:
        return styles.otherStyle;
    }
}

/**
 * Resolves one paragraph style without mutating any direct snapshot.
 *
 * @remarks First-defined-wins order is direct paragraph → shape list style →
 * layout placeholder → master placeholder → master `txStyles` → presentation
 * `defaultTextStyle` → theme family. Every property retains independent
 * provenance so direct and resolved values cannot be confused.
 *
 * @param {TextStyleResolutionInput} input - Direct and inherited tiers for one paragraph level.
 * @returns {ResolvedTextParagraphStyleSnapshot} A new resolved snapshot with
 * per-property provenance.
 */
export function resolveTextParagraphStyleSnapshot(
    input: TextStyleResolutionInput
): ResolvedTextParagraphStyleSnapshot {
    const result: MutableResolvedTextParagraphStyle = { sources: {},
        effectiveCharacterFills: resolveTextCharacterStyleSnapshot(undefined, input) };
    take(result, input.direct, 'direct');
    take(result, level(input.shapeList, input.level), 'shapeList');
    take(result, input.tableStyle, 'tableStyle');
    take(result, input.layoutDirect, 'layout');
    take(result, level(input.layoutList, input.level), 'layout');
    take(result, input.masterDirect, 'master');
    take(result, level(input.masterList, input.level), 'master');
    take(result, level(input.masterTextStyle, input.level), 'txStyles');
    take(result, level(input.presentationDefault, input.level), 'defaultTextStyle');
    if (result.fontFamily === undefined && input.themeFontFamily !== undefined) {
        result.fontFamily = input.themeFontFamily;
        result.sources.fontFamily = 'theme';
    }
    if (result.eastAsianFontFamily === undefined && input.themeEastAsianFontFamily !== undefined) {
        result.eastAsianFontFamily = input.themeEastAsianFontFamily;
        result.sources.eastAsianFontFamily = 'theme';
    }
    if (result.complexScriptFontFamily === undefined && input.themeComplexScriptFontFamily !== undefined) {
        result.complexScriptFontFamily = input.themeComplexScriptFontFamily;
        result.sources.complexScriptFontFamily = 'theme';
    }
    return result;
}

interface MutableResolvedTextParagraphStyle {
    effectiveCharacterFills?: EffectiveTextCharacterFills;
    alignment?: string;
    leftMarginPt?: number;
    indentPt?: number;
    lineSpacing?: TextStyleSpacingSnapshot;
    spaceBefore?: TextStyleSpacingSnapshot;
    spaceAfter?: TextStyleSpacingSnapshot;
    tabs?: ReadonlyArray<TextStyleTabSnapshot>;
    fontFamily?: string;
    eastAsianFontFamily?: string;
    complexScriptFontFamily?: string;
    fontSizePt?: number;
    bold?: boolean;
    italic?: boolean;
    caps?: string;
    color?: import('./rich-text-snapshot').TextColorSnapshot;
    bullet?: TextBulletSnapshot;
    rightToLeft?: boolean;
    eastAsianLineBreak?: boolean;
    latinLineBreak?: boolean;
    hangingPunctuation?: boolean;
    sources: Partial<Record<keyof DirectTextParagraphStyleSnapshot, TextStyleInheritanceSource>>;
}

/**
 * Copies legacy paragraph properties independently.
 *
 * @param {MutableResolvedTextParagraphStyle} target - Effective output accumulator.
 * @param {DirectTextParagraphStyleSnapshot | undefined} source - Optional direct source.
 * @param {TextStyleInheritanceSource} provenance - Source tier.
 * @returns {void} Updates only absent output properties.
 */
function take(
    target: MutableResolvedTextParagraphStyle,
    source: DirectTextParagraphStyleSnapshot | undefined,
    provenance: TextStyleInheritanceSource
): void {
    if (source === undefined) {
        return;
    }
    if (target.alignment === undefined && source.alignment !== undefined) {
        target.alignment = source.alignment; target.sources.alignment = provenance;
    }
    if (target.leftMarginPt === undefined && source.leftMarginPt !== undefined) {
        target.leftMarginPt = source.leftMarginPt; target.sources.leftMarginPt = provenance;
    }
    if (target.indentPt === undefined && source.indentPt !== undefined) {
        target.indentPt = source.indentPt; target.sources.indentPt = provenance;
    }
    if (target.lineSpacing === undefined && source.lineSpacing !== undefined) {
        target.lineSpacing = source.lineSpacing; target.sources.lineSpacing = provenance;
    }
    if (target.spaceBefore === undefined && source.spaceBefore !== undefined) {
        target.spaceBefore = source.spaceBefore; target.sources.spaceBefore = provenance;
    }
    if (target.spaceAfter === undefined && source.spaceAfter !== undefined) {
        target.spaceAfter = source.spaceAfter; target.sources.spaceAfter = provenance;
    }
    if (target.tabs === undefined && source.tabs !== undefined) {
        target.tabs = source.tabs; target.sources.tabs = provenance;
    }
    if (target.fontFamily === undefined && source.fontFamily !== undefined) {
        target.fontFamily = source.fontFamily; target.sources.fontFamily = provenance;
    }
    if (target.eastAsianFontFamily === undefined && source.eastAsianFontFamily !== undefined) {
        target.eastAsianFontFamily = source.eastAsianFontFamily; target.sources.eastAsianFontFamily = provenance;
    }
    if (target.complexScriptFontFamily === undefined && source.complexScriptFontFamily !== undefined) {
        target.complexScriptFontFamily = source.complexScriptFontFamily; target.sources.complexScriptFontFamily = provenance;
    }
    if (target.fontSizePt === undefined && source.fontSizePt !== undefined) {
        target.fontSizePt = source.fontSizePt; target.sources.fontSizePt = provenance;
    }
    if (target.bold === undefined && source.bold !== undefined) {
        target.bold = source.bold; target.sources.bold = provenance;
    }
    if (target.italic === undefined && source.italic !== undefined) {
        target.italic = source.italic; target.sources.italic = provenance;
    }
    if (target.caps === undefined && source.caps !== undefined) {
        target.caps = source.caps; target.sources.caps = provenance;
    }
    if (target.color === undefined && source.color !== undefined) {
        target.color = source.color; target.sources.color = provenance;
    }
    if (target.bullet === undefined && source.bullet !== undefined) {
        target.bullet = source.bullet; target.sources.bullet = provenance;
    }
    if (target.rightToLeft === undefined && source.rightToLeft !== undefined) {
        target.rightToLeft = source.rightToLeft; target.sources.rightToLeft = provenance;
    }
    if (target.eastAsianLineBreak === undefined && source.eastAsianLineBreak !== undefined) {
        target.eastAsianLineBreak = source.eastAsianLineBreak; target.sources.eastAsianLineBreak = provenance;
    }
    if (target.latinLineBreak === undefined && source.latinLineBreak !== undefined) {
        target.latinLineBreak = source.latinLineBreak; target.sources.latinLineBreak = provenance;
    }
    if (target.hangingPunctuation === undefined && source.hangingPunctuation !== undefined) {
        target.hangingPunctuation = source.hangingPunctuation; target.sources.hangingPunctuation = provenance;
    }
}

/**
 * Selects one exact paragraph level.
 *
 * @param {ReadonlyArray<TextStyleLevelSnapshot>} values - Sparse direct levels.
 * @param {number} target - Requested level.
 * @returns {TextStyleLevelSnapshot | undefined} Matching level only.
 */
function level(
    values: ReadonlyArray<TextStyleLevelSnapshot>,
    target: number
): TextStyleLevelSnapshot | undefined {
    return values.find((value: TextStyleLevelSnapshot): boolean => value.level === target);
}

/**
 * Resolves a separately supplied run, field or end snapshot over paragraph tiers.
 * Callers select the character target explicitly; end snapshots are never silently
 * applied to visible runs. Existing color/highlight projections are unchanged.
 *
 * @param {TextCharacterFills | undefined} character - Direct selected target only.
 * @param {TextStyleResolutionInput} input - Existing applicable paragraph tiers.
 * @param {object} inherited - Optional independently selected matching layout/master character targets.
 * @param {string} inherited.kind - Explicit target kind for provenance labels.
 * @param {TextCharacterFills} inherited.layout - Matched layout target, excluding paragraph defaults.
 * @param {TextCharacterFills} inherited.master - Matched master target, excluding paragraph defaults.
 * @returns {EffectiveTextCharacterFills} Per-carrier view with detailed provenance.
 */
export function resolveTextCharacterStyleSnapshot(character: TextCharacterFills | undefined,
                                                  input: TextStyleResolutionInput,
                                                  inherited?: { readonly kind?: 'run' | 'field' | 'end' | 'break';
                                                      readonly layout?: TextCharacterFills;
                                                      readonly master?: TextCharacterFills; }): EffectiveTextCharacterFills {
    const suffix: string = inherited && inherited.kind ? inherited.kind : 'character';
    const sources: TextFillInheritanceSource[] = [{ id: suffix === 'character' ? suffix : 'direct/' + suffix, fills: character },
        { id: 'direct/paragraph', fills: input.direct.characterFills },
        { id: 'direct/list', fills: fillsAt(input.shapeList, input.level) },
        { id: 'direct/list/default', fills: fillsAt(input.shapeList, -1) },
        { id: 'table-style', fills: input.tableStyle === undefined ? undefined : input.tableStyle.characterFills },
        { id: 'layout/' + suffix, fills: inherited === undefined ? undefined : inherited.layout },
        { id: 'layout/paragraph', fills: input.layoutDirect.characterFills },
        { id: 'layout/list', fills: fillsAt(input.layoutList, input.level) },
        { id: 'layout/list/default', fills: fillsAt(input.layoutList, -1) },
        { id: 'master/' + suffix, fills: inherited === undefined ? undefined : inherited.master },
        { id: 'master/paragraph', fills: input.masterDirect.characterFills },
        { id: 'master/list', fills: fillsAt(input.masterList, input.level) },
        { id: 'master/list/default', fills: fillsAt(input.masterList, -1) },
        { id: 'txStyles', fills: fillsAt(input.masterTextStyle, input.level) },
        { id: 'txStyles/default', fills: fillsAt(input.masterTextStyle, -1) },
        { id: 'defaultTextStyle', fills: fillsAt(input.presentationDefault, input.level) },
        { id: 'defaultTextStyle/default', fills: fillsAt(input.presentationDefault, -1) },
        { id: 'fontRef', fills: input.fontReferenceFills }];
    return resolveTextCharacterFills(sources);
}
/**
 * @param {ReadonlyArray<TextStyleLevelSnapshot>} values - Existing level records.
 * @param {number} target - Owning paragraph level.
 * @returns {TextCharacterFills | undefined} Sparse authored carriers at that level.
 */
function fillsAt(values: ReadonlyArray<TextStyleLevelSnapshot>, target: number): TextCharacterFills | undefined {
    const selected: TextStyleLevelSnapshot | undefined = level(values, target);
    return selected === undefined ? undefined : selected.characterFills;
}
