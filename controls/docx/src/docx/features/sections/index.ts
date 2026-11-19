export * from './column-collection';
export * from './column';
export * from './margins';
export * from './page-number-style';
export * from './page-orientation';
export * from './page-size';
export * from './section-break-code';
export * from './section-document-association';
export * from './section-validation';
import { PageSetup as DocPageSetup } from '../document/page-setup';
import { registerAlwaysOnBodyFeatureBootstrap } from '../document/body-always-on';
import { WordDocument } from '../document/document';
import { pointToTwips, twipsToPoint } from '../document/length';
import { parseOnOff } from '../document/on-off';
import { Paragraph } from '../document/paragraph';
import { Section } from '../document/section';
import {
    registerSectionPropertiesAttached,
    registerSectionPropertiesParse,
    resetSectionPropertiesAttachedForTests,
    resetSectionPropertiesParseForTests
} from '../document/section-partition-flatten';
import {
    registerSectionPageSetupClone,
    registerSectionPageSetupSeed,
    resetSectionPageSetupCloneForTests,
    resetSectionPageSetupSeedForTests
} from '../document/sections';
import {
    elementChildren,
    isWml,
    wmlAttr,
    wmlElement,
    wValAttribute,
    WML
} from '../document/wml';
import {
    featureId,
    isFeatureRegistered,
    registerFeature
} from '../../core/registry/index';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { Column } from './column';
import {
    ColumnCollection,
    equalWidthColumns,
    parseTextColumns
} from './column-collection';
import { installedSectionHeaderFooterTextWriter, SectionHeaderFooterTextWriter } from './header-footer-text-writer';
import { Margins } from './margins';
import { PageOrientation } from './page-orientation';
import {
    PageNumberStyle,
    pageNumberStyleFromWire
} from './page-number-style';
import {
    BorderStyle,
    ChapterNumbering,
    defaultLetterPageSetup,
    HeaderFooterReference,
    HeaderFooterReferenceType,
    HeaderFooterTarget,
    LineNumbering,
    LineNumberingMode,
    LineNumberRestart,
    PageBorder,
    PageBorderOffsetFrom,
    PageBorders,
    PageBordersApplyType,
    PageBorderStyle,
    PageSetup,
    PaperSource,
    ParsedPageBorder,
    ParsedPageBorders,
    PrinterPaperTray,
    SectionVerticalAlignment,
    VerticalAlignment
} from './page-setup';
import { PageSize, SizeF } from './page-size';
import {
    breakCodeToWire,
    SectionBreakCode,
    SectionMarkWire,
    wireToBreakCode
} from './section-break-code';
import {
    associatePageSetupDocument,
    associateSectionPropertiesDocument,
    ownerDocumentOf
} from './section-document-association';
import {
    DEFAULT_COLUMN_SPACE,
    TEXT_COLUMNS_MAX,
    TWIPS_MAX
} from './section-validation';
import { SectionPropertiesModel } from '../document/section-properties-model';
import { FeatureId } from '../../core/registry/feature-registry';

const SECTIONS: FeatureId = featureId('sections');
const HEADERS_FOOTERS_FEATURE_ID: string = 'headers-footers';

/** Office WordDocument relationships namespace for `r:id` on `CT_Rel`. */
const RELATIONSHIPS_OFFICE_NS: string =
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** Letter defaults when `w:pgSz` / `w:pgMar` are absent on load. */
const LETTER_WIDTH: number = PageSize.Letter.width;
const LETTER_HEIGHT: number = PageSize.Letter.height;
const DEFAULT_MARGIN: number = 72;
const DEFAULT_HEADER_FOOTER_DISTANCE: number = 36;
const DEFAULT_GUTTER: number = 0;

const PAGE_BORDER_STYLES: ReadonlySet<string> = new Set([
    'nil',
    'none',
    'single',
    'thick',
    'double',
    'dotted',
    'dashed',
    'dotDash',
    'dotDotDash',
    'triple',
    'thinThickSmallGap',
    'thickThinSmallGap',
    'thinThickThinSmallGap',
    'thinThickMediumGap',
    'thickThinMediumGap',
    'thinThickThinMediumGap',
    'thinThickLargeGap',
    'thickThinLargeGap',
    'thinThickThinLargeGap',
    'wave',
    'doubleWave',
    'dashSmallGap',
    'dashDotStroked',
    'threeDEmboss',
    'threeDEngrave',
    'outset',
    'inset'
]);

// —— re-exports (public / private package surface) ——

export {
    BorderStyle,
    defaultLetterPageSetup,
    HeaderFooterReference,
    HeaderFooterReferenceType,
    HeaderFooterTarget,
    LineNumbering,
    LineNumberingMode,
    LineNumberRestart,
    PageBorder,
    PageBorderOffsetFrom,
    PageBorders,
    PageBordersApplyType,
    PageBorderStyle,
    PageSetup,
    PaperSource,
    ParsedPageBorder,
    ParsedPageBorders,
    PrinterPaperTray,
    SectionVerticalAlignment,
    VerticalAlignment,
    ChapterNumbering
} from './page-setup';

function sectionsError(message: string): Error {
    return new Error(`sections: ${message}`);
}

function relIdAttribute(el: OpenXmlElement): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find(
        (a: OpenXmlAttribute) => a.localName === 'id' && a.namespaceUri === RELATIONSHIPS_OFFICE_NS
    );
    return found == null ? undefined : found.value;
}

function relIdAttr(value: string): OpenXmlAttribute {
    return {
        namespaceUri: RELATIONSHIPS_OFFICE_NS,
        localName: 'id',
        prefix: 'r',
        value
    };
}

function wmlAttribute(el: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find(
        (a: OpenXmlAttribute) =>
            a.localName === localName &&
            (a.namespaceUri === WML || a.namespaceUri === '')
    );
    return found == null ? undefined : found.value;
}

function parseTwips(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (n < 0 || n > TWIPS_MAX) {
        return undefined;
    }
    return n;
}

function parseUnsignedInt(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}

function parseOnOffAttribute(raw: string | undefined): boolean | undefined {
    if (raw === undefined || raw.length === 0) {
        return true;
    }
    const normalized: string = raw.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'off') {
        return false;
    }
    return undefined;
}

function parseHeaderFooterReference(
    element: OpenXmlElement
): HeaderFooterReference | undefined {
    const kind: HeaderFooterReference['kind'] = isWml(element, 'headerReference')
        ? 'header'
        : isWml(element, 'footerReference')
            ? 'footer'
            : undefined;
    if (kind === undefined) {
        return undefined;
    }
    const relationshipId: string = relIdAttribute(element);
    const typeRaw: string = wmlAttribute(element, 'type');
    const refType: HeaderFooterReferenceType =
        typeRaw === 'default' || typeRaw === 'first' || typeRaw === 'even'
            ? typeRaw
            : undefined;
    if (relationshipId === undefined || refType === undefined) {
        return undefined;
    }
    return { kind, refType, relationshipId };
}

function parseSectionMarkWire(element: OpenXmlElement): SectionMarkWire | undefined {
    const val: string = wValAttribute(element);
    if (
        val === 'newPage' ||
        val === 'continuous' ||
        val === 'nextColumn' ||
        val === 'evenPage' ||
        val === 'oddPage'
    ) {
        return val;
    }
    return undefined;
}

function parsePageSizeFields(
    element: OpenXmlElement
): { width: number; height: number; orientation?: PageOrientation } | undefined {
    const wRaw: number = parseTwips(wmlAttribute(element, 'w'));
    const hRaw: number = parseTwips(wmlAttribute(element, 'h'));
    if (wRaw === undefined || hRaw === undefined) {
        return undefined;
    }
    const orientRaw: string = wmlAttribute(element, 'orient');
    let orientation: PageOrientation | undefined;
    if (orientRaw === 'landscape') {
        orientation = PageOrientation.Landscape;
    } else if (orientRaw === 'portrait') {
        orientation = PageOrientation.Portrait;
    }
    return {
        width: twipsToPoint(wRaw),
        height: twipsToPoint(hRaw),
        orientation
    };
}

function parsePageMarginFields(
    element: OpenXmlElement
):
    | {
        left: number;
        top: number;
        right: number;
        bottom: number;
        header: number;
        footer: number;
        gutter: number;
    }
    | undefined {
    const topRaw: number = parseTwips(wmlAttribute(element, 'top'));
    const rightRaw: number = parseTwips(wmlAttribute(element, 'right'));
    const bottomRaw: number = parseTwips(wmlAttribute(element, 'bottom'));
    const leftRaw: number = parseTwips(wmlAttribute(element, 'left'));
    const headerRaw: number = parseTwips(wmlAttribute(element, 'header'));
    const footerRaw: number = parseTwips(wmlAttribute(element, 'footer'));
    const gutterRaw: number = parseTwips(wmlAttribute(element, 'gutter'));
    if (
        topRaw === undefined ||
        rightRaw === undefined ||
        bottomRaw === undefined ||
        leftRaw === undefined ||
        headerRaw === undefined ||
        footerRaw === undefined ||
        gutterRaw === undefined
    ) {
        return undefined;
    }
    return {
        top: twipsToPoint(topRaw),
        right: twipsToPoint(rightRaw),
        bottom: twipsToPoint(bottomRaw),
        left: twipsToPoint(leftRaw),
        header: twipsToPoint(headerRaw),
        footer: twipsToPoint(footerRaw),
        gutter: twipsToPoint(gutterRaw)
    };
}

function parsePaperSource(element: OpenXmlElement): PaperSource | undefined {
    const firstRaw: string = wmlAttribute(element, 'first');
    const otherRaw: string = wmlAttribute(element, 'other');
    let firstPageTray: number | undefined;
    let otherPagesTray: number | undefined;
    if (firstRaw !== undefined) {
        firstPageTray = parseUnsignedInt(firstRaw);
        if (firstPageTray === undefined) {
            return undefined;
        }
    }
    if (otherRaw !== undefined) {
        otherPagesTray = parseUnsignedInt(otherRaw);
        if (otherPagesTray === undefined) {
            return undefined;
        }
    }
    if (firstPageTray === undefined && otherPagesTray === undefined) {
        return undefined;
    }
    return { firstPageTray, otherPagesTray };
}

function parseLineNumbering(element: OpenXmlElement): LineNumbering | undefined {
    const countByRaw: string = wmlAttribute(element, 'countBy');
    if (countByRaw === undefined) {
        return undefined;
    }
    if (!/^\d+$/.test(countByRaw)) {
        return undefined;
    }
    const countBy: number = Number.parseInt(countByRaw, 10);
    if (countBy < 1) {
        return undefined;
    }
    let restart: LineNumberRestart | undefined;
    const restartRaw: string = wmlAttribute(element, 'restart');
    if (restartRaw !== undefined) {
        if (
            restartRaw !== 'newPage' &&
            restartRaw !== 'newSection' &&
            restartRaw !== 'continuous'
        ) {
            return undefined;
        }
        restart = restartRaw === 'newPage' ? undefined : restartRaw;
    }
    let startAt: number | undefined;
    const startRaw: string = wmlAttribute(element, 'start');
    if (startRaw !== undefined) {
        if (!/^\d+$/.test(startRaw)) {
            return undefined;
        }
        startAt = Number.parseInt(startRaw, 10);
    }
    let distanceFromText: number | undefined;
    const distanceRaw: string = wmlAttribute(element, 'distance');
    if (distanceRaw !== undefined) {
        const parsed: number = parseTwips(distanceRaw);
        if (parsed === undefined) {
            return undefined;
        }
        distanceFromText = twipsToPoint(parsed);
    }
    return {
        countBy,
        restart,
        startAt,
        distanceFromText
    };
}

function parseChapterSeparator(
    raw: string | undefined
): ChapterNumbering['separator'] | undefined {
    if (
        raw === 'hyphen' ||
        raw === 'period' ||
        raw === 'colon' ||
        raw === 'emDash' ||
        raw === 'enDash'
    ) {
        return raw;
    }
    return undefined;
}

function parsePageNumberingFields(
    element: OpenXmlElement
):
    | {
        pageStartingNumber?: number;
        restartPageNumbering?: boolean;
        pageNumberStyle: PageNumberStyle;
        chapterNumbering?: ChapterNumbering;
        pageNumberingPresent: true;
    }
    | undefined {
    const fmtRaw: string = wmlAttribute(element, 'fmt');
    // Absent fmt → schema default decimal. Unknown fmt → opaque (never coerce).
    if (fmtRaw !== undefined) {
        const known: boolean =
            fmtRaw === 'decimal' ||
            fmtRaw === 'upperRoman' ||
            fmtRaw === 'lowerRoman' ||
            fmtRaw === 'upperLetter' ||
            fmtRaw === 'lowerLetter' ||
            fmtRaw === 'ordinal' ||
            fmtRaw === 'cardinalText' ||
            fmtRaw === 'ordinalText' ||
            fmtRaw === 'numberInDash' ||
            fmtRaw === 'chicago';
        if (!known) {
            return undefined;
        }
    }
    const pageNumberStyle: PageNumberStyle = pageNumberStyleFromWire(fmtRaw);

    let pageStartingNumber: number | undefined;
    let restartPageNumbering: boolean | undefined;
    const startRaw: string = wmlAttribute(element, 'start');
    if (startRaw !== undefined) {
        if (!/^\d+$/.test(startRaw)) {
            return undefined;
        }
        const startAt: number = Number.parseInt(startRaw, 10);
        if (startAt < 1) {
            return undefined;
        }
        pageStartingNumber = startAt;
        restartPageNumbering = true;
    }

    const chapStyleRaw: string = wmlAttribute(element, 'chapStyle');
    const chapSepRaw: string = wmlAttribute(element, 'chapSep');
    let chapterNumbering: ChapterNumbering | undefined;
    if (chapStyleRaw !== undefined) {
        if (!/^\d+$/.test(chapStyleRaw)) {
            return undefined;
        }
        const headingLevel: number = Number.parseInt(chapStyleRaw, 10);
        if (headingLevel < 1 || headingLevel > 9) {
            return undefined;
        }
        let separator: ChapterNumbering['separator'] = 'hyphen';
        if (chapSepRaw !== undefined) {
            const parsedSep: ChapterNumbering['separator'] = parseChapterSeparator(chapSepRaw);
            if (parsedSep === undefined) {
                return undefined;
            }
            separator = parsedSep;
        }
        chapterNumbering = { headingLevel, separator };
    } else if (chapSepRaw !== undefined) {
        // chapSep without chapStyle is not meaningful; keep opaque.
        return undefined;
    }

    return {
        pageStartingNumber,
        restartPageNumbering,
        pageNumberStyle,
        chapterNumbering,
        pageNumberingPresent: true
    };
}

function isActiveBorderEdge(edge: ParsedPageBorder | undefined): boolean {
    return edge !== undefined && edge.style !== 'none' && edge.style !== 'nil';
}

function parsePageBorderEdge(element: OpenXmlElement): ParsedPageBorder | undefined {
    let ts334: any; let ts335: any;
    const styleRaw: string = ((ts334 = wValAttribute(element)), ts334 != null
        ? ts334
        : wmlAttribute(element, 'val'));
    if (styleRaw === undefined || !PAGE_BORDER_STYLES.has(styleRaw)) {
        return undefined;
    }
    const style: PageBorderStyle = styleRaw as PageBorderStyle;
    const szRaw: string = wmlAttribute(element, 'sz');
    let widthPoints: number = 0.5;
    if (szRaw !== undefined) {
        if (!/^\d+$/.test(szRaw)) {
            return undefined;
        }
        const eighths: number = Number.parseInt(szRaw, 10);
        widthPoints = eighths / 8;
        if (widthPoints < 0.25 || widthPoints > 12) {
            return undefined;
        }
    }
    const spaceRaw: string = wmlAttribute(element, 'space');
    let offsetPoints: number = 0;
    if (spaceRaw !== undefined) {
        if (!/^\d+$/.test(spaceRaw)) {
            return undefined;
        }
        offsetPoints = Number.parseInt(spaceRaw, 10);
        if (offsetPoints < 0 || offsetPoints > 31) {
            return undefined;
        }
    }
    const color: string = ((ts335 = wmlAttribute(element, 'color')), ts335 != null
        ? ts335
        : 'auto');
    return { style, widthPoints, offsetPoints, color };
}

function parsePageBorders(element: OpenXmlElement): ParsedPageBorders | undefined {
    const displayRaw: string = wmlAttribute(element, 'display');
    let applyTo: ParsedPageBorders['applyTo'] = 'allPages';
    if (displayRaw !== undefined) {
        if (
            displayRaw !== 'allPages' &&
            displayRaw !== 'firstPage' &&
            displayRaw !== 'notFirstPage'
        ) {
            return undefined;
        }
        applyTo = displayRaw;
    }
    const offsetRaw: string = wmlAttribute(element, 'offsetFrom');
    let measureFrom: ParsedPageBorders['measureFrom'] = 'text';
    if (offsetRaw !== undefined) {
        if (offsetRaw !== 'text' && offsetRaw !== 'page') {
            return undefined;
        }
        measureFrom = offsetRaw;
    }
    const zRaw: string = wmlAttribute(element, 'zOrder');
    let zOrder: ParsedPageBorders['zOrder'] = 'front';
    if (zRaw !== undefined) {
        if (zRaw !== 'front' && zRaw !== 'back') {
            return undefined;
        }
        zOrder = zRaw;
    }
    let top: ParsedPageBorder | undefined;
    let left: ParsedPageBorder | undefined;
    let bottom: ParsedPageBorder | undefined;
    let right: ParsedPageBorder | undefined;
    for (const child of elementChildren(element)) {
        if (isWml(child, 'top')) {
            top = parsePageBorderEdge(child);
            if (top === undefined) {
                return undefined;
            }
            continue;
        }
        if (isWml(child, 'left')) {
            left = parsePageBorderEdge(child);
            if (left === undefined) {
                return undefined;
            }
            continue;
        }
        if (isWml(child, 'bottom')) {
            bottom = parsePageBorderEdge(child);
            if (bottom === undefined) {
                return undefined;
            }
            continue;
        }
        if (isWml(child, 'right')) {
            right = parsePageBorderEdge(child);
            if (right === undefined) {
                return undefined;
            }
            continue;
        }
        // Unmodeled child (e.g. tl2br) → keep whole element opaque
        return undefined;
    }
    return { applyTo, measureFrom, zOrder, top, left, bottom, right };
}

function parseVerticalAlignment(
    element: OpenXmlElement
): SectionVerticalAlignment | undefined {
    const val: string = wValAttribute(element);
    if (val === 'top' || val === 'center' || val === 'both' || val === 'bottom') {
        return val;
    }
    return undefined;
}

/**
 * Parse `w:sectPr` into a live {@link PageSetup}.
 *
 * @param {OpenXmlElement | undefined} element - The element.
 * @returns {PageSetup | undefined} The result.
 * @private
 */
export function parseSectionProperties(
    element: OpenXmlElement | undefined
): PageSetup | undefined {
    if (element === undefined || !isWml(element, 'sectPr')) {
        return undefined;
    }
    const prefix: OpenXmlElement[] = [];
    const suffix: OpenXmlElement[] = [];
    const headerFooterReferences: HeaderFooterReference[] = [];
    let breakCode: SectionBreakCode | undefined;
    let pageWidth: number | undefined;
    let pageHeight: number | undefined;
    let orientation: PageOrientation | undefined;
    let marginLeft: number | undefined;
    let marginTop: number | undefined;
    let marginRight: number | undefined;
    let marginBottom: number | undefined;
    let headerDistance: number | undefined;
    let footerDistance: number | undefined;
    let gutter: number | undefined;
    let paperSource: PaperSource | undefined;
    let pageBorders: ParsedPageBorders | undefined;
    let lineNumbering: LineNumbering | undefined;
    let pageStartingNumber: number | undefined;
    let restartPageNumbering: boolean | undefined;
    let pageNumberStyle: PageNumberStyle | undefined;
    let chapterNumbering: ChapterNumbering | undefined;
    let pageNumberingPresent: boolean | undefined;
    let columns: ColumnCollection | undefined;
    let verticalAlignment: SectionVerticalAlignment | undefined;
    let bidi: boolean | undefined;
    let differentFirstPage: boolean = false;
    let seenModeled: boolean = false;

    for (const child of elementChildren(element)) {
        const ref: HeaderFooterReference = parseHeaderFooterReference(child);
        if (ref !== undefined) {
            headerFooterReferences.push(ref);
            continue;
        }
        if (isWml(child, 'type') && breakCode === undefined) {
            const parsed: SectionMarkWire = parseSectionMarkWire(child);
            if (parsed !== undefined) {
                breakCode = wireToBreakCode(parsed === 'newPage' ? undefined : parsed);
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'pgSz') && pageWidth === undefined) {
            const parsed: { width: number; height: number; orientation?: PageOrientation; } = parsePageSizeFields(child);
            if (parsed !== undefined) {
                pageWidth = parsed.width;
                pageHeight = parsed.height;
                orientation = parsed.orientation;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'pgMar') && marginLeft === undefined) {
            const parsed: { left: number; top: number; right: number; bottom: number; header: number; footer: number; gutter: number } =
                parsePageMarginFields(child);
            if (parsed !== undefined) {
                marginLeft = parsed.left;
                marginTop = parsed.top;
                marginRight = parsed.right;
                marginBottom = parsed.bottom;
                headerDistance = parsed.header;
                footerDistance = parsed.footer;
                gutter = parsed.gutter;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'paperSrc') && paperSource === undefined) {
            const parsed: PaperSource = parsePaperSource(child);
            if (parsed !== undefined) {
                paperSource = parsed;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'pgBorders') && pageBorders === undefined) {
            const parsed: ParsedPageBorders = parsePageBorders(child);
            if (parsed !== undefined) {
                pageBorders = parsed;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'lnNumType') && lineNumbering === undefined) {
            const parsed: LineNumbering = parseLineNumbering(child);
            if (parsed !== undefined) {
                lineNumbering = parsed;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'pgNumType') && pageNumberingPresent === undefined) {
            const parsed: {
                pageStartingNumber?: number;
                restartPageNumbering?: boolean;
                pageNumberStyle: PageNumberStyle;
                chapterNumbering?: ChapterNumbering;
                pageNumberingPresent: true;
            } = parsePageNumberingFields(child);
            if (parsed !== undefined) {
                pageStartingNumber = parsed.pageStartingNumber;
                restartPageNumbering = parsed.restartPageNumbering;
                pageNumberStyle = parsed.pageNumberStyle;
                chapterNumbering = parsed.chapterNumbering;
                pageNumberingPresent = true;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'cols') && columns === undefined) {
            const parsed: ColumnCollection = parseTextColumns(child);
            if (parsed !== undefined) {
                columns = parsed;
                seenModeled = true;
                continue;
            }
            // default single-column or failed parse of known empty defaults
            const numRaw: string = wmlAttribute(child, 'num');
            const spaceRaw: string = wmlAttribute(child, 'space');
            const equalRaw: string = wmlAttribute(child, 'equalWidth');
            const sepRaw: string = wmlAttribute(child, 'sep');
            const looksDefault: boolean =
                (numRaw === undefined || numRaw === '1') &&
                (spaceRaw === undefined ||
                    spaceRaw === String(pointToTwips(DEFAULT_COLUMN_SPACE))) &&
                (equalRaw === undefined || parseOnOffAttribute(equalRaw) === true) &&
                (sepRaw === undefined || parseOnOffAttribute(sepRaw) === false) &&
                elementChildren(child).length === 0;
            if (looksDefault) {
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'vAlign') && verticalAlignment === undefined) {
            const parsed: SectionVerticalAlignment = parseVerticalAlignment(child);
            if (parsed !== undefined) {
                verticalAlignment = parsed === 'top' ? undefined : parsed;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'bidi') && bidi === undefined) {
            const flag: boolean = parseOnOff(child);
            if (flag === true || flag === false) {
                bidi = flag === true;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (isWml(child, 'titlePg')) {
            const flag: boolean = parseOnOff(child);
            if (flag === true) {
                differentFirstPage = true;
                seenModeled = true;
                continue;
            }
            if (flag === false) {
                differentFirstPage = false;
                seenModeled = true;
                continue;
            }
            if (!seenModeled) {
                prefix.push(child);
            } else {
                suffix.push(child);
            }
            continue;
        }
        if (!seenModeled) {
            prefix.push(child);
        } else {
            suffix.push(child);
        }
    }

    return PageSetup.createFromParsedValues({
        attributes: element.attributes,
        prefix,
        suffix,
        headerFooterReferences,
        breakCode,
        pageWidth: pageWidth !== undefined ? pageWidth : LETTER_WIDTH,
        pageHeight: pageHeight !== undefined ? pageHeight : LETTER_HEIGHT,
        orientation,
        marginLeft: marginLeft !== undefined ? marginLeft : DEFAULT_MARGIN,
        marginTop: marginTop !== undefined ? marginTop : DEFAULT_MARGIN,
        marginRight: marginRight !== undefined ? marginRight : DEFAULT_MARGIN,
        marginBottom: marginBottom !== undefined ? marginBottom : DEFAULT_MARGIN,
        headerDistance:
            headerDistance !== undefined
                ? headerDistance
                : DEFAULT_HEADER_FOOTER_DISTANCE,
        footerDistance:
            footerDistance !== undefined
                ? footerDistance
                : DEFAULT_HEADER_FOOTER_DISTANCE,
        gutter: gutter !== undefined ? gutter : DEFAULT_GUTTER,
        paperSource,
        pageBorders,
        lineNumbering,
        pageStartingNumber,
        restartPageNumbering,
        pageNumberStyle,
        chapterNumbering,
        pageNumberingPresent,
        columns,
        verticalAlignment,
        bidi,
        differentFirstPage
    });
}

/**
 * Enable line numbering on every line (`w:lnNumType/@w:countBy="1"`).
 *
 * Sets {@link PageSetup.lineNumberingStep} to `1` (and marks line numbering present).
 *
 * @param {PageSetup} setup - The setup.
 * @returns {void} Nothing is returned.
 * @private
 */
export function everyLineNumbers(setup: PageSetup): void {
    setup.lineNumberingStep = 1;
}

/**
 * `true` when the section has no explicit reference for the target slot (inherits).
 *
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterTarget} target - The target.
 * @returns {boolean} The result.
 * @private
 */
export function inheritsFromPrevious(
    section: PageSetup,
    target: HeaderFooterTarget
): boolean {
    return section.headerFooterReferenceId(target) === undefined;
}

/**
 * Stop inheriting a header/footer slot by creating an empty part and reference.
 * Requires the headers-footers feature and a document-associated page setup.
 *
 * @param {PageSetup} section - The section.
 * @param {HeaderFooterTarget} target - The target.
 * @returns {Promise<void>} The result.
 * @private
 */
export async function unlinkFromPrevious(
    section: PageSetup,
    target: HeaderFooterTarget
): Promise<void> {
    if (!isFeatureRegistered(HEADERS_FOOTERS_FEATURE_ID)) {
        throw sectionsError(
            'unlinkFromPrevious requires the headers-footers feature (import @syncfusion/ej2-docx/headers-footers)'
        );
    }
    const document: WordDocument = ownerDocumentOf(section);
    if (document === undefined) {
        throw sectionsError(
            'unlinkFromPrevious requires section properties associated with a document'
        );
    }
    // headers-footers installs its writer when it registers, so sections never imports that optional module.
    const hf: SectionHeaderFooterTextWriter | undefined = installedSectionHeaderFooterTextWriter();
    if (hf === undefined) {
        throw sectionsError(
            'unlinkFromPrevious requires the headers-footers feature (import @syncfusion/ej2-docx/headers-footers)'
        );
    }
    if (target.kind === 'header') {
        hf.setSectionHeader(document, section, '', target.refType);
    } else {
        hf.setSectionFooter(document, section, '', target.refType);
    }
}

let registered: boolean = false;
/** Original `WordDocument.create` before sections feature wraps it. */
let originalDocumentCreate: (() => WordDocument) | undefined;

/**
 * Seed a live default letter {@link PageSetup} on every new document
 * while the sections feature is registered.
 *
 * @returns {void} Nothing is returned.
 */
function wrapDocumentCreate(): void {
    if (originalDocumentCreate !== undefined) {
        return;
    }
    originalDocumentCreate = WordDocument.create.bind(WordDocument);
    WordDocument.create = (): WordDocument => {
        const document: WordDocument = (originalDocumentCreate as () => WordDocument)();
        const props: PageSetup = defaultLetterPageSetup();
        associatePageSetupDocument(props, document);
        document.replaceFinalSectionPropertiesModel(props);
        return document;
    };
}

function unwrapDocumentCreate(): void {
    if (originalDocumentCreate === undefined) {
        return;
    }
    WordDocument.create = originalDocumentCreate;
    originalDocumentCreate = undefined;
}

function requirePageSetup(section: Section): PageSetup {
    const model: DocPageSetup = section.pageSetup;
    if (model instanceof PageSetup) {
        return model;
    }
    const seeded: PageSetup = defaultLetterPageSetup();
    const document: WordDocument = section.owningDocument();
    associatePageSetupDocument(seeded, document);
    section.setPageSetup(seeded);
    return seeded;
}

function installSectionPageSetupAccessors(): void {
    const proto: Section & {
        breakCode: SectionBreakCode;
        columns: ColumnCollection;
        addColumn: (width: number, spacing?: number) => Column;
    } = Section.prototype as Section & {
        breakCode: SectionBreakCode;
        columns: ColumnCollection;
        addColumn: (width: number, spacing?: number) => Column;
    };

    Object.defineProperty(proto, 'breakCode', {
        configurable: true,
        enumerable: true,
        get(): SectionBreakCode {
            return requirePageSetup(this as Section).breakCode;
        },
        set(value: SectionBreakCode): void {
            requirePageSetup(this as Section).breakCode = value;
        }
    });

    Object.defineProperty(proto, 'columns', {
        configurable: true,
        enumerable: true,
        get(): ColumnCollection {
            return requirePageSetup(this as Section).columns;
        }
    });

    Object.defineProperty(proto, 'addColumn', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: function addColumn(this: Section, width: number, spacing?: number): Column {
            return requirePageSetup(this).columns.add(width, spacing);
        }
    });
}

/**
 * @returns {void} Nothing is returned.
 * @private
 * Test hook
 */
export function resetSectionsFeatureForTests(): void {
    registered = false;
    unwrapDocumentCreate();
    resetSectionPageSetupCloneForTests();
    resetSectionPageSetupSeedForTests();
    resetSectionPropertiesParseForTests();
    resetSectionPropertiesAttachedForTests();
    try {
        // Allow re-install of the public sectionBreak facade on next register.
        delete (Paragraph.prototype as { sectionBreak?: unknown }).sectionBreak;
    } catch {
        // Ignore non-configurable leftovers in exotic hosts.
    }
}
/**
 * Install public `Paragraph.sectionBreak` get/set bridging dual-hold helpers.
 * Idempotent when the accessor is already present.
 *
 * @returns {void} Nothing is returned.
 */
function installParagraphSectionBreakFacade(): void {
    const existing: PropertyDescriptor = Object.getOwnPropertyDescriptor(Paragraph.prototype, 'sectionBreak');
    if (existing !== undefined && (existing.get !== undefined || existing.set !== undefined)) {
        return;
    }
    Object.defineProperty(Paragraph.prototype, 'sectionBreak', {
        configurable: true,
        enumerable: true,
        get(this: Paragraph): PageSetup | undefined {
            return paragraphSectionBreak(this);
        },
        set(this: Paragraph, value: PageSetup | undefined): void {
            setParagraphSectionBreak(this, value);
        }
    });
}

/**
 * @returns {void} Nothing is returned.
 * @private
 * Register the sections feature. Idempotent.
 */
export function registerSectionsFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: SECTIONS });
    wrapDocumentCreate();
    installSectionPageSetupAccessors();
    installParagraphSectionBreakFacade();
    registerSectionPropertiesParse((element: OpenXmlElement) => parseSectionProperties(element));
    registerSectionPropertiesAttached((model: SectionPropertiesModel, document: WordDocument) => {
        if (model instanceof PageSetup) {
            associatePageSetupDocument(model, document);
        }
    });
    registerSectionPageSetupClone((source: SectionPropertiesModel) => {
        if (!(source instanceof PageSetup)) {
            throw new TypeError('Expected PageSetup');
        }
        return source.cloneDeep();
    });
    registerSectionPageSetupSeed(() => defaultLetterPageSetup());
}

function isPageSetupModel(value: unknown): value is PageSetup {
    return value instanceof PageSetup;
}

/**
 * Ensure body-final section properties are held as a live {@link PageSetup}
 * object (parse once from preserved OOXML when needed).
 *
 * @param {WordDocument} document - The document.
 * @returns {PageSetup | undefined} The result.
 */
function ensureFinalSectionModel(document: WordDocument): PageSetup | undefined {
    const held: SectionPropertiesModel = document.finalSectionPropertiesModel();
    if (isPageSetupModel(held)) {
        associatePageSetupDocument(held, document);
        return held;
    }
    const raw: OpenXmlElement = document.bodySectPr();
    if (raw === undefined) {
        return undefined;
    }
    const props: PageSetup = parseSectionProperties(raw);
    if (props === undefined) {
        return undefined;
    }
    associatePageSetupDocument(props, document);
    document.replaceFinalSectionPropertiesModel(props);
    return props;
}

/**
 * Ensure paragraph section-break properties are held as a live object when present.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {PageSetup | undefined} The result.
 */
function ensureParagraphSectionBreakModel(paragraph: Paragraph): PageSetup | undefined {
    const held: { toOpenXml(): OpenXmlElement; } = paragraph.sectionBreakPropertiesModel();
    if (isPageSetupModel(held)) {
        associatePageSetupDocument(held, paragraph.owningDocument());
        return held;
    }
    const raw: OpenXmlElement = paragraph.sectionBreakSectPr();
    if (raw === undefined) {
        return undefined;
    }
    const props: PageSetup = parseSectionProperties(raw);
    if (props === undefined) {
        return undefined;
    }
    associatePageSetupDocument(props, paragraph.owningDocument());
    paragraph.replaceSectionBreakPropertiesModel(props);
    return props;
}

/**
 * Body-final section properties (`w:body/w:sectPr`).
 *
 * Returns the same object identity across calls once materialised.
 *
 * @param {WordDocument} document - The document.
 * @returns {PageSetup | undefined} The result.
 * @private
 */
export function finalSection(document: WordDocument): PageSetup | undefined {
    return ensureFinalSectionModel(document);
}

/**
 * Replace body-final section properties.
 *
 * @param {WordDocument} document - The document.
 * @param {PageSetup} properties - The properties.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setFinalSection(document: WordDocument, properties: PageSetup): void {
    associatePageSetupDocument(properties, document);
    document.replaceFinalSectionPropertiesModel(properties);
}

/**
 * Paragraph section-break properties (`w:pPr/w:sectPr`), when present.
 *
 * Returns the same object identity across calls once materialised.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {PageSetup | undefined} The result.
 * @private
 */
export function paragraphSectionBreak(paragraph: Paragraph): PageSetup | undefined {
    return ensureParagraphSectionBreakModel(paragraph);
}

/**
 * Set or clear paragraph section-break properties (`w:pPr/w:sectPr`).
 *
 * After dual-hold update, repartitions {@link Document.sections} so non-final
 * pageSetup lives on its own section and flatten emits mid-body + body-final
 * `w:sectPr` (TASK-8075/8076 authoring path).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {PageSetup | undefined} properties - The properties.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setParagraphSectionBreak(
    paragraph: Paragraph,
    properties: PageSetup | undefined
): void {
    const document: WordDocument = paragraph.owningDocument();
    if (properties !== undefined) {
        associatePageSetupDocument(properties, document);
        paragraph.replaceSectionBreakPropertiesModel(properties);
    } else {
        paragraph.replaceSectionBreakPropertiesModel(undefined);
        paragraph.replaceSectionBreakSectPr(undefined);
    }
    // Rebuild Document.sections so dual-hold authoring matches load partition
    // (non-final pageSetup on its own section; flatten emits mid-body sectPr).
    document.repartitionFromBodyBlocks();
}

/**
 * Body-final properties for internal authoring bridges. Seeds a default letter
 * page setup when none is present so flatten/serialize always has live
 * {@link PageSetup} while the sections feature is registered.
 *
 * @param {WordDocument} document - The document.
 * @returns {PageSetup} The result.
 * @private
 */
export function ensureFinalSectionProperties(document: WordDocument): PageSetup {
    const existing: PageSetup = ensureFinalSectionModel(document);
    if (existing !== undefined) {
        return existing;
    }
    const seeded: PageSetup = defaultLetterPageSetup();
    associatePageSetupDocument(seeded, document);
    document.replaceFinalSectionPropertiesModel(seeded);
    return seeded;
}

registerAlwaysOnBodyFeatureBootstrap(() => {
    registerSectionsFeature();
});
registerSectionsFeature();
