import {
    resolveTextParagraphStyleSnapshot,
    selectTextMasterStyleBucket
} from '@syncfusion/ej2-pptx';
import {
    DirectTextParagraphStyleSnapshot,
    ResolvedTextParagraphStyleSnapshot,
    TextMasterStyleSnapshot,
    TextStyleLevelSnapshot,
    TextStylePropertySources
} from '@syncfusion/ej2-pptx';
import { PresentationFrameInfo } from '../../main-slide/slide-frame-model';
import {
    SlideShapeLevels, SlideShapeSnapshot, TextBodyPropertiesSnapshot, TextParagraphSnapshot
} from '../shape-render-model';
import { TextColorSnapshot, TextContentSnapshot, TextRunSnapshot } from '../shape-render-model';

/**
 * @internal
 */
export interface ResolvedTextBodyProperties {
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

/**
 * @internal
 */
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

/**
 * @internal
 */
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
 * @returns {ResolvedTextBody|undefined} result
 * @internal
 */
export function resolveTextBody(
    shape: SlideShapeSnapshot,
    levels: SlideShapeLevels,
    theme: PresentationFrameInfo['theme']
): ResolvedTextBody | undefined {
    if (!shape.textBody) {
        return undefined;
    }
    const layout: SlideShapeSnapshot | undefined = matchingPlaceholder(shape, levels.layout, false);
    const master: SlideShapeSnapshot | undefined = matchingPlaceholder(shape, levels.master, true);
    const properties: ResolvedTextBodyProperties = mergeProperties(
        optionalProperty(optionalProperty(master, 'textBody'), 'properties'), optionalProperty(optionalProperty(layout, 'textBody'), 'properties'), shape.textBody.properties);
    const themeFamily: string = themeFamilyForPlaceholder(optionalProperty(shape.placeholder, 'type'), theme);
    const masterTextStyles: TextMasterStyleSnapshot = levels.masterTextStyles || EMPTY_MASTER_TEXT_STYLES;
    // ports `Font.GetDefaultSize`: master txStyles belongs to placeholder
    // resolution; ordinary shapes fall through to presentation defaultTextStyle.
    const masterTextStyle: ReadonlyArray<TextStyleLevelSnapshot> = shape.placeholder
        ? selectTextMasterStyleBucket(masterTextStyles, shape.placeholder.type || 'obj') : [];
    const paragraphCount: number = shape.textBody.paragraphs.length;
    const paragraphs: ResolvedTextParagraph[] = [];
    for (let index: number = 0; index < paragraphCount; index++) {
        const direct: TextParagraphSnapshot = shape.textBody.paragraphs[index];
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
                transforms: optionalProperty(shape.styleRefs.fontRef, 'colorTransforms') || []
            } : undefined));
    }
    const sources: Array<'shape' | 'shape-list' | 'layout' | 'master' |
    'master-text-style' | 'presentation-default' | 'theme'> = ['shape', 'shape-list'];
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
 * @internal
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
    shapeStyleColor: TextColorSnapshot | undefined
): ResolvedTextParagraph {
    const level: number = nullishValue(direct.level, () => 0);
    const resolved: ResolvedTextParagraphStyleSnapshot = resolveTextParagraphStyleSnapshot({
        level,
        direct: paragraphStyle(direct),
        shapeList,
        layoutDirect: paragraphStyle(layout),
        layoutList: optionalProperty(optionalProperty(layoutShape, 'textBody'), 'listStyle') || [],
        masterDirect: paragraphStyle(master),
        masterList: optionalProperty(optionalProperty(masterShape, 'textBody'), 'listStyle') || [],
        masterTextStyle,
        presentationDefault,
        themeFontFamily: themeFamily
    });
    return {
        ...direct,
        runs: direct.runs.map((run: TextRunSnapshot): TextRunSnapshot => ({
            ...run,
            color: run.color || resolved.color || shapeStyleColor,
            fontFamily: run.fontFamily
                ? materializeThemeFont(run.fontFamily, theme, themeFamily) : run.fontFamily,
            eastAsianFontFamily: run.eastAsianFontFamily,
            complexScriptFontFamily: run.complexScriptFontFamily
        })),
        content: direct.content !== undefined && direct.content !== null ? direct.content.map(
            (item: TextContentSnapshot): TextContentSnapshot => ({
                ...item,
                color: item.color || resolved.color || shapeStyleColor,
                fontFamily: item.fontFamily
                    ? materializeThemeFont(item.fontFamily, theme, themeFamily) : item.fontFamily,
                eastAsianFontFamily: item.eastAsianFontFamily,
                complexScriptFontFamily: item.complexScriptFontFamily
            })) : undefined,
        endParagraphProperties: direct.endParagraphProperties ? {
            ...direct.endParagraphProperties,
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
        defaultEastAsianFontFamily: resolved.eastAsianFontFamily,
        defaultComplexScriptFontFamily: resolved.complexScriptFontFamily,
        // `Font.DefaultSize` is the final source-defined default only after every
        // authored inheritance tier has been exhausted; it is no longer used as a
        // premature editor fallback.
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
        bullet: paragraph.bullet,
        rightToLeft: paragraph.rightToLeft,
        eastAsianLineBreak: paragraph.eastAsianLineBreak,
        latinLineBreak: paragraph.latinLineBreak,
        hangingPunctuation: paragraph.hangingPunctuation
    };
}

function themeFamilyForPlaceholder(
    placeholderType: string | undefined,
    theme: PresentationFrameInfo['theme']
): string {
    const isTitle: boolean = placeholderType === 'title' || placeholderType === 'ctrTitle';
    const collection: import('../../main-slide/slide-frame-model').SlideFrameFontCollection | undefined = isTitle ?
        optionalProperty(optionalProperty(theme, 'fonts'), 'major') :
        optionalProperty(optionalProperty(theme, 'fonts'), 'minor');
    return optionalProperty(collection, 'latin') || 'Arial';
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
    return family;
}

function mergeProperties(
    master: TextBodyPropertiesSnapshot | undefined,
    layout: TextBodyPropertiesSnapshot | undefined,
    direct: TextBodyPropertiesSnapshot
): ResolvedTextBodyProperties {
    return {
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

/** Reads a property only when its owner is present.
 * @param {*} value - Potentially absent owner.
 * @param {*} key - Property key.
 * @returns {*} Property value or undefined.
 */
function optionalProperty<T, K extends keyof T>(value: T | null | undefined, key: K): T[K] | undefined {
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
