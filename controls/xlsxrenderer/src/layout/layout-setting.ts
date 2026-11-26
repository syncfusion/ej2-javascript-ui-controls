import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfPageOrientation, Size } from '@syncfusion/ej2-pdf';
import { IPageSetup } from '../common/index';
import { PageSetupOption } from './page-setup';
import { getExcelSheetSize } from './paper-size';

/**
 * Interface representing the host environment supplying layout dimensions and scaling helpers.
 */
export interface ILayoutHost {
    /** Top page margin in points. */
    topMargin: number;
    /** Bottom page margin in points. */
    bottomMargin: number;
    /** Left page margin in points. */
    leftMargin: number;
    /** Right page margin in points. */
    rightMargin: number;
    /** Output printable sheet width in points. */
    sheetWidth: number;
    /** Output printable sheet height in points. */
    sheetHeight: number;
    /** Options governing header/footer title row and column offsets. */
    pageSetupOption: PageSetupOption;
    /** Optional custom paper size dimensions in points. */
    customPaperSize?: { width: number; height: number };
    /**
     * Calculates the required width proportional to given sheet height constraints.
     *
     * @param excelSheetWidth Available target width in points.
     * @param shHeight Content height in points.
     * @param excelSheetHeight Available target height in points.
     * @returns The calculated proportional width in points.
     */
    requiredWidth(excelSheetWidth: number, shHeight: number, excelSheetHeight: number): number;
    /**
     * Calculates the required height proportional to given sheet width constraints.
     *
     * @param excelSheetWidth Available target width in points.
     * @param shWidth Content width in points.
     * @param excelSheetHeight Available target height in points.
     * @returns The calculated proportional height in points.
     */
    requiredHeight(excelSheetWidth: number, shWidth: number, excelSheetHeight: number): number;
}

/**
 * Interface representing a PDF section with mutable page dimensions and orientation.
 */
export interface ICorePdfSectionLike {
    /** Page settings container for size and orientation. */
    pageSettings: { size: Size; orientation: PdfPageOrientation; width: number; height: number };
}

/**
 * Computes printable sheet boundaries and scaling rules for Excel worksheet layouts.
 */
export class ExcelToPdfCoreLayoutSetting {
    /** Bottom margin in points. */
    private bottomMargin: number;
    /** Top margin in points. */
    private topMargin: number;
    /** Left margin in points. */
    private leftMargin: number;
    /** Right margin in points. */
    private rightMargin: number;
    private host: ILayoutHost;

    /**
     * Initializes a new instance of the `ExcelToPdfCoreLayoutSetting` class.
     *
     * @param {ILayoutHost} host The layout host supplying margins and scaling functions.
     */
    constructor(host: ILayoutHost) {
        this.host = host;
        this.bottomMargin = host.bottomMargin;
        this.topMargin = host.topMargin;
        this.leftMargin = host.leftMargin;
        this.rightMargin = host.rightMargin;
    }

    /**
     * Applies page size, orientation, and dimensions from page setup to the PDF section.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @returns {void}
     */
    private applyPage(section: ICorePdfSectionLike, pageSetup: IPageSetup): void {
        const size: Size = (!isNullOrUndefined(pageSetup.paperSize) || !isNullOrUndefined(this.host.customPaperSize))
            ? getExcelSheetSize(pageSetup.paperSize, this.host.customPaperSize)
            : { width: pageSetup.paperWidth, height: pageSetup.paperHeight };
        const isLandscape: boolean = pageSetup.orientation === 'Landscape';
        section.pageSettings.size = size;
        section.pageSettings.orientation = isLandscape ? PdfPageOrientation.landscape : PdfPageOrientation.portrait;
        section.pageSettings.width = isLandscape ? Math.max(size.width, size.height) : Math.min(size.width, size.height);
        section.pageSettings.height = isLandscape ? Math.min(size.width, size.height) : Math.max(size.width, size.height);
    }

    /**
     * Scales the entire worksheet content to fit on a single PDF page.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @param {number} usedRangeWidth The total width of the used cell range in points.
     * @param {number} usedRangeHeight The total height of the used cell range in points.
     * @returns {void}
     */
    public fitSheetOnPage(
        section: ICorePdfSectionLike,
        pageSetup: IPageSetup,
        usedRangeWidth: number,
        usedRangeHeight: number
    ): void {
        this.applyPage(section, pageSetup);
        this.host.sheetHeight = usedRangeHeight;
        this.host.sheetWidth = usedRangeWidth;
    }

    /**
     * Scales the worksheet content so that all columns fit horizontally onto a single page width.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @param {number} usedRangeWidth The total width of the used cell range in points.
     * @returns {void}
     */
    public fitAllColumnOnOnePage(
        section: ICorePdfSectionLike,
        pageSetup: IPageSetup,
        usedRangeWidth: number
    ): void {
        const pageSettings: ICorePdfSectionLike['pageSettings'] = section.pageSettings;
        this.applyPage(section, pageSetup);
        let sheetHeight: number;
        let sheetWidth: number = usedRangeWidth + this.host.pageSetupOption.titleColumnWidth;
        if (sheetWidth < pageSettings.width - (this.leftMargin + this.rightMargin)) {
            sheetWidth = pageSettings.width - (this.leftMargin + this.rightMargin);
            sheetHeight = pageSettings.height - (this.topMargin + this.bottomMargin);
        } else {
            const availWidth: number = pageSettings.width - (this.leftMargin + this.rightMargin);
            const extraMargin: number = this.host.pageSetupOption.titleColumnWidth > 0
                ? 0 : (this.topMargin + this.bottomMargin);
            sheetHeight = this.host.requiredHeight(availWidth, sheetWidth, pageSettings.height - extraMargin);
        }
        this.host.sheetHeight = sheetHeight;
        this.host.sheetWidth = sheetWidth;
    }

    /**
     * Scales the worksheet content so that all rows fit vertically onto a single page height.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @param {number} usedRangeHeight The total height of the used cell range in points.
     * @returns {void}
     */
    public fitAllRowsOnOnePage(
        section: ICorePdfSectionLike,
        pageSetup: IPageSetup,
        usedRangeHeight: number
    ): void {
        const pageSettings: ICorePdfSectionLike['pageSettings'] = section.pageSettings;
        this.applyPage(section, pageSetup);
        let sheetWidth: number;
        let sheetHeight: number = usedRangeHeight + this.host.pageSetupOption.titleRowHeight;
        if (sheetHeight < pageSettings.height - (this.topMargin + this.bottomMargin)) {
            sheetHeight = pageSettings.height - (this.topMargin + this.bottomMargin);
            sheetWidth = pageSettings.width - (this.leftMargin + this.rightMargin);
        } else {
            const extraMargin: number = this.host.pageSetupOption.titleRowHeight > 0
                ? 0 : (this.leftMargin + this.rightMargin);
            const availWidth: number = pageSettings.width - extraMargin;
            sheetWidth = this.host.requiredWidth(
                availWidth,
                sheetHeight,
                pageSettings.height - (this.topMargin + this.bottomMargin)
            );
        }
        this.host.sheetHeight = sheetHeight;
        this.host.sheetWidth = sheetWidth;
    }

    /**
     * Applies standard 100% scaling without fitting constraints.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @returns {void}
     */
    public noScaling(
        section: ICorePdfSectionLike,
        pageSetup: IPageSetup
    ): void {
        this.applyPage(section, pageSetup);
        this.host.sheetHeight = section.pageSettings.height - (this.topMargin + this.bottomMargin);
        this.host.sheetWidth = section.pageSettings.width - (this.leftMargin + this.rightMargin);
    }

    /**
     * Applies custom user-defined page fitting rules based on `fitToPagesWide` and `fitToPagesTall`.
     *
     * @param {ICorePdfSectionLike} section The target PDF section.
     * @param {IPageSetup} pageSetup The worksheet page setup configuration.
     * @param {number} usedRangeWidth The total width of the used cell range in points.
     * @param {number} usedRangeHeight The total height of the used cell range in points.
     * @returns {void}
     */
    public customScaling(
        section: ICorePdfSectionLike,
        pageSetup: IPageSetup,
        usedRangeWidth: number,
        usedRangeHeight: number
    ): void {
        const pageSettings: ICorePdfSectionLike['pageSettings'] = section.pageSettings;
        this.applyPage(section, pageSetup);
        let sheetHeight: number;
        let sheetWidth: number;
        if (pageSetup.isFitToPage) {
            const topBottomMargin: number = this.topMargin + this.bottomMargin;
            const leftRightMargin: number = this.leftMargin + this.rightMargin;
            sheetWidth = pageSettings.width - leftRightMargin;
            sheetHeight = pageSettings.height - topBottomMargin;
            if (pageSetup.fitToPagesTall === 1 && pageSetup.fitToPagesWide === 0) {
                if (sheetHeight < usedRangeHeight) {
                    sheetHeight = usedRangeHeight;
                }
                const neededWidth: number = this.host.requiredWidth(
                    pageSettings.width,
                    sheetHeight + topBottomMargin,
                    pageSettings.height
                );
                sheetWidth = neededWidth + 3;
                sheetHeight += 3;
            } else if (pageSetup.fitToPagesTall === 0 && pageSetup.fitToPagesWide === 1) {
                if (sheetWidth < usedRangeWidth) {
                    sheetWidth = usedRangeWidth;
                }
                const neededHeight: number = this.host.requiredHeight(
                    pageSettings.width - leftRightMargin,
                    sheetWidth,
                    pageSettings.height - topBottomMargin
                );
                sheetHeight = neededHeight + 3;
                sheetWidth += 3;
            } else {
                const pageWide: number = pageSetup.fitToPagesWide === 0 ? 1 : pageSetup.fitToPagesWide;
                const pageTall: number = pageSetup.fitToPagesTall === 0 ? 1 : pageSetup.fitToPagesTall;
                const pageRatioComparison: number = pageWide === pageTall ? 0 : pageWide > pageTall ? 1 : -1;
                if (pageRatioComparison === 0) {
                    const scaledWidth: number = sheetWidth * pageWide;
                    if (scaledWidth < usedRangeWidth) {
                        sheetWidth = (usedRangeWidth + (leftRightMargin * pageWide)) / pageWide;
                    }
                    sheetHeight = this.host.requiredHeight(pageSettings.width, sheetWidth, pageSettings.height);
                    const scaledHeight: number = sheetHeight * pageTall;
                    if (scaledHeight < (usedRangeHeight + topBottomMargin)) {
                        sheetHeight = (usedRangeHeight + (topBottomMargin * pageTall)) / pageTall;
                        sheetWidth = this.host.requiredWidth(pageSettings.width, sheetHeight, pageSettings.height);
                    }
                } else if (pageRatioComparison > 0) {
                    const scaledHeight: number = sheetHeight * pageTall;
                    if (scaledHeight < (usedRangeHeight + topBottomMargin)) {
                        sheetHeight = (usedRangeHeight + (topBottomMargin * pageTall)) / pageTall;
                    }
                    const scaledWidth: number = this.host.requiredWidth(pageSettings.width, sheetHeight, pageSettings.height) * pageWide;
                    if (scaledWidth < (usedRangeWidth + leftRightMargin)) {
                        sheetWidth = (usedRangeWidth + (leftRightMargin * pageWide)) / pageWide;
                        sheetHeight = this.host.requiredHeight(pageSettings.width, sheetWidth, pageSettings.height);
                    } else {
                        sheetWidth = scaledWidth / pageWide;
                    }
                } else {
                    const scaledWidth: number = sheetWidth * pageWide;
                    if (scaledWidth < (usedRangeWidth + leftRightMargin)) {
                        sheetWidth = (usedRangeWidth + (leftRightMargin * pageWide)) / pageWide;
                    }
                    const scaledHeight: number = this.host.requiredHeight(pageSettings.width, sheetWidth, pageSettings.height) * pageTall;
                    if (scaledHeight < (usedRangeHeight + topBottomMargin)) {
                        sheetHeight = (usedRangeHeight + (topBottomMargin * pageTall)) / pageTall;
                        sheetWidth = this.host.requiredWidth(pageSettings.width, sheetHeight, pageSettings.height);
                    } else {
                        sheetHeight = scaledHeight / pageTall;
                    }
                    const isUnderHeight: boolean = (usedRangeHeight + topBottomMargin) < pageSettings.height;
                    const isUnderWidth: boolean = (usedRangeWidth + leftRightMargin) <= pageSettings.width;
                    if (pageWide === 1 && (isUnderHeight || isUnderWidth)) {
                        sheetHeight = pageSettings.height;
                    }
                }
                sheetHeight = sheetHeight - topBottomMargin + 3;
                sheetWidth = sheetWidth - leftRightMargin + 3;
            }
        } else {
            sheetHeight = pageSettings.height - (this.topMargin + this.bottomMargin);
            sheetWidth = pageSettings.width - (this.leftMargin + this.rightMargin);
            sheetHeight += 1.5;
            sheetWidth += 1.5;
        }
        this.host.sheetHeight = sheetHeight;
        this.host.sheetWidth = sheetWidth;
    }
}

export { ExcelToPdfCoreLayoutSetting as CoreLayoutSetting };
