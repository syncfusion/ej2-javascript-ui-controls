import { readTextBodyDirectProperties } from '../core/text/read-text-body-properties';
import { LayoutTextBodySnapshot, LayoutTextParagraphSnapshot } from '../core/layout/layout-model';
import { TextStyleLevelSnapshot, TextMasterStyleSnapshot } from './text-style-inheritance';
import { getGradientDrawingNamespace } from '../core/theme/read-gradient';
import { readTextCharacterFills, hasTextCharacterFills, TextCharacterFills } from '../core/text/character-fills';
import { ColorValue } from '../core/theme/color-value';
import { ThemeColorTransform } from '../core/theme/theme-render-model';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../core/xml/dom';
import {
    DirectTextParagraphStyleSnapshot, TextBulletColorSnapshot, TextBulletFontSnapshot,
    TextBulletSizeSnapshot, TextBulletSnapshot
} from './text-style-inheritance';

const DML_NS: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';

/** Clone-safe direct colour plus its authored DrawingML transforms. */
export interface TextColorSnapshot {
    /** Direct colour value; scheme values remain unresolved references. */
    readonly value: ColorValue;
    /** Authored transforms in document order. */
    readonly transforms: ReadonlyArray<ThemeColorTransform>;
}

/** Clone-safe direct hyperlink metadata carried by `a:hlinkClick`. */
export interface TextHyperlinkSnapshot {
    /** Relationship id authored on the run. */
    readonly relationshipId?: string;
    /** Resolved target when the caller supplies the part relationship table. */
    readonly target?: string;
    /** Authored tooltip. */
    readonly tooltip?: string;
    /** Authored PowerPoint action URI. */
    readonly action?: string;
}

/** JSON-safe, direct character formatting shared by runs, fields, and breaks. */
export interface DirectTextCharacterSnapshot {
    /** Additive authored fill carriers; absence means all are missing. */
    readonly characterFills?: TextCharacterFills;
    readonly fontFamily?: string;
    readonly eastAsianFontFamily?: string;
    readonly complexScriptFontFamily?: string;
    /** Authored symbol face, retained for the existing symbol mapping/layout pipeline. */
    readonly symbolFontFamily?: string;
    readonly fontSizePt?: number;
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: string;
    readonly strike?: string;
    readonly caps?: string;
    readonly baselinePercent?: number;
    readonly characterSpacingPt?: number;
    readonly language?: string;
    readonly color?: TextColorSnapshot;
    readonly highlight?: TextColorSnapshot;
    readonly hyperlink?: TextHyperlinkSnapshot;
}

/** One regular `a:r` snapshot. */
export interface TextRunContentSnapshot extends DirectTextCharacterSnapshot {
    readonly kind: 'run';
    readonly text: string;
}

/** One explicit `a:br` snapshot. */
export interface TextBreakContentSnapshot extends DirectTextCharacterSnapshot {
    readonly kind: 'break';
    readonly text: '';
}

/** One dynamic `a:fld` snapshot, including the current cached text. */
export interface TextFieldContentSnapshot extends DirectTextCharacterSnapshot {
    readonly kind: 'field';
    readonly text: string;
    readonly fieldId?: string;
    readonly fieldType?: string;
}

/** Ordered paragraph content suitable for structured cloning to a renderer Worker. */
export type TextParagraphContentSnapshot = TextRunContentSnapshot | TextBreakContentSnapshot | TextFieldContentSnapshot;

/**
 * Reads the S3 paragraph properties that cannot be represented by run content.
 *
 * @remarks This is a non-mutating direct snapshot. Inheritance is performed by
 * `resolveTextParagraphStyleSnapshot`. Ports the data consumed by the Skia
 * `Paragraph.LayoutBullet` and RTL layout path.
 * @param {OoxmlElement} paragraphProperties DrawingML `a:pPr` or level style.
 * @param {Readonly<Record<string, string>>} relationshipTargets Relationship targets for picture bullets.
 * @returns {DirectTextParagraphStyleSnapshot} Sparse clone-safe authored values.
 */
export function readTextParagraphDirectStyleSnapshot(
    paragraphProperties: OoxmlElement,
    relationshipTargets: Readonly<Record<string, string>> = {}
): DirectTextParagraphStyleSnapshot {
    const defaultRun: DirectTextCharacterSnapshot = readCharacterProperties(
        findChild(paragraphProperties, DML_NS, 'defRPr'), relationshipTargets);
    return {
        fontFamily: defaultRun.fontFamily,
        eastAsianFontFamily: defaultRun.eastAsianFontFamily,
        complexScriptFontFamily: defaultRun.complexScriptFontFamily,
        fontSizePt: defaultRun.fontSizePt,
        bold: defaultRun.bold,
        italic: defaultRun.italic,
        caps: defaultRun.caps,
        color: defaultRun.color,
        characterFills: defaultRun.characterFills,
        bullet: readBullet(paragraphProperties, relationshipTargets),
        rightToLeft: optionalBoolean(getAttr(paragraphProperties, '', 'rtl')),
        eastAsianLineBreak: optionalBoolean(getAttr(paragraphProperties, '', 'eaLnBrk')),
        latinLineBreak: optionalBoolean(getAttr(paragraphProperties, '', 'latinLnBrk')),
        hangingPunctuation: optionalBoolean(getAttr(paragraphProperties, '', 'hangingPunct'))
    };
}

function readBullet(
    properties: OoxmlElement,
    relationshipTargets: Readonly<Record<string, string>>
): TextBulletSnapshot | undefined {
    if (findChild(properties, DML_NS, 'buNone')) {
        return { kind: 'none' };
    }
    const font: TextBulletFontSnapshot | undefined = readBulletFont(properties);
    const size: TextBulletSizeSnapshot | undefined = readBulletSize(properties);
    const color: TextBulletColorSnapshot | undefined = readBulletColor(properties);
    const character: OoxmlElement = findChild(properties, DML_NS, 'buChar');
    if (character) {
        return { kind: 'character', character: getAttr(character, '', 'char') || '', font, size, color };
    }
    const numbered: OoxmlElement = findChild(properties, DML_NS, 'buAutoNum');
    if (numbered) {
        return { kind: 'numbered', scheme: getAttr(numbered, '', 'type') || 'arabicPeriod',
            startAt: parseNumber(getAttr(numbered, '', 'startAt')), font, size, color };
    }
    const picture: OoxmlElement = findChild(properties, DML_NS, 'buBlip');
    if (picture) {
        const blip: OoxmlElement = findChild(picture, DML_NS, 'blip');
        const relationshipId: string = attributeByLocalName(blip, 'embed') || attributeByLocalName(blip, 'link');
        return { kind: 'picture', relationshipId,
            target: relationshipId === undefined ? undefined :
                Reflect.get(relationshipTargets, relationshipId) as string | undefined, font, size, color };
    }
    return undefined;
}

function readBulletFont(properties: OoxmlElement): TextBulletFontSnapshot | undefined {
    if (findChild(properties, DML_NS, 'buFontTx')) {
        return { kind: 'followText' };
    }
    const explicit: OoxmlElement = findChild(properties, DML_NS, 'buFont');
    return explicit ? { kind: 'explicit', family: getAttr(explicit, '', 'typeface') || '' } : undefined;
}

function readBulletSize(properties: OoxmlElement): TextBulletSizeSnapshot | undefined {
    if (findChild(properties, DML_NS, 'buSzTx')) {
        return { kind: 'followText' };
    }
    const percent: OoxmlElement = findChild(properties, DML_NS, 'buSzPct');
    if (percent) {
        return { kind: 'percent', value: (parseNumber(getAttr(percent, '', 'val')) || 100000) / 1000 };
    }
    const points: OoxmlElement = findChild(properties, DML_NS, 'buSzPts');
    return points ? { kind: 'points', value: (parseNumber(getAttr(points, '', 'val')) || 0) / 100 } : undefined;
}

function readBulletColor(properties: OoxmlElement): TextBulletColorSnapshot | undefined {
    if (findChild(properties, DML_NS, 'buClrTx')) {
        return { kind: 'followText' };
    }
    const explicit: TextColorSnapshot = readColor(findChild(properties, DML_NS, 'buClr'));
    return explicit ? { kind: 'explicit', color: explicit } : undefined;
}

/**
 * Reads ordered `a:r`, `a:br`, and `a:fld` children without mutating the OOXML tree.
 *
 * @remarks Direct and resolved formatting deliberately remain separate. Unknown
 * children and attributes are untouched, preserving the source tree for round-trip.
 * Ports `Paragraph.GetTextParts` / `Paragraph.ContainsLineBreak`.
 * @param {OoxmlElement} paragraph DrawingML `a:p` element.
 * @param {Readonly<Record<string, string>>} relationshipTargets Optional relationship-id to target lookup for the owning part.
 * @returns {ReadonlyArray<TextParagraphContentSnapshot>} Ordered clone-safe inline content.
 */
export function readTextParagraphContentSnapshot(
    paragraph: OoxmlElement,
    relationshipTargets: Readonly<Record<string, string>> = {}
): ReadonlyArray<TextParagraphContentSnapshot> {
    const result: TextParagraphContentSnapshot[] = [];
    for (let index: number = 0; index < paragraph.children.length; index++) {
        const child: OoxmlElement | OoxmlText = paragraph.children.slice(index, index + 1)[0];
        if (child.kind !== 'element' || child.namespaceUri !== getGradientDrawingNamespace(paragraph.namespaceUri)) {
            continue;
        }
        if (child.localName !== 'r' && child.localName !== 'br' && child.localName !== 'fld') {
            continue;
        }
        const rPr: OoxmlElement = findChild(child, DML_NS, 'rPr');
        const direct: DirectTextCharacterSnapshot = readCharacterProperties(rPr, relationshipTargets);
        if (child.localName === 'br') {
            result.push({ kind: 'break', text: '', ...direct });
            continue;
        }
        const textElement: OoxmlElement = findChild(child, DML_NS, 't');
        const text: string = textElement === undefined ? '' : collectDirectText(textElement);
        if (child.localName === 'fld') {
            result.push({
                kind: 'field', text, ...direct,
                fieldId: getAttr(child, '', 'id'),
                fieldType: getAttr(child, '', 'type')
            });
        }
        else {
            result.push({ kind: 'run', text, ...direct });
        }
    }
    return result;
}

/**
 * Reads the direct `a:endParaRPr` formatting used to preserve empty-paragraph
 * and trailing-break metrics.
 *
 * @remarks The returned value is sparse and clone-safe. It is not merged with
 * `a:defRPr` or inherited text styles, and the source XML is not mutated.
 * Ports `Paragraph.UpdateEmptyParagraphHeight` and the terminal-break branch
 * in `Paragraph.Layout`.
 * @param {OoxmlElement} paragraph DrawingML `a:p` element.
 * @param {Readonly<Record<string, string>>} relationshipTargets Optional relationship targets.
 * @returns {DirectTextCharacterSnapshot | undefined} Direct authored character properties.
 */
export function readTextParagraphEndCharacterSnapshot(
    paragraph: OoxmlElement,
    relationshipTargets: Readonly<Record<string, string>> = {}
): DirectTextCharacterSnapshot | undefined {
    const endProperties: OoxmlElement = findChild(paragraph, DML_NS, 'endParaRPr');
    return endProperties === undefined ? undefined : readCharacterProperties(endProperties, relationshipTargets);
}

function readCharacterProperties(
    rPr: OoxmlElement | undefined,
    relationshipTargets: Readonly<Record<string, string>>
): DirectTextCharacterSnapshot {
    if (rPr === undefined) {
        return {};
    }
    const fills: TextCharacterFills = readTextCharacterFills(rPr);
    const latin: OoxmlElement = findChild(rPr, DML_NS, 'latin');
    const eastAsian: OoxmlElement = findChild(rPr, DML_NS, 'ea');
    const complexScript: OoxmlElement = findChild(rPr, DML_NS, 'cs');
    const symbol: OoxmlElement = findChild(rPr, DML_NS, 'sym');
    const size: number = parseNumber(getAttr(rPr, '', 'sz'));
    const baseline: number = parseNumber(getAttr(rPr, '', 'baseline'));
    const spacing: number = parseNumber(getAttr(rPr, '', 'spc'));
    const hyperlinkElement: OoxmlElement = findChild(rPr, DML_NS, 'hlinkClick');
    const relationshipId: string = attributeByLocalName(hyperlinkElement, 'id');
    const hyperlink: TextHyperlinkSnapshot | undefined = hyperlinkElement === undefined ? undefined : {
        relationshipId,
        target: relationshipId === undefined ? undefined : Reflect.get(relationshipTargets, relationshipId) as string | undefined,
        tooltip: getAttr(hyperlinkElement, '', 'tooltip'),
        action: getAttr(hyperlinkElement, '', 'action')
    };
    return {
        characterFills: hasTextCharacterFills(fills) ? fills : undefined,
        fontFamily: latin === undefined ? undefined : getAttr(latin, '', 'typeface'),
        eastAsianFontFamily: eastAsian === undefined ? undefined : getAttr(eastAsian, '', 'typeface'),
        complexScriptFontFamily: complexScript === undefined ? undefined : getAttr(complexScript, '', 'typeface'),
        symbolFontFamily: symbol === undefined ? undefined : getAttr(symbol, '', 'typeface'),
        fontSizePt: size === undefined ? undefined : size / 100,
        bold: optionalBoolean(getAttr(rPr, '', 'b')),
        italic: optionalBoolean(getAttr(rPr, '', 'i')),
        underline: getAttr(rPr, '', 'u'),
        strike: getAttr(rPr, '', 'strike'),
        caps: getAttr(rPr, '', 'cap'),
        baselinePercent: baseline === undefined ? undefined : baseline / 1000,
        characterSpacingPt: spacing === undefined ? undefined : spacing / 100,
        language: getAttr(rPr, '', 'lang'),
        color: readColor(findChild(rPr, DML_NS, 'solidFill')),
        highlight: readColor(findChild(rPr, DML_NS, 'highlight')),
        hyperlink
    };
}

function readColor(container: OoxmlElement | undefined): TextColorSnapshot | undefined {
    if (container === undefined) {
        return undefined;
    }
    const value: ColorValue = tryParseColorChoiceChild(container);
    if (value === undefined) {
        return undefined;
    }
    const choice: OoxmlElement = firstElementChild(container);
    const transforms: ThemeColorTransform[] = [];
    if (choice !== undefined) {
        for (let index: number = 0; index < choice.children.length; index++) {
            const child: OoxmlElement | OoxmlText = choice.children.slice(index, index + 1)[0];
            if (child.kind === 'element' && child.namespaceUri === DML_NS) {
                transforms.push({ kind: child.localName, value: parseNumber(getAttr(child, '', 'val')) });
            }
        }
    }
    return { value, transforms };
}

function firstElementChild(parent: OoxmlElement): OoxmlElement | undefined {
    for (let index: number = 0; index < parent.children.length; index++) {
        const child: OoxmlElement | OoxmlText = parent.children.slice(index, index + 1)[0];
        if (child.kind === 'element') {
            return child;
        }
    }
    return undefined;
}

function attributeByLocalName(element: OoxmlElement | undefined, localName: string): string | undefined {
    if (element === undefined) {
        return undefined;
    }
    for (let index: number = 0; index < element.attributes.length; index++) {
        const attribute: OoxmlAttribute = element.attributes.slice(index, index + 1)[0];
        if (attribute.localName === localName) {
            return attribute.value;
        }
    }
    return undefined;
}

function parseNumber(value: string | undefined): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    const parsed: number = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (value === '1' || value.toLowerCase() === 'true') {
        return true;
    }
    if (value === '0' || value.toLowerCase() === 'false') {
        return false;
    }
    return undefined;
}

function findChild(parent: OoxmlElement, namespaceUri: string, localName: string): OoxmlElement | undefined {
    if (namespaceUri === DML_NS && getGradientDrawingNamespace(parent.namespaceUri) === parent.namespaceUri) {
        namespaceUri = parent.namespaceUri;
    }
    for (let index: number = 0; index < parent.children.length; index++) {
        const child: OoxmlElement | OoxmlText = parent.children.slice(index, index + 1)[0];
        if (child.kind === 'element' && child.namespaceUri === namespaceUri && child.localName === localName) {
            return child;
        }
    }
    return undefined;
}

function getAttr(element: OoxmlElement, namespaceUri: string, localName: string): string | undefined {
    for (let index: number = 0; index < element.attributes.length; index++) {
        const attribute: OoxmlAttribute = element.attributes.slice(index, index + 1)[0];
        if (attribute.namespaceUri === namespaceUri && attribute.localName === localName) {
            return attribute.value;
        }
    }
    return undefined;
}

function collectDirectText(element: OoxmlElement): string {
    let value: string = '';
    for (let index: number = 0; index < element.children.length; index++) {
        const child: OoxmlElement | OoxmlText = element.children.slice(index, index + 1)[0];
        if (child.kind === 'text') {
            value += child.text;
        }
    }
    return value;
}

function tryParseColorChoiceChild(parent: OoxmlElement): ColorValue | undefined {
    const choice: OoxmlElement = firstElementChild(parent);
    if (choice === undefined || choice.namespaceUri !== DML_NS) {
        return undefined;
    }
    const val: string = getAttr(choice, '', 'val');
    if (choice.localName === 'srgbClr' && val !== undefined) {
        return { kind: 'srgb', val };
    }
    if (choice.localName === 'schemeClr' && val !== undefined) {
        return { kind: 'scheme', val };
    }
    if (choice.localName === 'prstClr' && val !== undefined) {
        return { kind: 'prst', val };
    }
    if (choice.localName === 'sysClr' && val !== undefined) {
        return { kind: 'sys', val, lastClr: getAttr(choice, '', 'lastClr') };
    }
    if (choice.localName === 'scrgbClr') {
        const r: string = getAttr(choice, '', 'r');
        const g: string = getAttr(choice, '', 'g');
        const b: string = getAttr(choice, '', 'b');
        return r !== undefined && g !== undefined && b !== undefined ? { kind: 'scrgb', r, g, b } : undefined;
    }
    if (choice.localName === 'hslClr') {
        const hue: string = getAttr(choice, '', 'hue');
        const sat: string = getAttr(choice, '', 'sat');
        const lum: string = getAttr(choice, '', 'lum');
        return hue !== undefined && sat !== undefined && lum !== undefined ? { kind: 'hsl', hue, sat, lum } : undefined;
    }
    return undefined;
}

/**
 * Reads typed direct cell/shape text using the same paragraph and body readers as layout.
 *
 * @param {OoxmlElement} body - Actual text body; namespaces remain authoritative.
 * @param {Readonly<Record<string,string>>} relationships - Part-local hyperlink targets.
 * @returns {LayoutTextBodySnapshot} Detached ordered text and authored fill carriers.
 * @internal
 */
export function readTextBodyLayoutSnapshot(
    body: OoxmlElement, relationships: Readonly<Record<string, string>> = {}): LayoutTextBodySnapshot {
    const direct: import('../core/text/text-layout-types').TextBodyProperties = readTextBodyDirectProperties(body);
    const ns: string = getGradientDrawingNamespace(body.namespaceUri);
    const list: OoxmlElement | undefined = findChild(body, ns, 'lstStyle');
    const levels: ReadonlyArray<TextStyleLevelSnapshot> = readTextListStyleSnapshot(list, relationships);
    const paragraphs: LayoutTextParagraphSnapshot[] = [];
    for (const node of body.children) {
        if (node.kind !== 'element' || node.namespaceUri !== ns || node.localName !== 'p') { continue; }
        const pPr: OoxmlElement | undefined = findChild(node, ns, 'pPr');
        const style: DirectTextParagraphStyleSnapshot = pPr === undefined ? {} : readTextParagraphDirectStyleSnapshot(pPr, relationships);
        const content: ReadonlyArray<TextParagraphContentSnapshot> = readTextParagraphContentSnapshot(node, relationships);
        paragraphs.push({ ...style, defaultFontFamily: style.fontFamily,
            defaultEastAsianFontFamily: style.eastAsianFontFamily, defaultComplexScriptFontFamily: style.complexScriptFontFamily,
            defaultFontSizePt: style.fontSizePt, defaultBold: style.bold, defaultItalic: style.italic,
            defaultCaps: style.caps, defaultColor: style.color, defaultCharacterFills: style.characterFills,
            runs: content.filter((item: TextParagraphContentSnapshot): item is TextRunContentSnapshot => item.kind === 'run'),
            content, endParagraphProperties: readTextParagraphEndCharacterSnapshot(node, relationships) });
    }
    return { properties: { leftInsetPt: direct.leftInset, rightInsetPt: direct.rightInset,
        topInsetPt: direct.topInset, bottomInsetPt: direct.bottomInset, anchor: direct.anchor,
        wrap: direct.wrap, columnCount: direct.columnCount, columnSpacingPt: direct.columnSpacing,
        verticalType: direct.verticalType, autoFit: direct.autoFit }, listStyle: levels, paragraphs };
}

/** Sparse complete-part style context, independent of matching shape text. @internal */
export interface TextStylePartSnapshot {
    readonly masterTextStyles?: TextMasterStyleSnapshot;
    readonly defaultTextStyle?: ReadonlyArray<TextStyleLevelSnapshot>;
}
/**
 * Reuses direct paragraph readers for an actual list/default/master style owner.
 *
 * @param {OoxmlElement} list - Exact owner, or absent.
 * @param {Readonly<Record<string,string>>} relationships - Part-local relationship targets.
 * @returns {ReadonlyArray<TextStyleLevelSnapshot>} Authored levels without inheritance.
 * @internal
 */
export function readTextListStyleSnapshot(
    list: OoxmlElement | undefined, relationships: Readonly<Record<string, string>> = {}): ReadonlyArray<TextStyleLevelSnapshot> {
    if (list === undefined) { return []; }
    const ns: string | undefined = getGradientDrawingNamespace(list.namespaceUri);
    if (ns === undefined) { return []; }
    const levels: TextStyleLevelSnapshot[] = [];
    for (let i: number = -1; i < 9; i++) {
        const level: OoxmlElement | undefined = findChild(list, ns, i < 0 ? 'defPPr' : 'lvl' + String(i + 1) + 'pPr');
        if (level !== undefined) { levels.push({ level: i, ...readTextParagraphDirectStyleSnapshot(level, relationships) }); }
    }
    return levels;
}
/**
 * Reads only actual presentation/default or master title/body/other text styles.
 *
 * @param {OoxmlElement} root - Complete namespace-scoped package-part root.
 * @returns {TextStylePartSnapshot | undefined} Sparse typed style context or unrelated part.
 * @internal
 */
export function readTextStylePartSnapshot(root: OoxmlElement): TextStylePartSnapshot | undefined {
    const pml: string = root.namespaceUri;
    if (pml !== 'http://schemas.openxmlformats.org/presentationml/2006/main' &&
        pml !== 'http://purl.oclc.org/ooxml/presentationml/main') { return undefined; }
    if (root.localName === 'presentation') {
        const style: OoxmlElement | undefined = findChild(root, pml, 'defaultTextStyle');
        return style === undefined ? undefined : { defaultTextStyle: readTextListStyleSnapshot(style) };
    }
    if (root.localName !== 'sldMaster') { return undefined; }
    const styles: OoxmlElement | undefined = findChild(root, pml, 'txStyles');
    if (styles === undefined) { return undefined; }
    return { masterTextStyles: {
        titleStyle: readTextListStyleSnapshot(findChild(styles, pml, 'titleStyle')),
        bodyStyle: readTextListStyleSnapshot(findChild(styles, pml, 'bodyStyle')),
        otherStyle: readTextListStyleSnapshot(findChild(styles, pml, 'otherStyle')) } };
}
