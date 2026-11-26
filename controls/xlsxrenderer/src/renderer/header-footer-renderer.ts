import {
    PdfBrush,
    PdfDocument,
    PdfFont,
    PdfFontFamily,
    PdfFontStyle,
    PdfPage,
    PdfStringFormat,
    PdfTextAlignment,
    PdfVerticalAlignment
} from '@syncfusion/ej2-pdf';
import { IPageSetup, IHeaderFooterPageGroup, UnitConverter, sanitizeTextForFont } from '../common/index';

/**
 * Font and color styling settings for header and footer text segments.
 */
export class HeaderFooterFontColorSettings {
    /**
     * Gets or sets the font family name. Defaults to `'Calibri'`.
     */
    public fontName: string = 'Calibri';

    /**
     * Gets or sets the font size in points. Defaults to `8`.
     */
    public fontSize: number = 8;

    /**
     * Gets or sets the font color in Rgba format. Defaults to solid black.
     */
    public fontColor: { r: number; g: number; b: number; a: number } = { r: 0, g: 0, b: 0, a: 255 };

    /**
     * Indicates whether the font has underline styling.
     */
    public hasUnderline: boolean = false;

    /**
     * Indicates whether the font has strikethrough styling.
     */
    public hasStrikeThrough: boolean = false;

    /**
     * Indicates whether the font is styled as superscript.
     */
    public hasSuperscript: boolean = false;

    /**
     * Indicates whether the font is styled as subscript.
     */
    public hasSubscript: boolean = false;

    /**
     * Creates a deep copy of the current font color settings instance.
     *
     * @returns {HeaderFooterFontColorSettings} A new cloned instance of `HeaderFooterFontColorSettings`.
     */
    public clone(): HeaderFooterFontColorSettings {
        const copy: HeaderFooterFontColorSettings = new HeaderFooterFontColorSettings();
        copy.fontName = this.fontName;
        copy.fontSize = this.fontSize;
        copy.fontColor = { r: this.fontColor.r, g: this.fontColor.g, b: this.fontColor.b, a: this.fontColor.a };
        copy.hasUnderline = this.hasUnderline;
        copy.hasStrikeThrough = this.hasStrikeThrough;
        copy.hasSuperscript = this.hasSuperscript;
        copy.hasSubscript = this.hasSubscript;
        return copy;
    }
}

/**
 * Represents a header or footer section (Left, Center, or Right).
 */
export class HeaderFooterSection {
    /**
     * Gets or sets the section name identifier (e.g. `'Left'`, `'Center'`, `'Right'`).
     */
    public sectionName: string = '';

    /**
     * Gets or sets the section width in points.
     */
    public width: number = 0;

    /**
     * Gets or sets the section height in points.
     */
    public height: number = 0;

    /**
     * Gets or sets the text alignment for the section.
     */
    public textAlignment: PdfTextAlignment = PdfTextAlignment.left;

    /**
     * Indicates whether this section renders page count information.
     */
    public isPageCount: boolean = false;

    /**
     * Gets or sets the raw text content of the section.
     */
    public text: string = '';

    /**
     * Collection of font color settings keyed by text token.
     */
    public headerFooterCollections: Record<string, HeaderFooterFontColorSettings> = {};

    /**
     * Creates a deep copy of the current header/footer section instance.
     *
     * @returns {HeaderFooterSection} A new cloned instance of `HeaderFooterSection`.
     */
    public clone(): HeaderFooterSection {
        const copy: HeaderFooterSection = new HeaderFooterSection();
        copy.sectionName = this.sectionName;
        copy.width = this.width;
        copy.height = this.height;
        copy.textAlignment = this.textAlignment;
        copy.isPageCount = this.isPageCount;
        copy.text = this.text;
        copy.headerFooterCollections = {};
        const keys: string[] = Object.keys(this.headerFooterCollections);
        for (let i: number = 0; i < keys.length; i++) {
            const key: string = keys[i as number];
            const setting: HeaderFooterFontColorSettings = this.headerFooterCollections[key as string];
            if (setting) {
                copy.headerFooterCollections[key as string] = setting.clone();
            }
        }
        return copy;
    }
}

/**
 * Defines a header or footer template container comprising multiple sections.
 */
export class HeaderFooter {
    /**
     * Gets or sets the name identifier of this header/footer definition.
     */
    public headerFooterName: string = '';

    /**
     * Gets or sets the bounding template size and coordinate offsets in points.
     */
    public templateSize: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 };

    /**
     * Gets or sets the list of sections contained within this header/footer.
     */
    public headerFooterSections: HeaderFooterSection[] = [];

    /**
     * Initializes a new instance of the `HeaderFooter` class.
     */
    constructor() {
        this.headerFooterSections = [];
    }

    /**
     * Creates a deep copy of the current header/footer instance.
     *
     * @returns {HeaderFooter} A new cloned instance of `HeaderFooter`.
     */
    public clone(): HeaderFooter {
        const copy: HeaderFooter = new HeaderFooter();
        copy.headerFooterName = this.headerFooterName;
        copy.templateSize = {
            x: this.templateSize.x,
            y: this.templateSize.y,
            width: this.templateSize.width,
            height: this.templateSize.height
        };
        copy.headerFooterSections = [];
        for (let sectionIndex: number = 0; sectionIndex < this.headerFooterSections.length; sectionIndex++) {
            copy.headerFooterSections.push(this.headerFooterSections[sectionIndex as number].clone());
        }
        return copy;
    }
}

/**
 * Configuration options for document headers and footers during PDF conversion.
 */
export class HeaderFooterOption {
    /**
     * Indicates whether the document header should be rendered. Defaults to `true`.
     */
    public showHeader: boolean = true;

    /**
     * Indicates whether the document footer should be rendered. Defaults to `true`.
     */
    public showFooter: boolean = true;

    /**
     * Gets or sets the header configuration definition.
     */
    public header: HeaderFooter = new HeaderFooter();

    /**
     * Gets or sets the footer configuration definition.
     */
    public footer: HeaderFooter = new HeaderFooter();

    /**
     * Indicates whether the file name displayed in headers/footers includes its extension. Defaults to `false`.
     */
    public showFileNameWithExtension: boolean = false;

    /**
     * Initializes a new instance of the `HeaderFooterOption` class.
     */
    constructor() {
        this.header = new HeaderFooter();
        this.footer = new HeaderFooter();
    }
}

/**
 * Handles evaluation of Excel header/footer token macros and physical page rendering.
 */
export class HeaderFooterRenderer {
    /**
     * Expands Excel header and footer placeholder tokens.
     *
     * @param {string} text - Raw header or footer template string.
     * @param {number} pageNo - Current 1-based page number.
     * @param {number} total - Total page count in document.
     * @param {string} sheetName - Current worksheet name.
     * @param {string} bookTitle - Workbook file title.
     * @param {Date} now - Current evaluation timestamp.
     * @returns {string} Fully resolved string with macros substituted.
     */
    public static expandTokens(
        text: string,
        pageNo: number,
        total: number,
        sheetName: string,
        bookTitle: string,
        now: Date
    ): string {
        if (!text) {
            return '';
        }
        let out: string = text;
        out = out.replace(/&P/g, String(pageNo));
        out = out.replace(/&N/g, String(total));
        out = out.replace(/&A/g, sheetName || '');
        out = out.replace(/&F/g, bookTitle || '');
        out = out.replace(/&B/g, '');
        out = out.replace(/&I/g, '');
        out = out.replace(/&U/g, '');
        out = out.replace(/&E/g, '');
        out = out.replace(/&S/g, '');
        out = out.replace(/&K[0-9A-Fa-f]{6}/g, '');
        out = out.replace(/&"[^"]*"/g, '');
        out = out.replace(/&\d+/g, '');
        out = out.replace(/&D/g, now.toLocaleDateString());
        out = out.replace(/&T/g, now.toLocaleTimeString());
        out = out.replace(/&&/g, '&');
        return out;
    }

    public static drawAllHeaderFooters(
        pdfDocument: PdfDocument,
        pageCollection: PdfPage[],
        groups: IHeaderFooterPageGroup[],
        showHeader: boolean,
        showFooter: boolean,
        bookTitle: string
    ): void {
        HeaderFooterRenderer.renderHeadersAndFooters(pdfDocument, pageCollection, groups, showHeader, showFooter, bookTitle);
    }

    /**
     * Applies headers and footers across all generated PDF pages according to worksheet group setup.
     *
     * @param {PdfDocument} pdfDocument - Output PDF document instance.
     * @param {PdfPage[]} pageCollection - Array of generated PDF pages.
     * @param {IHeaderFooterPageGroup[]} groups - Grouped worksheet page ranges.
     * @param {boolean} showHeader - Whether header rendering is enabled.
     * @param {boolean} showFooter - Whether footer rendering is enabled.
     * @param {string} bookTitle - Workbook title string.
     * @returns {void}
     */
    public static renderHeadersAndFooters(
        pdfDocument: PdfDocument,
        pageCollection: PdfPage[],
        groups: IHeaderFooterPageGroup[],
        showHeader: boolean,
        showFooter: boolean,
        bookTitle: string
    ): void {
        const totalPages: number = pageCollection.length;
        const currentDate: Date = new Date();
        for (let groupIndex: number = 0; groupIndex < groups.length; groupIndex++) {
            const group: IHeaderFooterPageGroup = groups[groupIndex as number];
            const pageSetup: IPageSetup = group.setup;
            const groupTopMargin: number = UnitConverter.resolveMarginPoints(pageSetup.topMargin);
            const groupHeaderMargin: number = UnitConverter.resolveMarginPoints(pageSetup.headerMargin);
            const groupFooterMargin: number = UnitConverter.resolveMarginPoints(pageSetup.footerMargin);
            for (let pageOffset: number = 0; pageOffset < group.pageCount; pageOffset++) {
                const pageIndex: number = group.pageStartIndex + pageOffset;
                if (pageIndex >= pageCollection.length) {
                    break;
                }
                const page: PdfPage = pageCollection[pageIndex as number];
                const pageNumber: number = pageIndex + 1;
                const pageWidth: number = page.graphics.clientSize.width;
                const pageHeight: number = page.size
                    ? page.size.height
                    : (pageSetup.orientation === 'Landscape'
                        ? Math.min(pageSetup.paperWidth, pageSetup.paperHeight)
                        : Math.max(pageSetup.paperWidth, pageSetup.paperHeight));
                const font: PdfFont = pdfDocument.embedFont(PdfFontFamily.helvetica, 10, PdfFontStyle.regular);
                const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
                const drawSection: (sectionText: string, alignment: PdfTextAlignment, yPos: number, bottom: boolean) => void = (
                    sectionText: string,
                    alignment: PdfTextAlignment,
                    yPos: number,
                    bottom: boolean
                ): void => {
                    if (!sectionText) {
                        return;
                    }
                    const stringFormat: PdfStringFormat = new PdfStringFormat();
                    stringFormat.alignment = alignment;
                    stringFormat.lineAlignment = bottom ? PdfVerticalAlignment.bottom : PdfVerticalAlignment.top;
                    const expanded: string = HeaderFooterRenderer.expandTokens(
                        sectionText, pageNumber, totalPages, group.sheetName, bookTitle, currentDate
                    );
                    page.graphics.drawString(
                        sanitizeTextForFont(expanded, font), font, { x: 0, y: yPos, width: pageWidth, height: 20 }, brush, stringFormat
                    );
                };
                if (showHeader) {
                    const headerY: number = groupHeaderMargin - groupTopMargin;
                    drawSection(pageSetup.leftHeader, PdfTextAlignment.left, headerY, false);
                    drawSection(pageSetup.centerHeader, PdfTextAlignment.center, headerY, false);
                    drawSection(pageSetup.rightHeader, PdfTextAlignment.right, headerY, false);
                }
                if (showFooter) {
                    const footerY: number = pageHeight - groupFooterMargin - 20 - groupTopMargin;
                    drawSection(pageSetup.leftFooter, PdfTextAlignment.left, footerY, true);
                    drawSection(pageSetup.centerFooter, PdfTextAlignment.center, footerY, true);
                    drawSection(pageSetup.rightFooter, PdfTextAlignment.right, footerY, true);
                }
            }
        }
    }
}
