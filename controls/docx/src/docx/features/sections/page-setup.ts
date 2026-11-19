import {
    BorderStyle,
    LineNumberingMode,
    PageBorderOffsetFrom,
    PageBordersApplyType,
    PageOrientation,
    PageNumberStyle,
    PageSetup as PageSetupContract,
    PrinterPaperTray,
    SizeF,
    VerticalAlignment,
    PageBorder as PageBorderContract,
    PageBorders as PageBordersContract
} from '../document/page-setup';
import { Color, colorFromWire, colorToHexWire } from '../document/color';
import { SectionPropertiesModel } from '../document/section-properties-model';
import { pointToTwips } from '../document/length';
import { serializeOnOff } from '../document/on-off';
import { wmlAttr, wmlElement } from '../document/wml';
import { featureId, isFeatureRegistered } from '../../core/registry/index';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { ColumnCollection } from './column-collection';
import { Margins } from './margins';
import { PageSize } from './page-size';
import { breakCodeToWire, SectionBreakCode, SectionMarkWire } from './section-break-code';
import { ownerDocumentOf } from './section-document-association';
import {
    sectionsError,
    validatePageNumberStyle,
    validatePageOrientation,
    validatePositiveInteger,
    validateSectionBreakCode,
    validateSectionLength,
    validateNonNegativeInteger
} from './section-validation';
import { Column } from './column';
import { WordDocument, FeaturePartState } from '../document/document';

// Re-export public contracts consumed alongside the live PageSetup class.
export {
    BorderStyle,
    LineNumberingMode,
    PageBorderOffsetFrom,
    PageBordersApplyType,
    PageOrientation,
    PageNumberStyle,
    PrinterPaperTray,
    SizeF,
    VerticalAlignment
};

/**
 * @deprecated Prefer {@link VerticalAlignment}. Kept for internal parse bags.
 *  Internal parse alias. Not part of the public API.
 *
 * @private
 */
export type SectionVerticalAlignment = VerticalAlignment | 'top' | 'center' | 'both' | 'bottom';

/** Office WordDocument relationships namespace for `r:id` on `CT_Rel`. */
const RELATIONSHIPS_OFFICE_NS: string =
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const SETTINGS_FEATURE_ID: string = 'settings';

/** Header or footer reference type (`ST_HdrFtr`) — wire tokens until odd rename. */
export type HeaderFooterReferenceType = 'default' | 'first' | 'even';

/**
 * Where a header/footer target lives.
 *
 * @private
 */
export interface HeaderFooterTarget {
    readonly kind: 'header' | 'footer';
    readonly refType: HeaderFooterReferenceType;
}

/**
 * Section link to a header or footer part (`CT_HdrFtrRef`).
 *
 * @private
 */
export interface HeaderFooterReference extends HeaderFooterTarget {
    readonly relationshipId: string;
}

/**
 * When line numbers restart counting (`ST_LineNumberRestart`).
 *
 * @private
 */
export type LineNumberRestart = 'newPage' | 'newSection' | 'continuous';

/**
 * Parse bag for line numbering (`w:lnNumType` / `CT_LineNumber`).
 *
 * @private
 */
export interface LineNumbering {
    readonly countBy: number;
    readonly restart?: LineNumberRestart | undefined;
    readonly startAt?: number | undefined;
    readonly distanceFromText?: number | undefined;
}

/**
 * Chapter-page numbering options (`w:pgNumType` chapter group).
 *
 * @private
 */
export interface ChapterNumbering {
    readonly headingLevel: number;
    readonly separator: 'hyphen' | 'period' | 'colon' | 'emDash' | 'enDash';
}

/**
 * Parse bag for printer trays (`w:paperSrc` / `CT_PaperSource`).
 *
 * @private
 */
export interface PaperSource {
    readonly firstPageTray?: number | undefined;
    readonly otherPagesTray?: number | undefined;
}

/**
 * Line style subset for page borders (parse bag).
 *
 * @private
 */
export type PageBorderStyle =
    | 'nil'
    | 'none'
    | 'single'
    | 'thick'
    | 'double'
    | 'dotted'
    | 'dashed'
    | 'dotDash'
    | 'dotDotDash'
    | 'triple'
    | 'thinThickSmallGap'
    | 'thickThinSmallGap'
    | 'thinThickThinSmallGap'
    | 'thinThickMediumGap'
    | 'thickThinMediumGap'
    | 'thinThickThinMediumGap'
    | 'thinThickLargeGap'
    | 'thickThinLargeGap'
    | 'thinThickThinLargeGap'
    | 'wave'
    | 'doubleWave'
    | 'dashSmallGap'
    | 'dashDotStroked'
    | 'threeDEmboss'
    | 'threeDEngrave'
    | 'outset'
    | 'inset';

/**
 * One page-border edge parse bag.
 *
 * @private
 */
export interface ParsedPageBorder {
    readonly style: PageBorderStyle;
    readonly widthPoints: number;
    readonly offsetPoints: number;
    readonly color: string;
}

/**
 * Page border frame parse bag (`CT_PageBorders`).
 *
 * @private
 */
export interface ParsedPageBorders {
    readonly applyTo: 'allPages' | 'firstPage' | 'notFirstPage';
    readonly measureFrom: 'text' | 'page';
    readonly zOrder: 'front' | 'back';
    readonly top?: ParsedPageBorder | undefined;
    readonly left?: ParsedPageBorder | undefined;
    readonly bottom?: ParsedPageBorder | undefined;
    readonly right?: ParsedPageBorder | undefined;
}

/**
 * Values applied atomically by {@link PageSetup.createFromParsedValues}.
 *
 * @private
 */
export interface PageSetupParsedValues {
    readonly attributes?: ReadonlyArray<OpenXmlAttribute>;
    readonly prefix?: ReadonlyArray<OpenXmlElement>;
    readonly suffix?: ReadonlyArray<OpenXmlElement>;
    readonly headerFooterReferences?: ReadonlyArray<HeaderFooterReference>;
    readonly breakCode?: SectionBreakCode;
    readonly pageWidth: number;
    readonly pageHeight: number;
    readonly orientation?: PageOrientation;
    readonly marginLeft: number;
    readonly marginTop: number;
    readonly marginRight: number;
    readonly marginBottom: number;
    readonly headerDistance?: number;
    readonly footerDistance?: number;
    readonly gutter?: number;
    readonly paperSource?: PaperSource;
    readonly pageBorders?: ParsedPageBorders;
    readonly lineNumbering?: LineNumbering;
    readonly pageStartingNumber?: number;
    readonly restartPageNumbering?: boolean;
    readonly pageNumberStyle?: PageNumberStyle;
    readonly chapterNumbering?: ChapterNumbering;
    readonly columns?: ColumnCollection;
    readonly verticalAlignment?: VerticalAlignment | SectionVerticalAlignment;
    readonly bidi?: boolean;
    readonly differentFirstPage?: boolean;
    readonly pageNumberingPresent?: boolean;
}

const BORDER_STYLE_VALUES: ReadonlySet<string> = new Set<string>([
    BorderStyle.Nil,
    BorderStyle.None,
    BorderStyle.Single,
    BorderStyle.Thick,
    BorderStyle.Double,
    BorderStyle.Dotted,
    BorderStyle.Dashed,
    BorderStyle.DotDash,
    BorderStyle.DotDotDash,
    BorderStyle.Triple,
    BorderStyle.ThinThickSmallGap,
    BorderStyle.ThickThinSmallGap,
    BorderStyle.ThinThickThinSmallGap,
    BorderStyle.ThinThickMediumGap,
    BorderStyle.ThickThinMediumGap,
    BorderStyle.ThinThickThinMediumGap,
    BorderStyle.ThinThickLargeGap,
    BorderStyle.ThickThinLargeGap,
    BorderStyle.ThinThickThinLargeGap,
    BorderStyle.Wave,
    BorderStyle.DoubleWave,
    BorderStyle.DashSmallGap,
    BorderStyle.DashDotStroked,
    BorderStyle.ThreeDEmboss,
    BorderStyle.ThreeDEngrave,
    BorderStyle.Outset,
    BorderStyle.Inset
]);

/**
 * Live page-border edge — public surface is {@link space} only.
 *
 * @public
 */
export class PageBorder implements PageBorderContract {
    private spaceValue: number;
    private styleValue: BorderStyle;
    private colorWireValue: string;
    private widthPointsValue: number;

    /**
     * @private
     */
    constructor() {
        this.spaceValue = 0;
        this.styleValue = BorderStyle.None;
        this.colorWireValue = 'auto';
        this.widthPointsValue = 0.5;
    }

    get space(): number {
        return this.spaceValue;
    }

    set space(value: number) {
        if (!Number.isInteger(value) || value < 0 || value > 31) {
            throw sectionsError('borders.space must be an integer in 0…31');
        }
        this.spaceValue = value;
    }

    /**
     * @private
     */
    get style(): BorderStyle {
        return this.styleValue;
    }

    /**
     * @private
     */
    get colorWire(): string {
        return this.colorWireValue;
    }

    /**
     * @private
     */
    get widthPoints(): number {
        return this.widthPointsValue;
    }

    /**
     * @param {BorderStyle} style - The style.
     * @param {string} colorWire - The color wire.
     * @param {number} widthPoints - The width points.
     * @returns {void} Nothing is returned.
     * @private
     */
    applyCommon(style: BorderStyle, colorWire: string, widthPoints: number): void {
        this.styleValue = style;
        this.colorWireValue = colorWire;
        this.widthPointsValue = widthPoints;
    }

    /**
     * @param {ParsedPageBorder} edge - The edge.
     * @returns {void} Nothing is returned.
     * @private
     */
    loadFromParsed(edge: ParsedPageBorder): void {
        this.styleValue = borderStyleFromWire(edge.style);
        this.colorWireValue = edge.color;
        this.widthPointsValue = edge.widthPoints;
        this.spaceValue = Math.round(edge.offsetPoints);
    }

    /**
     * @returns {ParsedPageBorder | undefined} The result.
     * @private
     */
    toParsed(): ParsedPageBorder | undefined {
        if (!isActiveBorderStyle(this.styleValue)) {
            return undefined;
        }
        return {
            style: this.styleValue as string as PageBorderStyle,
            widthPoints: this.widthPointsValue,
            offsetPoints: this.spaceValue,
            color: this.colorWireValue
        };
    }

    /**
     * @param {PageBorder} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     */
    cloneInto(target: PageBorder): void {
        target.spaceValue = this.spaceValue;
        target.styleValue = this.styleValue;
        target.colorWireValue = this.colorWireValue;
        target.widthPointsValue = this.widthPointsValue;
    }
}

/**
 * Live page borders — common style/color/width plus four edges.
 *
 * @public
 */
export class PageBorders implements PageBordersContract {
    private borderTypeValue: BorderStyle;
    private colorPublicValue: Color;
    /** Wire color when the public Color cannot express the loaded token. */
    private colorWireOverride: string | undefined;
    private lineWidthValue: number;
    private readonly topEdge: PageBorder;
    private readonly bottomEdge: PageBorder;
    private readonly leftEdge: PageBorder;
    private readonly rightEdge: PageBorder;
    private applyToValue: ParsedPageBorders['applyTo'];
    private measureFromValue: ParsedPageBorders['measureFrom'];
    private zOrderValue: ParsedPageBorders['zOrder'];

    /**
     * @private
     */
    constructor() {
        this.borderTypeValue = BorderStyle.None;
        this.colorPublicValue = Color.Black;
        this.colorWireOverride = undefined;
        this.lineWidthValue = 0.5;
        this.topEdge = new PageBorder();
        this.bottomEdge = new PageBorder();
        this.leftEdge = new PageBorder();
        this.rightEdge = new PageBorder();
        this.applyToValue = 'allPages';
        this.measureFromValue = 'text';
        this.zOrderValue = 'front';
    }

    get borderType(): BorderStyle {
        return this.borderTypeValue;
    }

    set borderType(value: BorderStyle) {
        this.borderTypeValue = validateBorderStyle(value, 'borders.borderType');
        this.stampCommonToEdges();
    }

    get color(): Color {
        return this.colorPublicValue;
    }

    set color(value: Color) {
        // eslint-disable-next-line security/detect-object-injection -- numeric enum reverse-mapping lookup; value is already verified to be a number
        if (typeof value !== 'number' || Color[value] === undefined) {
            throw sectionsError('borders.color must be a Color enum value');
        }
        this.colorPublicValue = value;
        this.colorWireOverride = undefined;
        this.stampCommonToEdges();
    }

    get lineWidth(): number {
        return this.lineWidthValue;
    }

    set lineWidth(value: number) {
        this.lineWidthValue = validateBorderWidth(value, 'borders.lineWidth');
        this.stampCommonToEdges();
    }

    get top(): PageBorder {
        return this.topEdge;
    }

    get bottom(): PageBorder {
        return this.bottomEdge;
    }

    get left(): PageBorder {
        return this.leftEdge;
    }

    get right(): PageBorder {
        return this.rightEdge;
    }

    /**
     * @private
     */
    get applyTo(): ParsedPageBorders['applyTo'] {
        return this.applyToValue;
    }

    /**
     * @param {*} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setApplyTo(value: ParsedPageBorders['applyTo']): void {
        this.applyToValue = value;
    }

    /**
     * @private
     */
    get measureFrom(): ParsedPageBorders['measureFrom'] {
        return this.measureFromValue;
    }

    /**
     * @param {*} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setMeasureFrom(value: ParsedPageBorders['measureFrom']): void {
        this.measureFromValue = value;
    }

    /**
     * @private
     */
    get zOrder(): ParsedPageBorders['zOrder'] {
        return this.zOrderValue;
    }

    /**
     * @param {ParsedPageBorders} bag - The bag.
     * @returns {void} Nothing is returned.
     * @private
     */
    loadFromParsed(bag: ParsedPageBorders): void {
        this.applyToValue = bag.applyTo;
        this.measureFromValue = bag.measureFrom;
        this.zOrderValue = bag.zOrder;
        if (bag.top !== undefined) {
            this.topEdge.loadFromParsed(bag.top);
        }
        if (bag.left !== undefined) {
            this.leftEdge.loadFromParsed(bag.left);
        }
        if (bag.bottom !== undefined) {
            this.bottomEdge.loadFromParsed(bag.bottom);
        }
        if (bag.right !== undefined) {
            this.rightEdge.loadFromParsed(bag.right);
        }
        const ref: ParsedPageBorder =
            bag.top !== undefined
                ? bag.top
                : bag.left !== undefined
                    ? bag.left
                    : bag.bottom !== undefined
                        ? bag.bottom
                        : bag.right;
        if (ref !== undefined) {
            this.borderTypeValue = borderStyleFromWire(ref.style);
            const mapped: Color = colorFromWire(ref.color);
            if (mapped !== undefined) {
                this.colorPublicValue = mapped;
                this.colorWireOverride = undefined;
            } else {
                this.colorPublicValue = Color.Black;
                this.colorWireOverride = ref.color;
            }
            this.lineWidthValue = ref.widthPoints;
        }
    }

    /**
     * @returns {ParsedPageBorders | undefined} The result.
     * @private
     */
    toParsed(): ParsedPageBorders | undefined {
        const top: ParsedPageBorder = this.topEdge.toParsed();
        const left: ParsedPageBorder = this.leftEdge.toParsed();
        const bottom: ParsedPageBorder = this.bottomEdge.toParsed();
        const right: ParsedPageBorder = this.rightEdge.toParsed();
        const hasEdge: boolean =
            top !== undefined ||
            left !== undefined ||
            bottom !== undefined ||
            right !== undefined;
        const hasContainerOpts: boolean =
            this.applyToValue !== 'allPages' ||
            this.measureFromValue !== 'text' ||
            this.zOrderValue !== 'front';
        if (!hasEdge && !hasContainerOpts) {
            return undefined;
        }
        return {
            applyTo: this.applyToValue,
            measureFrom: this.measureFromValue,
            zOrder: this.zOrderValue,
            top,
            left,
            bottom,
            right
        };
    }

    /**
     * @param {PageBorders} source - The source.
     * @returns {void} Nothing is returned.
     * @private
     */
    copyFrom(source: PageBorders): void {
        this.borderTypeValue = source.borderTypeValue;
        this.colorPublicValue = source.colorPublicValue;
        this.colorWireOverride = source.colorWireOverride;
        this.lineWidthValue = source.lineWidthValue;
        this.applyToValue = source.applyToValue;
        this.measureFromValue = source.measureFromValue;
        this.zOrderValue = source.zOrderValue;
        source.topEdge.cloneInto(this.topEdge);
        source.bottomEdge.cloneInto(this.bottomEdge);
        source.leftEdge.cloneInto(this.leftEdge);
        source.rightEdge.cloneInto(this.rightEdge);
    }

    private stampCommonToEdges(): void {
        const wire: string = this.resolveColorWire();
        this.topEdge.applyCommon(this.borderTypeValue, wire, this.lineWidthValue);
        this.bottomEdge.applyCommon(this.borderTypeValue, wire, this.lineWidthValue);
        this.leftEdge.applyCommon(this.borderTypeValue, wire, this.lineWidthValue);
        this.rightEdge.applyCommon(this.borderTypeValue, wire, this.lineWidthValue);
    }

    private resolveColorWire(): string {
        if (this.colorWireOverride !== undefined && this.colorWireOverride.length > 0) {
            return this.colorWireOverride;
        }
        if (this.colorPublicValue === Color.Transparent) {
            return 'auto';
        }
        const hex: string = colorToHexWire(this.colorPublicValue);
        return hex.length > 0 ? hex : 'auto';
    }
}

/**
 * Live section page setup (`CT_SectPr` model) — public surface per architecture §§4–12.
 *
 * Implements the core {@link PageSetupContract} public contract and internal
 * {@link SectionPropertiesModel} for dual-hold serialization.
 *
 * @public
 */
export class PageSetup implements PageSetupContract, SectionPropertiesModel {
    private attributes: ReadonlyArray<OpenXmlAttribute>;
    private prefix: OpenXmlElement[];
    private suffix: OpenXmlElement[];
    private headerFooterReferencesValue: HeaderFooterReference[];

    private breakCodeValue: SectionBreakCode;
    private readonly pageSizeValue: SizeF;
    private orientationValue: PageOrientation;
    private readonly marginsValue: Margins;
    private headerDistanceValue: number;
    private footerDistanceValue: number;
    private gutterValue: number;

    private firstPageTrayValue: number | undefined;
    private otherPagesTrayValue: number | undefined;
    private paperSourcePresent: boolean;

    private readonly bordersValue: PageBorders;

    private lineNumberingPresent: boolean;
    private lineNumberingDistanceFromTextValue: number;
    private lineNumberingModeValue: LineNumberingMode;
    private lineNumberingStartValueValue: number;
    private lineNumberingStepValue: number;

    private pageStartingNumberValue: number;
    private restartPageNumberingValue: boolean;
    private pageNumberStyleValue: PageNumberStyle;
    private chapterNumberingValue: ChapterNumbering | undefined;
    /** True when `w:pgNumType` was present or numbering props were authored. */
    private pageNumberingPresent: boolean;

    private readonly columnsValue: ColumnCollection;
    private verticalAlignmentValue: VerticalAlignment;
    private bidiValue: boolean;
    private differentFirstPageValue: boolean;

    /**
     * @private
     */
    private constructor() {
        this.attributes = [];
        this.prefix = [];
        this.suffix = [];
        this.headerFooterReferencesValue = [];
        this.breakCodeValue = SectionBreakCode.NewPage;
        this.pageSizeValue = new SizeF(PageSize.Letter.width, PageSize.Letter.height);
        this.orientationValue = PageOrientation.Portrait;
        this.marginsValue = new Margins(72, 72, 72, 72);
        this.headerDistanceValue = 36;
        this.footerDistanceValue = 36;
        this.gutterValue = 0;
        this.firstPageTrayValue = undefined;
        this.otherPagesTrayValue = undefined;
        this.paperSourcePresent = false;
        this.bordersValue = new PageBorders();
        this.lineNumberingPresent = false;
        this.lineNumberingDistanceFromTextValue = 0;
        this.lineNumberingModeValue = LineNumberingMode.RestartPage;
        // Public API is one-based; OOXML `w:lnNumType/@w:start` is zero-based.
        this.lineNumberingStartValueValue = 1;
        this.lineNumberingStepValue = 1;
        this.pageStartingNumberValue = 1;
        this.restartPageNumberingValue = false;
        this.pageNumberStyleValue = PageNumberStyle.Arabic;
        this.chapterNumberingValue = undefined;
        this.pageNumberingPresent = false;
        this.columnsValue = new ColumnCollection();
        this.verticalAlignmentValue = VerticalAlignment.Top;
        this.bidiValue = false;
        this.differentFirstPageValue = false;

        this.pageSizeValue.setChangeListener((width: number, height: number): void => {
            validateSectionLength(width, 'pageSize.width');
            validateSectionLength(height, 'pageSize.height');
            this.orientationValue =
                (height as number) >= (width as number)
                    ? PageOrientation.Portrait
                    : PageOrientation.Landscape;
        });
    }

    /**
     * US Letter defaults (architecture § letter factory).
     *
     * @returns {PageSetup} The result.
     * @private
     */
    static createDefaultLetter(): PageSetup {
        return new PageSetup();
    }

    /**
     * Atomic load-path construction — does not call public setters in sequence
     * (avoids orientation last-write-wins side effects during parse).
     *
     * @param {PageSetupParsedValues} values - The values.
     * @returns {PageSetup} The result.
     * @private
     */
    static createFromParsedValues(values: PageSetupParsedValues): PageSetup {
        const setup: PageSetup = new PageSetup();
        if (values.attributes !== undefined) {
            setup.attributes = values.attributes.slice();
        }
        if (values.prefix !== undefined) {
            setup.prefix = values.prefix.slice();
        }
        if (values.suffix !== undefined) {
            setup.suffix = values.suffix.slice();
        }
        if (values.headerFooterReferences !== undefined) {
            setup.headerFooterReferencesValue = values.headerFooterReferences.slice();
        }
        if (values.breakCode !== undefined) {
            setup.breakCodeValue = values.breakCode;
        }

        validateSectionLength(values.pageWidth, 'pageSize.width');
        validateSectionLength(values.pageHeight, 'pageSize.height');
        setup.pageSizeValue.replace(values.pageWidth, values.pageHeight, false);
        if (values.orientation !== undefined) {
            setup.orientationValue = validatePageOrientation(values.orientation);
        } else {
            setup.orientationValue =
                (values.pageHeight as number) >= (values.pageWidth as number)
                    ? PageOrientation.Portrait
                    : PageOrientation.Landscape;
        }

        setup.marginsValue.replace(
            values.marginLeft,
            values.marginTop,
            values.marginRight,
            values.marginBottom
        );
        if (values.headerDistance !== undefined) {
            setup.headerDistanceValue = validateSectionLength(
                values.headerDistance,
                'headerDistance'
            );
        }
        if (values.footerDistance !== undefined) {
            setup.footerDistanceValue = validateSectionLength(
                values.footerDistance,
                'footerDistance'
            );
        }
        if (values.gutter !== undefined) {
            setup.gutterValue = validateSectionLength(values.gutter, 'gutter');
        }
        if (values.paperSource !== undefined) {
            const paper: PaperSource = assertPaperSource(values.paperSource);
            setup.firstPageTrayValue = paper.firstPageTray;
            setup.otherPagesTrayValue = paper.otherPagesTray;
            setup.paperSourcePresent =
                paper.firstPageTray !== undefined || paper.otherPagesTray !== undefined;
        }
        if (values.pageBorders !== undefined) {
            const bag: ParsedPageBorders = assertPageBorders(values.pageBorders);
            setup.bordersValue.loadFromParsed(bag);
        }
        if (values.lineNumbering !== undefined) {
            const ln: LineNumbering = assertLineNumbering(values.lineNumbering);
            setup.lineNumberingPresent = true;
            setup.lineNumberingStepValue = ln.countBy;
            setup.lineNumberingModeValue =
                ln.restart === undefined || ln.restart === 'newPage'
                    ? LineNumberingMode.RestartPage
                    : ln.restart === 'newSection'
                        ? LineNumberingMode.RestartSection
                        : LineNumberingMode.Continuous;
            // Parse bag `startAt` is wire (zero-based). Public API is one-based.
            // Absent `w:start` matches the schema default of 0 → API 1.
            setup.lineNumberingStartValueValue =
                ln.startAt !== undefined ? ln.startAt + 1 : 1;
            setup.lineNumberingDistanceFromTextValue =
                ln.distanceFromText !== undefined ? ln.distanceFromText : 0;
        }

        if (values.pageStartingNumber !== undefined) {
            setup.pageStartingNumberValue = validatePositiveInteger(
                values.pageStartingNumber,
                'pageStartingNumber'
            );
        }
        if (values.restartPageNumbering !== undefined) {
            setup.restartPageNumberingValue = values.restartPageNumbering === true;
        }
        if (values.pageNumberStyle !== undefined) {
            setup.pageNumberStyleValue = validatePageNumberStyle(values.pageNumberStyle);
        }
        if (values.chapterNumbering !== undefined) {
            setup.chapterNumberingValue = assertChapterNumbering(values.chapterNumbering);
        }
        if (
            values.pageNumberingPresent === true ||
            values.pageStartingNumber !== undefined ||
            values.restartPageNumbering === true ||
            values.pageNumberStyle !== undefined ||
            values.chapterNumbering !== undefined
        ) {
            setup.pageNumberingPresent = true;
        }

        if (values.columns !== undefined) {
            const src: ColumnCollection = values.columns;
            setup.columnsValue.replaceFromParsed({
                equalWidth: src.equalWidth,
                separator: src.separator,
                spacing: src.spacing,
                count: src.count,
                columns: Array.from(src).map((c: Column) => ({ width: c.width, space: c.spacing }))
            });
        }
        if (values.verticalAlignment !== undefined) {
            setup.verticalAlignmentValue = assertVerticalAlignment(values.verticalAlignment);
        }
        if (values.bidi !== undefined) {
            setup.bidiValue = values.bidi === true;
        }
        if (values.differentFirstPage !== undefined) {
            setup.differentFirstPageValue = values.differentFirstPage === true;
        }
        return setup;
    }

    /**
     * @returns {PageSetup} The result.
     * @private
     */
    cloneDeep(): PageSetup {
        const clone: PageSetup = PageSetup.createFromParsedValues({
            attributes: this.attributes,
            prefix: this.prefix,
            suffix: this.suffix,
            headerFooterReferences: this.headerFooterReferencesValue,
            breakCode: this.breakCodeValue,
            pageWidth: this.pageSizeValue.width,
            pageHeight: this.pageSizeValue.height,
            orientation: this.orientationValue,
            marginLeft: this.marginsValue.left,
            marginTop: this.marginsValue.top,
            marginRight: this.marginsValue.right,
            marginBottom: this.marginsValue.bottom,
            headerDistance: this.headerDistanceValue,
            footerDistance: this.footerDistanceValue,
            gutter: this.gutterValue,
            paperSource: this.snapshotPaperSource(),
            pageBorders: this.bordersValue.toParsed(),
            lineNumbering: this.snapshotLineNumbering(),
            pageStartingNumber: this.pageStartingNumberValue,
            restartPageNumbering: this.restartPageNumberingValue,
            pageNumberStyle: this.pageNumberStyleValue,
            chapterNumbering: this.chapterNumberingValue,
            bidi: this.bidiValue,
            pageNumberingPresent: this.pageNumberingPresent,
            columns: this.columnsValue.cloneDeep(),
            verticalAlignment: this.verticalAlignmentValue,
            differentFirstPage: this.differentFirstPageValue
        });
        // Preserve independent edge state when common props alone would not reconstruct it.
        clone.bordersValue.copyFrom(this.bordersValue);
        return clone;
    }

    // —— public surface ——

    /**
     * Page orientation. Setter swaps width/height only when needed (architecture §7).
     */
    get orientation(): PageOrientation {
        return this.orientationValue;
    }

    set orientation(value: PageOrientation) {
        const next: PageOrientation = validatePageOrientation(value);
        if (next === this.orientationValue) {
            return;
        }
        const w: number = this.pageSizeValue.width;
        const h: number = this.pageSizeValue.height;
        if (next === PageOrientation.Landscape) {
            if ((w as number) < (h as number)) {
                this.pageSizeValue.replace(h, w, false);
            }
        } else {
            if ((h as number) < (w as number)) {
                this.pageSizeValue.replace(h, w, false);
            }
        }
        this.orientationValue = next;
    }

    /**
     * Live page size (stable identity). Setter copies width/height and derives orientation.
     */
    get pageSize(): SizeF {
        return this.pageSizeValue;
    }

    set pageSize(value: SizeF) {
        if (value == null || typeof value.width !== 'number' || typeof value.height !== 'number') {
            throw sectionsError('pageSize must provide numeric width and height');
        }
        const width: number = validateSectionLength(value.width, 'pageSize.width');
        const height: number = validateSectionLength(value.height, 'pageSize.height');
        this.pageSizeValue.replace(width, height, true);
    }

    /**
     * Live margins instance (stable identity for the life of this PageSetup).
     */
    get margins(): Margins {
        return this.marginsValue;
    }

    /**
     * Distance from page top to header (`w:pgMar/@w:header`), points.
     */
    get headerDistance(): number {
        return this.headerDistanceValue;
    }

    set headerDistance(value: number) {
        this.headerDistanceValue = validateSectionLength(value, 'headerDistance');
    }

    /**
     * Distance from page bottom to footer (`w:pgMar/@w:footer`), points.
     */
    get footerDistance(): number {
        return this.footerDistanceValue;
    }

    set footerDistance(value: number) {
        this.footerDistanceValue = validateSectionLength(value, 'footerDistance');
    }

    /**
     * Live page borders (stable identity).
     */
    get borders(): PageBorders {
        return this.bordersValue;
    }

    /**
     * First-page printer tray (`w:paperSrc/@w:first`).
     */
    get firstPageTray(): PrinterPaperTray {
        return (this.firstPageTrayValue !== undefined
            ? this.firstPageTrayValue
            : PrinterPaperTray.DefaultBin) as PrinterPaperTray;
    }

    set firstPageTray(value: PrinterPaperTray) {
        this.firstPageTrayValue = validateNonNegativeInteger(
            value as number,
            'firstPageTray'
        );
        this.paperSourcePresent = true;
    }

    /**
     * Other-pages printer tray (`w:paperSrc/@w:other`).
     */
    get otherPagesTray(): PrinterPaperTray {
        return (this.otherPagesTrayValue !== undefined
            ? this.otherPagesTrayValue
            : PrinterPaperTray.DefaultBin) as PrinterPaperTray;
    }

    set otherPagesTray(value: PrinterPaperTray) {
        this.otherPagesTrayValue = validateNonNegativeInteger(
            value as number,
            'otherPagesTray'
        );
        this.paperSourcePresent = true;
    }

    /**
     * Different first page (`w:titlePg`).
     */
    get differentFirstPage(): boolean {
        return this.differentFirstPageValue;
    }

    set differentFirstPage(value: boolean) {
        this.differentFirstPageValue = value === true;
    }

    /**
     * Different odd and even pages — document-scoped via settings `w:evenAndOddHeaders`.
     */
    get differentOddAndEvenPages(): boolean {
        let ts333: any;
        const document: WordDocument = ownerDocumentOf(this);
        if (document === undefined || !isFeatureRegistered(SETTINGS_FEATURE_ID)) {
            return false;
        }
        try {
            const settingsPart: FeaturePartState = document.featurePart(featureId(SETTINGS_FEATURE_ID));
            if (settingsPart === undefined) {
                return false;
            }
            const evenAndOdd: boolean = ((ts333 = (settingsPart as {
                evenAndOddHeaders?: () => boolean | undefined;
            }).evenAndOddHeaders), ts333 == null ? undefined : ts333());
            return evenAndOdd === true;
        } catch (_err) {
            return false;
        }
    }

    set differentOddAndEvenPages(value: boolean) {
        if (!isFeatureRegistered(SETTINGS_FEATURE_ID)) {
            throw sectionsError(
                'differentOddAndEvenPages requires the settings feature (import @syncfusion/ej2-docx/settings)'
            );
        }
        const document: WordDocument = ownerDocumentOf(this);
        if (document === undefined) {
            throw sectionsError(
                'differentOddAndEvenPages requires page setup associated with a document (use section.pageSetup on a document section)'
            );
        }
        const settingsPart: FeaturePartState = document.featurePart(featureId(SETTINGS_FEATURE_ID));
        if (
            settingsPart === undefined ||
            typeof (settingsPart as { setEvenAndOddHeaders?: unknown }).setEvenAndOddHeaders !==
                'function'
        ) {
            throw sectionsError(
                'settings part was not loaded; register settings before WordDocument.open or ensure settings is imported'
            );
        }
        (settingsPart as unknown as {
            setEvenAndOddHeaders: (v: boolean | undefined) => void;
        }).setEvenAndOddHeaders(value ? true : undefined);
    }

    /**
     * Starting page number when restart is enabled (`w:pgNumType/@w:start`).
     */
    get pageStartingNumber(): number {
        return this.pageStartingNumberValue;
    }

    set pageStartingNumber(value: number) {
        this.pageStartingNumberValue = validatePositiveInteger(value, 'pageStartingNumber');
        this.pageNumberingPresent = true;
    }

    /**
     * When `true`, write `w:start` with {@link pageStartingNumber}; when `false`, omit start.
     */
    get restartPageNumbering(): boolean {
        return this.restartPageNumberingValue;
    }

    set restartPageNumbering(value: boolean) {
        this.restartPageNumberingValue = value === true;
        this.pageNumberingPresent = true;
    }

    /**
     * Page number format (`w:pgNumType/@w:fmt`). Always emitted when numbering state is set.
     */
    get pageNumberStyle(): PageNumberStyle {
        return this.pageNumberStyleValue;
    }

    set pageNumberStyle(value: PageNumberStyle) {
        this.pageNumberStyleValue = validatePageNumberStyle(value);
        this.pageNumberingPresent = true;
    }

    /**
     * Distance from text to line numbers (`w:lnNumType/@w:distance`), points.
     */
    get lineNumberingDistanceFromText(): number {
        return this.lineNumberingDistanceFromTextValue;
    }

    set lineNumberingDistanceFromText(value: number) {
        this.lineNumberingDistanceFromTextValue = validateSectionLength(
            value,
            'lineNumberingDistanceFromText'
        );
        this.lineNumberingPresent = true;
    }

    /**
     * Line-number restart mode (`w:lnNumType/@w:restart`).
     */
    get lineNumberingMode(): LineNumberingMode {
        return this.lineNumberingModeValue;
    }

    set lineNumberingMode(value: LineNumberingMode) {
        this.lineNumberingModeValue = validateLineNumberingMode(value);
        this.lineNumberingPresent = true;
    }

    /**
     * Line-number start value (one-based public API).
     *
     * Maps to zero-based `w:lnNumType/@w:start` as `wire = api - 1`.
     * Example: API `1` ↔ `w:start="0"`.
     */
    get lineNumberingStartValue(): number {
        return this.lineNumberingStartValueValue;
    }

    set lineNumberingStartValue(value: number) {
        this.lineNumberingStartValueValue = validatePositiveInteger(
            value,
            'lineNumberingStartValue'
        );
        this.lineNumberingPresent = true;
    }

    /**
     * Line-number count-by step (`w:lnNumType/@w:countBy`).
     */
    get lineNumberingStep(): number {
        return this.lineNumberingStepValue;
    }

    set lineNumberingStep(value: number) {
        if (!Number.isInteger(value) || value < 1) {
            throw sectionsError('lineNumberingStep must be an integer ≥ 1');
        }
        this.lineNumberingStepValue = value;
        this.lineNumberingPresent = true;
    }

    // —— internal (Section / feature bridges) ——

    /**
     * Section break kind. Public on {@link Section}; kept here for serialize.
     *
     * @private
     */
    get breakCode(): SectionBreakCode {
        return this.breakCodeValue;
    }

    /**
     * @param {SectionBreakCode} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set breakCode(value: SectionBreakCode) {
        this.breakCodeValue = validateSectionBreakCode(value);
    }

    /**
     * Text columns collection (Section exposes the same instance).
     *
     * @private
     */
    get columns(): ColumnCollection {
        return this.columnsValue;
    }

    /**
     * @private
     */
    get headerFooterReferences(): ReadonlyArray<HeaderFooterReference> {
        return this.headerFooterReferencesValue;
    }

    /**
     * @private
     */
    headerFooterReferenceId(
        kind: 'header' | 'footer',
        refType: HeaderFooterReferenceType,
    ): string | undefined;
    headerFooterReferenceId(target: HeaderFooterTarget): string | undefined;
    headerFooterReferenceId(
        kindOrTarget: 'header' | 'footer' | HeaderFooterTarget,
        refType?: HeaderFooterReferenceType
    ): string | undefined {
        let ts330: any;
        const target: HeaderFooterTarget = resolveHeaderFooterTarget(kindOrTarget, refType);
        return ((ts330 = this.headerFooterReferencesValue.find(
            (ref: HeaderFooterReference) => ref.kind === target.kind && ref.refType === target.refType
        )), ts330 == null ? undefined : ts330.relationshipId);
    }

    /**
     * @private
     */
    setHeaderFooterReference(
        kind: 'header' | 'footer',
        refType: HeaderFooterReferenceType,
        relationshipId: string | undefined,
    ): void;
    setHeaderFooterReference(
        target: HeaderFooterTarget,
        relationshipId: string | undefined,
    ): void;
    setHeaderFooterReference(
        kindOrTarget: 'header' | 'footer' | HeaderFooterTarget,
        refTypeOrId?: string,
        relationshipId?: string
    ): void {
        let target: HeaderFooterTarget;
        let id: string | undefined;
        if (isHeaderFooterTarget(kindOrTarget)) {
            target = kindOrTarget;
            id = typeof refTypeOrId === 'string' ? refTypeOrId : undefined;
        } else {
            const refType: HeaderFooterReferenceType =
                refTypeOrId === 'default' || refTypeOrId === 'first' || refTypeOrId === 'even'
                    ? refTypeOrId
                    : undefined;
            target = resolveHeaderFooterTarget(kindOrTarget, refType);
            id = relationshipId;
        }
        const next: HeaderFooterReference[] = this.headerFooterReferencesValue.filter(
            (ref: HeaderFooterReference) => !(ref.kind === target.kind && ref.refType === target.refType)
        );
        if (id !== undefined) {
            next.push({ kind: target.kind, refType: target.refType, relationshipId: id });
        }
        this.headerFooterReferencesValue = next;
    }

    /**Gutter margin (`w:pgMar/@w:gutter`), points.
     */
    get gutter(): number {
        return this.gutterValue;
    }

    set gutter(value: number) {
        this.gutterValue = validateSectionLength(value, 'gutter');
    }

    /**
     * Vertical text alignment on the page (`w:vAlign` / `ST_VerticalJc`).
     */
    get verticalAlignment(): VerticalAlignment {
        return this.verticalAlignmentValue;
    }

    set verticalAlignment(value: VerticalAlignment) {
        this.verticalAlignmentValue = assertVerticalAlignment(value);
    }

    /**
     * Right-to-left section layout (`w:bidi`, ECMA-376-1 §17.6.1).
     */
    get bidi(): boolean {
        return this.bidiValue;
    }

    set bidi(value: boolean) {
        this.bidiValue = value === true;
    }

    /**
     * Page border offset origin (`w:pgBorders/@w:offsetFrom`).
     */
    get pageBorderOffsetFrom(): PageBorderOffsetFrom {
        return this.bordersValue.measureFrom === 'page'
            ? PageBorderOffsetFrom.PageEdge
            : PageBorderOffsetFrom.Text;
    }

    set pageBorderOffsetFrom(value: PageBorderOffsetFrom) {
        if (value === PageBorderOffsetFrom.PageEdge) {
            this.bordersValue.setMeasureFrom('page');
            return;
        }
        if (value === PageBorderOffsetFrom.Text) {
            this.bordersValue.setMeasureFrom('text');
            return;
        }
        throw sectionsError('pageBorderOffsetFrom is invalid');
    }

    /**
     * Which pages receive page borders (`w:pgBorders/@w:display`).
     */
    get pageBordersApplyType(): PageBordersApplyType {
        const apply: string = this.bordersValue.applyTo;
        if (apply === 'firstPage') {
            return PageBordersApplyType.FirstPage;
        }
        if (apply === 'notFirstPage') {
            return PageBordersApplyType.NotFirstPage;
        }
        return PageBordersApplyType.AllPages;
    }

    set pageBordersApplyType(value: PageBordersApplyType) {
        if (value === PageBordersApplyType.FirstPage) {
            this.bordersValue.setApplyTo('firstPage');
            return;
        }
        if (value === PageBordersApplyType.NotFirstPage) {
            this.bordersValue.setApplyTo('notFirstPage');
            return;
        }
        if (value === PageBordersApplyType.AllPages) {
            this.bordersValue.setApplyTo('allPages');
            return;
        }
        throw sectionsError('pageBordersApplyType is invalid');
    }

    /**
     * @private
     */
    get chapterNumbering(): ChapterNumbering | undefined {
        return this.chapterNumberingValue;
    }

    /**
     * @param {ChapterNumbering | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set chapterNumbering(value: ChapterNumbering | undefined) {
        this.chapterNumberingValue =
            value === undefined ? undefined : assertChapterNumbering(value);
        if (value !== undefined) {
            this.pageNumberingPresent = true;
        }
    }

    /**
     * @returns {PaperSource | undefined} The result.
     * @private
     */
    private snapshotPaperSource(): PaperSource | undefined {
        if (!this.paperSourcePresent) {
            return undefined;
        }
        if (this.firstPageTrayValue === undefined && this.otherPagesTrayValue === undefined) {
            return undefined;
        }
        return {
            firstPageTray: this.firstPageTrayValue,
            otherPagesTray: this.otherPagesTrayValue
        };
    }

    /**
     * @returns {LineNumbering | undefined} The result.
     * @private
     */
    private snapshotLineNumbering(): LineNumbering | undefined {
        if (!this.lineNumberingPresent) {
            return undefined;
        }
        const restartWire: LineNumberRestart | undefined =
            this.lineNumberingModeValue === LineNumberingMode.RestartPage
                ? undefined
                : (this.lineNumberingModeValue as string as LineNumberRestart);
        // Public API is one-based; parse/serialize bag uses wire zero-based start.
        // Omit when wire would be 0 (API default 1) — matches common Word omission.
        const wireStart: number = this.lineNumberingStartValueValue - 1;
        return {
            countBy: this.lineNumberingStepValue,
            restart: restartWire,
            startAt: wireStart !== 0 ? wireStart : undefined,
            distanceFromText:
                this.lineNumberingDistanceFromTextValue !== 0
                    ? this.lineNumberingDistanceFromTextValue
                    : undefined
        };
    }

    /**
     * Serialize `w:sectPr` in EG_SectPrContents order.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        const children: OpenXmlElement[] = [];
        for (const reference of this.headerFooterReferencesValue) {
            children.push(
                serializeHeaderFooterReference(
                    reference as HeaderFooterReference
                )
            );
        }
        for (const element of this.prefix) {
            children.push(element as OpenXmlElement);
        }
        const wire: SectionMarkWire = breakCodeToWire(this.breakCodeValue);
        if (wire !== 'newPage') {
            children.push(wmlElement('type', { attributes: [wmlAttr('val', wire)] }));
        }
        children.push(
            serializePageSize(
                this.pageSizeValue.width,
                this.pageSizeValue.height,
                this.orientationValue
            )
        );
        children.push(
            serializePageMargins(
                this.marginsValue.top,
                this.marginsValue.right,
                this.marginsValue.bottom,
                this.marginsValue.left,
                this.headerDistanceValue,
                this.footerDistanceValue,
                this.gutterValue
            )
        );

        const paperBag: PaperSource = this.snapshotPaperSource();
        if (paperBag !== undefined) {
            const paperSrcEl: OpenXmlElement = serializePaperSource(paperBag);
            if (paperSrcEl !== undefined) {
                children.push(paperSrcEl);
            }
        }
        const bordersBag: ParsedPageBorders = this.bordersValue.toParsed();
        if (bordersBag !== undefined) {
            const bordersEl: OpenXmlElement = serializePageBorders(bordersBag);
            if (bordersEl !== undefined) {
                children.push(bordersEl);
            }
        }
        const lineBag: LineNumbering = this.snapshotLineNumbering();
        if (lineBag !== undefined) {
            children.push(serializeLineNumbering(lineBag));
        }
        if (this.pageNumberingPresent) {
            children.push(
                serializePageNumbering(
                    this.pageNumberStyleValue,
                    this.restartPageNumberingValue ? this.pageStartingNumberValue : undefined,
                    this.chapterNumberingValue
                )
            );
        }
        const colsEl: OpenXmlElement = this.columnsValue.toOpenXmlElement();
        if (colsEl !== undefined) {
            children.push(colsEl);
        }
        if (this.verticalAlignmentValue !== VerticalAlignment.Top) {
            children.push(
                wmlElement('vAlign', {
                    attributes: [wmlAttr('val', this.verticalAlignmentValue)]
                })
            );
        }
        if (this.bidiValue) {
            children.push(serializeOnOff('bidi', true));
        }
        if (this.differentFirstPageValue) {
            children.push(serializeOnOff('titlePg', true));
        }
        for (const element of this.suffix) {
            children.push(element as OpenXmlElement);
        }

        const namespaceDeclarations: { prefix: string; namespaceUri: string; }[] =
            this.headerFooterReferencesValue.length > 0
                ? [{ prefix: 'r', namespaceUri: RELATIONSHIPS_OFFICE_NS }]
                : [];
        return wmlElement('sectPr', {
            attributes: this.attributes,
            namespaceDeclarations,
            children
        });
    }
}

/**
 * @returns {PageSetup} The result.
 * @private
 * Default letter section factory (replaces `defaultLetterSection`).
 */
export function defaultLetterPageSetup(): PageSetup {
    return PageSetup.createDefaultLetter();
}

// —— helpers ——

function isHeaderFooterTarget(value: unknown): value is HeaderFooterTarget {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const record: { kind?: unknown; refType?: unknown; } = value as { kind?: unknown; refType?: unknown };
    return (
        (record.kind === 'header' || record.kind === 'footer') &&
        (record.refType === 'default' || record.refType === 'first' || record.refType === 'even')
    );
}

function resolveHeaderFooterTarget(
    kindOrTarget: 'header' | 'footer' | HeaderFooterTarget,
    refType?: HeaderFooterReferenceType
): HeaderFooterTarget {
    if (isHeaderFooterTarget(kindOrTarget)) {
        return kindOrTarget;
    }
    if (refType === undefined) {
        throw sectionsError('header/footer refType is required');
    }
    return { kind: kindOrTarget, refType };
}

function serializeHeaderFooterReference(ref: HeaderFooterReference): OpenXmlElement {
    const localName: string = ref.kind === 'header' ? 'headerReference' : 'footerReference';
    return wmlElement(localName, {
        attributes: [
            {
                namespaceUri: RELATIONSHIPS_OFFICE_NS,
                localName: 'id',
                prefix: 'r',
                value: ref.relationshipId
            },
            wmlAttr('type', ref.refType)
        ]
    });
}

function serializePageSize(
    width: number,
    height: number,
    orientation: PageOrientation
): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [
        wmlAttr('w', String(pointToTwips(width))),
        wmlAttr('h', String(pointToTwips(height)))
    ];
    if (orientation === PageOrientation.Landscape) {
        attrs.push(wmlAttr('orient', 'landscape'));
    }
    return wmlElement('pgSz', { attributes: attrs });
}

function serializePageMargins(
    top: number,
    right: number,
    bottom: number,
    left: number,
    header: number,
    footer: number,
    gutter: number
): OpenXmlElement {
    return wmlElement('pgMar', {
        attributes: [
            wmlAttr('top', String(pointToTwips(top))),
            wmlAttr('right', String(pointToTwips(right))),
            wmlAttr('bottom', String(pointToTwips(bottom))),
            wmlAttr('left', String(pointToTwips(left))),
            wmlAttr('header', String(pointToTwips(header))),
            wmlAttr('footer', String(pointToTwips(footer))),
            wmlAttr('gutter', String(pointToTwips(gutter)))
        ]
    });
}

function serializePaperSource(value: PaperSource): OpenXmlElement | undefined {
    const attrs: OpenXmlAttribute[] = [];
    if (value.firstPageTray !== undefined) {
        attrs.push(wmlAttr('first', String(value.firstPageTray)));
    }
    if (value.otherPagesTray !== undefined) {
        attrs.push(wmlAttr('other', String(value.otherPagesTray)));
    }
    if (attrs.length === 0) {
        return undefined;
    }
    return wmlElement('paperSrc', { attributes: attrs });
}

function serializeLineNumbering(value: LineNumbering): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [wmlAttr('countBy', String(value.countBy))];
    if (value.restart !== undefined && value.restart !== 'newPage') {
        attrs.push(wmlAttr('restart', value.restart));
    }
    if (value.startAt !== undefined) {
        attrs.push(wmlAttr('start', String(value.startAt)));
    }
    if (value.distanceFromText !== undefined) {
        attrs.push(wmlAttr('distance', String(pointToTwips(value.distanceFromText))));
    }
    return wmlElement('lnNumType', { attributes: attrs });
}

function serializePageNumbering(
    format: PageNumberStyle,
    startAt: number | undefined,
    chapter: ChapterNumbering | undefined
): OpenXmlElement {
    const attrs: OpenXmlAttribute[] = [wmlAttr('fmt', format as string)];
    if (startAt !== undefined) {
        attrs.push(wmlAttr('start', String(startAt)));
    }
    if (chapter !== undefined) {
        attrs.push(wmlAttr('chapStyle', String(chapter.headingLevel)));
        if (chapter.separator !== 'hyphen') {
            attrs.push(wmlAttr('chapSep', chapter.separator));
        }
    }
    return wmlElement('pgNumType', { attributes: attrs });
}

function isActiveBorderStyle(style: BorderStyle): boolean {
    return style !== BorderStyle.None && style !== BorderStyle.Nil;
}

function isActiveBorderEdge(edge: ParsedPageBorder | undefined): boolean {
    if (edge === undefined) {
        return false;
    }
    return edge.style !== 'none' && edge.style !== 'nil';
}

function serializePageBorderEdge(
    localName: string,
    edge: ParsedPageBorder
): OpenXmlElement | undefined {
    if (!isActiveBorderEdge(edge)) {
        return undefined;
    }
    const sz: number = Math.round(edge.widthPoints * 8);
    const attrs: OpenXmlAttribute[] = [
        wmlAttr('val', edge.style),
        wmlAttr('sz', String(sz)),
        wmlAttr('space', String(Math.round(edge.offsetPoints)))
    ];
    if (edge.color !== 'auto') {
        attrs.push(wmlAttr('color', edge.color));
    }
    return wmlElement(localName, { attributes: attrs });
}

function serializePageBorders(value: ParsedPageBorders): OpenXmlElement | undefined {
    const children: OpenXmlElement[] = [];
    const top: OpenXmlElement = value.top === undefined ? undefined : serializePageBorderEdge('top', value.top);
    const left: OpenXmlElement = value.left === undefined ? undefined : serializePageBorderEdge('left', value.left);
    const bottom: OpenXmlElement =
        value.bottom === undefined ? undefined : serializePageBorderEdge('bottom', value.bottom);
    const right: OpenXmlElement =
        value.right === undefined ? undefined : serializePageBorderEdge('right', value.right);
    if (top !== undefined) {
        children.push(top);
    }
    if (left !== undefined) {
        children.push(left);
    }
    if (bottom !== undefined) {
        children.push(bottom);
    }
    if (right !== undefined) {
        children.push(right);
    }
    const attrs: OpenXmlAttribute[] = [];
    if (value.zOrder !== 'front') {
        attrs.push(wmlAttr('zOrder', value.zOrder));
    }
    if (value.applyTo !== 'allPages') {
        attrs.push(wmlAttr('display', value.applyTo));
    }
    if (value.measureFrom !== 'text') {
        attrs.push(wmlAttr('offsetFrom', value.measureFrom));
    }
    if (children.length === 0 && attrs.length === 0) {
        return undefined;
    }
    return wmlElement('pgBorders', { attributes: attrs, children });
}

function assertPaperSource(value: PaperSource): PaperSource {
    const firstPageTray: number =
        value.firstPageTray === undefined
            ? undefined
            : validateNonNegativeInteger(value.firstPageTray, 'firstPageTray');
    const otherPagesTray: number =
        value.otherPagesTray === undefined
            ? undefined
            : validateNonNegativeInteger(value.otherPagesTray, 'otherPagesTray');
    return { firstPageTray, otherPagesTray };
}

function assertLineNumbering(value: LineNumbering): LineNumbering {
    if (!Number.isInteger(value.countBy) || value.countBy < 1) {
        throw sectionsError('lineNumberingStep must be an integer ≥ 1');
    }
    const restart: LineNumberRestart = value.restart;
    if (restart !== undefined) {
        switch (restart) {
        case 'newPage':
        case 'newSection':
        case 'continuous':
            break;
        default: {
            const _exhaustive: never = restart;
            void _exhaustive;
            throw sectionsError(
                'lineNumbering.restart must be \'newPage\', \'newSection\', or \'continuous\''
            );
        }
        }
    }
    // Parse-bag `startAt` is zero-based wire (`w:lnNumType/@w:start`).
    if (value.startAt !== undefined && (!Number.isInteger(value.startAt) || value.startAt < 0)) {
        throw sectionsError('lineNumbering wire startAt must be an integer ≥ 0');
    }
    const distanceFromText: number =
        value.distanceFromText === undefined
            ? undefined
            : validateSectionLength(value.distanceFromText, 'lineNumberingDistanceFromText');
    return {
        countBy: value.countBy,
        restart,
        startAt: value.startAt,
        distanceFromText
    };
}

function assertChapterNumbering(value: ChapterNumbering): ChapterNumbering {
    const headingLevel: number = value.headingLevel;
    if (!Number.isInteger(headingLevel) || headingLevel < 1 || headingLevel > 9) {
        throw sectionsError('chapterNumbering.headingLevel must be an integer in 1…9');
    }
    const separator: ChapterNumbering['separator'] = value.separator;
    switch (separator) {
    case 'hyphen':
    case 'period':
    case 'colon':
    case 'emDash':
    case 'enDash':
        break;
    default: {
        const _exhaustive: never = separator;
        void _exhaustive;
        throw sectionsError('chapterNumbering.separator is invalid');
    }
    }
    return { headingLevel, separator };
}

function assertVerticalAlignment(
    value: VerticalAlignment | SectionVerticalAlignment
): VerticalAlignment {
    switch (value) {
    case VerticalAlignment.Top:
    case 'top':
        return VerticalAlignment.Top;
    case VerticalAlignment.Center:
    case 'center':
        return VerticalAlignment.Center;
    case VerticalAlignment.Both:
    case 'both':
        return VerticalAlignment.Both;
    case VerticalAlignment.Bottom:
    case 'bottom':
        return VerticalAlignment.Bottom;
    default: {
        throw sectionsError('verticalAlignment must be a valid VerticalAlignment value');
    }
    }
}

function assertPageBorderEdge(edge: ParsedPageBorder, label: string): ParsedPageBorder {
    if (
        typeof edge.widthPoints !== 'number' ||
        Number.isNaN(edge.widthPoints) ||
        edge.widthPoints < 0.25 ||
        edge.widthPoints > 12
    ) {
        throw sectionsError(`${label}.widthPoints must be in 0.25–12`);
    }
    if (
        typeof edge.offsetPoints !== 'number' ||
        Number.isNaN(edge.offsetPoints) ||
        edge.offsetPoints < 0 ||
        edge.offsetPoints > 31
    ) {
        throw sectionsError(`${label}.offsetPoints must be in 0…31`);
    }
    if (!BORDER_STYLE_VALUES.has(edge.style)) {
        throw sectionsError(`${label}.style is not a supported border style`);
    }
    if (typeof edge.color !== 'string' || edge.color.length === 0) {
        throw sectionsError(`${label}.color must be a non-empty string`);
    }
    return edge;
}

function assertPageBorders(value: ParsedPageBorders): ParsedPageBorders {
    const applyTo: string = value.applyTo;
    if (applyTo !== 'allPages' && applyTo !== 'firstPage' && applyTo !== 'notFirstPage') {
        throw sectionsError('pageBorders.applyTo is invalid');
    }
    const measureFrom: string = value.measureFrom;
    if (measureFrom !== 'text' && measureFrom !== 'page') {
        throw sectionsError('pageBorders.measureFrom is invalid');
    }
    const zOrder: string = value.zOrder;
    if (zOrder !== 'front' && zOrder !== 'back') {
        throw sectionsError('pageBorders.zOrder is invalid');
    }
    return {
        applyTo,
        measureFrom,
        zOrder,
        top: value.top === undefined ? undefined : assertPageBorderEdge(value.top, 'pageBorders.top'),
        left:
            value.left === undefined ? undefined : assertPageBorderEdge(value.left, 'pageBorders.left'),
        bottom:
            value.bottom === undefined
                ? undefined
                : assertPageBorderEdge(value.bottom, 'pageBorders.bottom'),
        right:
            value.right === undefined
                ? undefined
                : assertPageBorderEdge(value.right, 'pageBorders.right')
    };
}

function validateBorderStyle(value: BorderStyle, label: string): BorderStyle {
    if (!BORDER_STYLE_VALUES.has(value as string)) {
        throw sectionsError(`${label} must be a valid BorderStyle value`);
    }
    return value;
}

function validateBorderWidth(value: number, label: string): number {
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0.25 || value > 12) {
        throw sectionsError(`${label} must be in 0.25–12 points`);
    }
    return value;
}

function validateLineNumberingMode(value: LineNumberingMode): LineNumberingMode {
    switch (value) {
    case LineNumberingMode.Continuous:
    case LineNumberingMode.RestartPage:
    case LineNumberingMode.RestartSection:
        return value;
    default: {
        const _exhaustive: never = value;
        void _exhaustive;
        throw sectionsError('lineNumberingMode is invalid');
    }
    }
}

function borderStyleFromWire(style: string): BorderStyle {
    if (BORDER_STYLE_VALUES.has(style)) {
        return style as BorderStyle;
    }
    return BorderStyle.None;
}
