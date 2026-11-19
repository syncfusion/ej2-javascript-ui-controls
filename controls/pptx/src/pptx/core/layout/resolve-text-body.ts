import { TextCharacterFills } from '../text/character-fills';
import { EffectiveTextCharacterFills } from '../resolve/resolve-text-fills';
import { resolveTextParagraphStyleSnapshot, resolveTextCharacterStyleSnapshot, selectTextMasterStyleBucket } from '../../worker/text-style-inheritance';
import {
    TextStyleResolutionInput,
    DirectTextParagraphStyleSnapshot,
    ResolvedTextParagraphStyleSnapshot,
    TextMasterStyleSnapshot,
    TextStyleLevelSnapshot,
    TextStylePropertySources
} from '../../worker/text-style-inheritance';
import {
    LayoutFontCollection, LayoutPresentationInfo, LayoutShapeLevels, LayoutShapeSnapshot, LayoutTextBodyPropertiesSnapshot,
    LayoutTextColorSnapshot, LayoutTextContentSnapshot, LayoutTextParagraphSnapshot, LayoutTextRunSnapshot,
    LayoutThemeSnapshot
} from './layout-model';
import { arrayAt, objectGet } from '../util/es5-compat';

type PresentationFrameInfo = LayoutPresentationInfo;
type SlideShapeLevels = LayoutShapeLevels;
type SlideShapeSnapshot = LayoutShapeSnapshot;
type TextBodyPropertiesSnapshot = LayoutTextBodyPropertiesSnapshot;
type TextParagraphSnapshot = LayoutTextParagraphSnapshot;
type TextColorSnapshot = LayoutTextColorSnapshot;
type TextContentSnapshot = LayoutTextContentSnapshot;
type TextRunSnapshot = LayoutTextRunSnapshot;

export interface ResolvedTextBodyProperties {
    readonly presetTextWarp?: string;
    readonly leftInsetPt: number;
    readonly topInsetPt: number;
    readonly rightInsetPt: number;
    readonly bottomInsetPt: number;
    readonly anchor: string;
    readonly wrap: string;
    readonly columnCount: number;
    readonly columnSpacingPt: number;
    readonly verticalType: string;
    readonly autoFit: NonNullable<TextBodyPropertiesSnapshot['autoFit']>;
}

export interface ResolvedTextParagraph extends TextParagraphSnapshot {
    readonly alignment: string;
    readonly leftMarginPt: number;
    readonly indentPt: number;
    readonly defaultFontFamily: string;
    readonly defaultEastAsianFontFamily?: string;
    readonly defaultComplexScriptFontFamily?: string;
    readonly defaultFontSizePt: number;
    readonly defaultBold: boolean;
    readonly defaultItalic: boolean;
    readonly defaultCaps?: string;
    readonly rightToLeft: boolean;
    /** Per-property origin retained separately from the direct paragraph snapshot. */
    readonly styleSources: TextStylePropertySources;
}

export interface ResolvedTextBody {
    readonly properties: ResolvedTextBodyProperties;
    readonly paragraphs: ReadonlyArray<ResolvedTextParagraph>;
    readonly sources: ReadonlyArray<'shape' | 'shape-list' | 'layout' | 'master' |
    'master-text-style' | 'presentation-default' | 'theme' | 'table-style'>;
}

const NO_AUTO_FIT: ResolvedTextBodyProperties['autoFit'] = { type: 'none' };
const BODY_DEFAULTS: ResolvedTextBodyProperties = Object.freeze({
    leftInsetPt: 7.2,
    topInsetPt: 3.6,
    rightInsetPt: 7.2,
    bottomInsetPt: 3.6,
    anchor: 't',
    wrap: 'square',
    columnCount: 1,
    columnSpacingPt: 0,
    verticalType: 'horz',
    autoFit: NO_AUTO_FIT
});

/**
 * ports `TextBody` placeholder/body-property resolution order.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {SlideShapeLevels} levels - levels
 * @param {Object} theme - theme
 * @param {DirectTextParagraphStyleSnapshot} tableStyle - Separately selected table-cell defaults.
 * @returns {ResolvedTextBody|undefined} result
 */
export function resolveTextBody(
    shape: SlideShapeSnapshot,
    levels: SlideShapeLevels,
    theme: PresentationFrameInfo['theme'],
    tableStyle?: DirectTextParagraphStyleSnapshot
): ResolvedTextBody | undefined {
    if (!shape.textBody) {
        return undefined;
    }
    const layout: SlideShapeSnapshot | undefined = matchingPlaceholder(shape, levels.layout, false);
    const master: SlideShapeSnapshot | undefined = matchingPlaceholder(shape, levels.master, true);
    const properties: ResolvedTextBodyProperties = mergeProperties(
        optionalProperty(optionalProperty(master, 'textBody'), 'properties'), optionalProperty(optionalProperty(layout, 'textBody'), 'properties'), shape.textBody.properties);
    const themeFonts: LayoutFontCollection = themeFontsForPlaceholder(optionalProperty(shape.placeholder, 'type'), theme);
    const themeFamily: string = themeFonts.latin;
    const masterTextStyles: TextMasterStyleSnapshot = levels.masterTextStyles || EMPTY_MASTER_TEXT_STYLES;
    // ports `Font.GetDefaultSize`: master txStyles belongs to placeholder
    // resolution; ordinary shapes fall through to presentation defaultTextStyle.
    let masterTextStyle: ReadonlyArray<TextStyleLevelSnapshot> = shape.placeholder
        ? selectTextMasterStyleBucket(masterTextStyles, shape.placeholder.type || 'obj') : [];
    // A cell's explicit table context uses master other-style defaults without
    // fabricating a placeholder or changing the authored cell body.
    if (!shape.placeholder && tableStyle !== undefined) { masterTextStyle = masterTextStyles.otherStyle; }
    const paragraphCount: number = shape.textBody.paragraphs.length;
    const paragraphs: ResolvedTextParagraph[] = [];
    for (let index: number = 0; index < paragraphCount; index++) {
        const direct: TextParagraphSnapshot = arrayAt(shape.textBody.paragraphs, index) as TextParagraphSnapshot;
        const layoutParagraph: TextParagraphSnapshot | undefined = optionalProperty(
            optionalProperty(optionalProperty(layout, 'textBody'), 'paragraphs'), index);
        const masterParagraph: TextParagraphSnapshot | undefined = optionalProperty(
            optionalProperty(optionalProperty(master, 'textBody'), 'paragraphs'), index);
        paragraphs.push(resolveParagraph(
            master, masterParagraph, layout, layoutParagraph, direct,
            shape.textBody.listStyle || [], masterTextStyle,
            levels.presentationDefaultTextStyle || [], themeFamily, theme,
            optionalProperty(optionalProperty(shape.styleRefs, 'fontRef'), 'color') ? {
                value: shape.styleRefs.fontRef.color,
                transforms: []
            } : undefined, shape.fontReferenceFills, tableStyle));
    }
    const sources: Array<'shape' | 'shape-list' | 'layout' | 'master' |
    'master-text-style' | 'presentation-default' | 'theme' | 'table-style'> = ['shape', 'shape-list'];
    if (tableStyle !== undefined) { sources.push('table-style'); }
    if (optionalProperty(layout, 'textBody')) {
        sources.push('layout');
    }
    if (optionalProperty(master, 'textBody')) {
        sources.push('master');
    }
    sources.push('master-text-style', 'presentation-default', 'theme');
    return { properties, paragraphs, sources };
}

/**
 * Resolves the text-frame transform through the same placeholder chain.
 * @param {SlideShapeSnapshot} shape - shape
 * @param {SlideShapeLevels} levels - levels
 * @returns {Object} result
 */
export function resolveTextTransform(
    shape: SlideShapeSnapshot,
    levels: SlideShapeLevels
): SlideShapeSnapshot['transform'] {
    if (shape.transform) {
        return shape.transform;
    }
    return optionalProperty(matchingPlaceholder(shape, levels.layout, false), 'transform') ||
    optionalProperty(matchingPlaceholder(shape, levels.master, true), 'transform');
}

function resolveParagraph(
    masterShape: SlideShapeSnapshot | undefined,
    master: TextParagraphSnapshot | undefined,
    layoutShape: SlideShapeSnapshot | undefined,
    layout: TextParagraphSnapshot | undefined,
    direct: TextParagraphSnapshot,
    shapeList: ReadonlyArray<TextStyleLevelSnapshot>,
    masterTextStyle: ReadonlyArray<TextStyleLevelSnapshot>,
    presentationDefault: ReadonlyArray<TextStyleLevelSnapshot>,
    themeFamily: string,
    theme: PresentationFrameInfo['theme'],
    shapeStyleColor: TextColorSnapshot | undefined,
    fontReferenceFills: TextCharacterFills | undefined,
    tableStyle: DirectTextParagraphStyleSnapshot | undefined
): ResolvedTextParagraph {
    const hyperlinkColor: TextColorSnapshot = { value: { kind: 'scheme', val: 'hlink' }, transforms: [] };
    const level: number = nullishValue(direct.level, () => 0);
    const styleInput: TextStyleResolutionInput = {
        level,
        direct: paragraphStyle(direct),
        shapeList,
        tableStyle,
        layoutDirect: paragraphStyle(layout),
        layoutList: optionalProperty(optionalProperty(layoutShape, 'textBody'), 'listStyle') || [],
        masterDirect: paragraphStyle(master),
        masterList: optionalProperty(optionalProperty(masterShape, 'textBody'), 'listStyle') || [],
        masterTextStyle,
        presentationDefault,
        fontReferenceFills,
        themeFontFamily: themeFamily,
        themeEastAsianFontFamily: themeFontsForFamily(theme, themeFamily, 'eastAsian'),
        themeComplexScriptFontFamily: themeFontsForFamily(theme, themeFamily, 'complexScript')
    };
    const resolved: ResolvedTextParagraphStyleSnapshot = resolveTextParagraphStyleSnapshot(styleInput);
    const layoutContent: ReadonlyArray<TextContentSnapshot> = layout && layout.content ? layout.content : [];
    const masterContent: ReadonlyArray<TextContentSnapshot> = master && master.content ? master.content : [];
    const layoutRuns: ReadonlyArray<TextContentSnapshot> = layoutContent.filter(isRun);
    const masterRuns: ReadonlyArray<TextContentSnapshot> = masterContent.filter(isRun);
    const layoutFields: ReadonlyArray<TextContentSnapshot> = layoutContent.filter(isField);
    const masterFields: ReadonlyArray<TextContentSnapshot> = masterContent.filter(isField);
    const layoutBreaks: ReadonlyArray<TextContentSnapshot> = layoutContent.filter(isBreak);
    const masterBreaks: ReadonlyArray<TextContentSnapshot> = masterContent.filter(isBreak);
    let runIndex: number = 0;
    let fieldIndex: number = 0;
    let breakIndex: number = 0;
    /**
     * @param {TextContentSnapshot} item - Direct visible content target.
     * @returns {EffectiveTextCharacterFills} Matching kind-specific inheritance without array rescans.
     */
    function contentFills(item: TextContentSnapshot): EffectiveTextCharacterFills {
        const index: number = isField(item) ? fieldIndex++ : isBreak(item) ? breakIndex++ : runIndex++;
        const layoutItems: ReadonlyArray<TextContentSnapshot> = isField(item) ? layoutFields : isBreak(item) ? layoutBreaks : layoutRuns;
        const masterItems: ReadonlyArray<TextContentSnapshot> = isField(item) ? masterFields : isBreak(item) ? masterBreaks : masterRuns;
        return resolveTextCharacterStyleSnapshot(item.characterFills, styleInput, {
            kind: isField(item) ? 'field' : isBreak(item) ? 'break' : 'run',
            layout: characterFillsAt(layoutItems, index), master: characterFillsAt(masterItems, index)
        });
    }
    return {
        ...direct,
        effectiveCharacterFills: resolved.effectiveCharacterFills,
        effectiveEndCharacterFills: resolveTextCharacterStyleSnapshot(
            direct.endParagraphProperties ? direct.endParagraphProperties.characterFills : undefined, styleInput, {
                kind: 'end',
                layout: layout && layout.endParagraphProperties ? layout.endParagraphProperties.characterFills : undefined,
                master: master && master.endParagraphProperties ? master.endParagraphProperties.characterFills : undefined
            }),
        runs: direct.runs.map((run: TextRunSnapshot, index: number): TextRunSnapshot => ({
            ...run,
            effectiveCharacterFills: resolveTextCharacterStyleSnapshot(run.characterFills, styleInput, {
                kind: 'run',
                layout: characterFillsAt(layout ? layout.runs : [], index),
                master: characterFillsAt(master ? master.runs : [], index)
            }),
            color: run.color || (run.hyperlink ? hyperlinkColor : undefined) || resolved.color || shapeStyleColor,
            underline: run.underline || (run.hyperlink ? 'sng' : undefined),
            fontFamily: run.fontFamily
                ? materializeThemeFont(run.fontFamily, theme, themeFamily) : run.fontFamily,
            eastAsianFontFamily: run.eastAsianFontFamily
                ? materializeThemeFont(run.eastAsianFontFamily, theme, themeFamily) : run.eastAsianFontFamily,
            complexScriptFontFamily: run.complexScriptFontFamily
                ? materializeThemeFont(run.complexScriptFontFamily, theme, themeFamily) : run.complexScriptFontFamily
        })),
        content: direct.content !== undefined && direct.content !== null ? direct.content.map(
            (item: TextContentSnapshot): TextContentSnapshot => ({
                ...item,
                effectiveCharacterFills: contentFills(item),
                color: item.color || (item.hyperlink ? hyperlinkColor : undefined) || resolved.color || shapeStyleColor,
                underline: item.underline || (item.hyperlink ? 'sng' : undefined),
                fontFamily: item.fontFamily
                    ? materializeThemeFont(item.fontFamily, theme, themeFamily) : item.fontFamily,
                eastAsianFontFamily: item.eastAsianFontFamily
                    ? materializeThemeFont(item.eastAsianFontFamily, theme, themeFamily) : item.eastAsianFontFamily,
                complexScriptFontFamily: item.complexScriptFontFamily
                    ? materializeThemeFont(item.complexScriptFontFamily, theme, themeFamily) : item.complexScriptFontFamily
            })) : undefined,
        endParagraphProperties: direct.endParagraphProperties ? {
            ...direct.endParagraphProperties,
            effectiveCharacterFills: resolveTextCharacterStyleSnapshot(
                direct.endParagraphProperties.characterFills, styleInput, {
                    kind: 'end',
                    layout: layout && layout.endParagraphProperties ? layout.endParagraphProperties.characterFills : undefined,
                    master: master && master.endParagraphProperties ? master.endParagraphProperties.characterFills : undefined
                }),
            fontFamily: direct.endParagraphProperties.fontFamily
                ? materializeThemeFont(direct.endParagraphProperties.fontFamily, theme, themeFamily)
                : direct.endParagraphProperties.fontFamily
        } : undefined,
        level,
        alignment: resolved.alignment || 'l',
        leftMarginPt: nullishValue(resolved.leftMarginPt, () => 0),
        indentPt: nullishValue(resolved.indentPt, () => 0),
        lineSpacing: resolved.lineSpacing,
        spaceBefore: resolved.spaceBefore,
        spaceAfter: resolved.spaceAfter,
        defaultFontFamily: materializeThemeFont(resolved.fontFamily || themeFamily, theme, themeFamily),
        defaultEastAsianFontFamily: materializeThemeFont(
            resolved.eastAsianFontFamily || themeFontsForFamily(theme, themeFamily, 'eastAsian'), theme, themeFamily),
        defaultComplexScriptFontFamily: materializeThemeFont(
            resolved.complexScriptFontFamily || themeFontsForFamily(theme, themeFamily, 'complexScript'), theme, themeFamily),
        // `Font.DefaultSize` is the final source-defined default only after every
        // authored inheritance tier has been exhausted; it is no longer used as a
        // premature viewer fallback.
        defaultFontSizePt: nullishValue(resolved.fontSizePt, () => 18),
        defaultBold: nullishValue(resolved.bold, () => false),
        defaultItalic: nullishValue(resolved.italic, () => false),
        defaultCaps: resolved.caps,
        defaultColor: resolved.color,
        bullet: resolved.bullet,
        rightToLeft: nullishValue(resolved.rightToLeft, () => false),
        eastAsianLineBreak: resolved.eastAsianLineBreak,
        latinLineBreak: resolved.latinLineBreak,
        hangingPunctuation: resolved.hangingPunctuation,
        tabs: resolved.tabs || [],
        styleSources: resolved.sources
    };
}

const EMPTY_MASTER_TEXT_STYLES: TextMasterStyleSnapshot = Object.freeze({
    titleStyle: [], bodyStyle: [], otherStyle: []
});

function paragraphStyle(paragraph: TextParagraphSnapshot | undefined): DirectTextParagraphStyleSnapshot {
    if (!paragraph) {
        return {};
    }
    return {
        alignment: paragraph.alignment,
        leftMarginPt: paragraph.leftMarginPt,
        indentPt: paragraph.indentPt,
        lineSpacing: paragraph.lineSpacing,
        spaceBefore: paragraph.spaceBefore,
        spaceAfter: paragraph.spaceAfter,
        tabs: paragraph.tabs,
        fontFamily: paragraph.defaultFontFamily,
        eastAsianFontFamily: paragraph.defaultEastAsianFontFamily,
        complexScriptFontFamily: paragraph.defaultComplexScriptFontFamily,
        fontSizePt: paragraph.defaultFontSizePt,
        bold: paragraph.defaultBold,
        italic: paragraph.defaultItalic,
        caps: paragraph.defaultCaps,
        color: paragraph.defaultColor,
        characterFills: paragraph.defaultCharacterFills,
        bullet: paragraph.bullet,
        rightToLeft: paragraph.rightToLeft,
        eastAsianLineBreak: paragraph.eastAsianLineBreak,
        latinLineBreak: paragraph.latinLineBreak,
        hangingPunctuation: paragraph.hangingPunctuation
    };
}

function themeFontsForPlaceholder(
    placeholderType: string | undefined,
    theme: PresentationFrameInfo['theme']
): LayoutFontCollection {
    const isTitle: boolean = placeholderType === 'title' || placeholderType === 'ctrTitle';
    const collection: LayoutFontCollection | undefined = isTitle ?
        optionalProperty(optionalProperty(theme, 'fonts'), 'major') :
        optionalProperty(optionalProperty(theme, 'fonts'), 'minor');
    return collection || { latin: 'Arial', eastAsian: '', complexScript: '' };
}

function themeFontsForFamily(
    theme: PresentationFrameInfo['theme'], latinFamily: string, script: 'eastAsian' | 'complexScript'
): string {
    const fonts: LayoutThemeSnapshot['fonts'] | undefined = theme ? theme.fonts : undefined;
    if (!fonts) {
        return '';
    }
    if (fonts.major.latin === latinFamily) {
        return objectGet<string>(fonts.major, script) || fonts.major.latin;
    }
    return objectGet<string>(fonts.minor, script) || fonts.minor.latin;
}

function materializeThemeFont(
    family: string,
    theme: PresentationFrameInfo['theme'],
    fallback: string
): string {
    if (family === '+mj-lt') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'major'), 'latin') || fallback;
    }
    if (family === '+mn-lt') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'minor'), 'latin') || fallback;
    }
    if (family === '+mj-ea') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'major'), 'eastAsian') || fallback;
    }
    if (family === '+mn-ea') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'minor'), 'eastAsian') || fallback;
    }
    if (family === '+mj-cs') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'major'), 'complexScript') || fallback;
    }
    if (family === '+mn-cs') {
        return optionalProperty(optionalProperty(optionalProperty(theme, 'fonts'), 'minor'), 'complexScript') || fallback;
    }
    return family;
}

function mergeProperties(
    master: TextBodyPropertiesSnapshot | undefined,
    layout: TextBodyPropertiesSnapshot | undefined,
    direct: TextBodyPropertiesSnapshot
): ResolvedTextBodyProperties {
    return {
        presetTextWarp: first(direct.presetTextWarp, optionalProperty(layout, 'presetTextWarp'),
                              optionalProperty(master, 'presetTextWarp')),
        leftInsetPt: nullishValue(first(direct.leftInsetPt, optionalProperty(layout, 'leftInsetPt'), optionalProperty(master, 'leftInsetPt')), () => BODY_DEFAULTS.leftInsetPt),
        topInsetPt: nullishValue(first(direct.topInsetPt, optionalProperty(layout, 'topInsetPt'), optionalProperty(master, 'topInsetPt')), () => BODY_DEFAULTS.topInsetPt),
        rightInsetPt: nullishValue(first(direct.rightInsetPt, optionalProperty(layout, 'rightInsetPt'), optionalProperty(master, 'rightInsetPt')), () => BODY_DEFAULTS.rightInsetPt),
        bottomInsetPt: nullishValue(first(direct.bottomInsetPt, optionalProperty(layout, 'bottomInsetPt'), optionalProperty(master, 'bottomInsetPt')), () => BODY_DEFAULTS.bottomInsetPt),
        anchor: first(direct.anchor, optionalProperty(layout, 'anchor'), optionalProperty(master, 'anchor')) || BODY_DEFAULTS.anchor,
        wrap: first(direct.wrap, optionalProperty(layout, 'wrap'), optionalProperty(master, 'wrap')) || BODY_DEFAULTS.wrap,
        columnCount: first(direct.columnCount, optionalProperty(layout, 'columnCount'), optionalProperty(master, 'columnCount')) || BODY_DEFAULTS.columnCount,
        columnSpacingPt: nullishValue(first(direct.columnSpacingPt, optionalProperty(layout, 'columnSpacingPt'),
                                            optionalProperty(master, 'columnSpacingPt')),
                                      () => BODY_DEFAULTS.columnSpacingPt),
        verticalType: first(direct.verticalType, optionalProperty(layout, 'verticalType'), optionalProperty(master, 'verticalType')) || BODY_DEFAULTS.verticalType,
        autoFit: direct.autoFit || optionalProperty(layout, 'autoFit') || optionalProperty(master, 'autoFit') || BODY_DEFAULTS.autoFit
    };
}

function matchingPlaceholder(
    shape: SlideShapeSnapshot,
    candidates: ReadonlyArray<SlideShapeSnapshot>,
    isMaster: boolean
): SlideShapeSnapshot | undefined {
    if (!shape.placeholder) {
        return undefined;
    }
    // ports `Helper.CheckPlaceholder(IPlaceholderFormat, IPlaceholderFormat, bool)`:
    // a non-zero placeholder index is the primary identity. PowerPoint commonly
    // serializes the slide/layout side as `obj` while the master side is `body`.
    return candidates.find((candidate: SlideShapeSnapshot): boolean => {
        if (!candidate.placeholder) {
            return false;
        }
        const candidateType: string = candidate.placeholder.type || 'obj';
        const currentType: string = optionalProperty(shape.placeholder, 'type') || 'obj';
        const candidateIndex: number = Number(nullishValue(candidate.placeholder.index, () => 0));
        const currentIndex: number = Number(nullishValue(optionalProperty(shape.placeholder, 'index'), () => 0));
        if (candidateIndex === currentIndex) {
            if (candidateIndex === 0) {
                return samePlaceholderType(candidateType, currentType) ||
                    (currentType === 'subTitle' && !isMaster);
            }
            if (isSpecialPlaceholder(candidateType) && currentType === 'obj') {
                return false;
            }
            if (isMaster && isTitlePlaceholder(candidateType) && candidateType !== currentType) {
                return false;
            }
            return true;
        }
        if (!samePlaceholderType(candidateType, currentType)) {
            return false;
        }
        return isMaster || candidateIndex === 0 || currentIndex === 0;
    });
}

/**
 * Returns whether two placeholder types share the same inheritance role.
 *
 * @param {string} left - Candidate placeholder type.
 * @param {string} right - Current placeholder type.
 * @returns {boolean} Whether the types share an inheritance role.
 */
function samePlaceholderType(left: string, right: string): boolean {
    return left === right || (isTitlePlaceholder(left) && isTitlePlaceholder(right));
}

/**
 * Returns whether a placeholder belongs to the title family.
 *
 * @param {string} type - Placeholder type.
 * @returns {boolean} Whether the type is a title placeholder.
 */
function isTitlePlaceholder(type: string): boolean {
    return type === 'title' || type === 'ctrTitle';
}

/**
 * Returns whether a placeholder is a non-content header/footer field.
 *
 * @param {string} type - Placeholder type.
 * @returns {boolean} Whether the type is a special field placeholder.
 */
function isSpecialPlaceholder(type: string): boolean {
    return type === 'dt' || type === 'hdr' || type === 'ftr' || type === 'sldNum';
}

function first<T>(...values: Array<T | undefined>): T | undefined {
    return values.find((value: T | undefined): boolean => value !== undefined);
}

/** Reads a property only when its owner is present. Keys are static `keyof` members.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
    // eslint-disable-next-line security/detect-object-injection -- key is a statically inferred keyof T member
    return value !== undefined && value !== null ? value[key] : undefined;
}

/** Returns a value unless it is nullish.
 * @param {*} value - Preferred value.
 * @param {Function} fallback - Lazy fallback.
 * @returns {*} Preferred value or fallback.
 */
function nullishValue<T, U>(value: T | null | undefined, fallback: () => U): T | U {
    return value !== undefined && value !== null ? value : fallback();
}

/**
 * @param {ReadonlyArray<TextContentSnapshot>} values - Kind-specific matched contents.
 * @param {number} index - Target ordinal.
 * @returns {TextCharacterFills | undefined} Matching authored target only.
 */
function characterFillsAt(values: ReadonlyArray<TextContentSnapshot>, index: number): TextCharacterFills | undefined {
    const value: TextContentSnapshot | undefined = arrayAt(values, index);
    return value === undefined ? undefined : value.characterFills;
}
/**
 * @param {TextContentSnapshot} item - Content item.
 * @returns {boolean} Whether it is a regular run.
 */
function isRun(item: TextContentSnapshot): boolean { return item.kind === undefined || item.kind === 'run'; }
/**
 * @param {TextContentSnapshot} item - Content item.
 * @returns {boolean} Whether it is a field.
 */
function isField(item: TextContentSnapshot): boolean { return item.kind === 'field'; }
/**
 * @param {TextContentSnapshot} item - Content item.
 * @returns {boolean} Whether it is a break.
 */
function isBreak(item: TextContentSnapshot): boolean { return item.kind === 'break'; }
