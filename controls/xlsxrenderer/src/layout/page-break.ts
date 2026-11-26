import { LayoutOptions, ExcelToPdfConverterSettings } from '../common/index';
import { ItemSizeHelper, pxToPt } from './item-size';
import { PageSetupOption } from './page-setup';

/**
 * Utility helper providing row and column pagination break algorithms for worksheets.
 */
export class PageBreaker {
    /** Cached horizontal and vertical zoom/scaling factors. */
    private arrayValue: number[] = [0, 0];
    private pageSetupOption: PageSetupOption;

    /**
     * Initializes a new instance of the `PageBreaker` class.
     *
     * @param {PageSetupOption} pageSetupOption Page setup configuration managing print titles and breaks.
     */
    constructor(pageSetupOption: PageSetupOption) {
        this.pageSetupOption = pageSetupOption;
    }

    /**
     * Calculates page row split boundaries across the sheet height limit.
     *
     * @param {number} sheetFirstRow Starting row index (1-based).
     * @param {number} sheetLastRow Ending row index (1-based).
     * @param {number} sheetHeight Available vertical page height in points.
     * @param {ItemSizeHelper} rowHeightGetter Cached row height helper.
     * @param {ExcelToPdfConverterSettings} settings Converter options and layout mode.
     * @returns {Object} Object containing row break boundaries and count.
     */
    public rowBreaker(
        sheetFirstRow: number,
        sheetLastRow: number,
        sheetHeight: number,
        rowHeightGetter: ItemSizeHelper,
        settings: ExcelToPdfConverterSettings
    ): { result: Int32Array; rowStartIndex: number } {
        const setupOption: PageSetupOption = this.pageSetupOption;
        const result: Int32Array = new Int32Array(1048576);
        result[0 as number] = sheetFirstRow;
        let rowStartIndex: number = 1;
        let heightLimit: number = 0;
        let checkSetupOption: boolean = false;
        const isCustomScaling: boolean = settings.layoutOptions === LayoutOptions.CustomScaling && !setupOption.pageSetup.isFitToPage;
        if (isCustomScaling) {
            this.arrayValue = this.calculateFontValue(settings);
        }
        for (let rowIndex: number = sheetFirstRow; rowIndex <= sheetLastRow; rowIndex++) {
            if (rowStartIndex >= result.length - 1) {
                break;
            }
            heightLimit += isCustomScaling
                ? pxToPt(rowHeightGetter.getSize(rowIndex)) * this.arrayValue[1 as number]
                : pxToPt(rowHeightGetter.getSize(rowIndex));
            if (heightLimit >= sheetHeight && result[(rowStartIndex - 1) as number] !== rowIndex - 1) {
                checkSetupOption = false;
                result[rowStartIndex as number] = rowIndex - 1;
                rowStartIndex++;
                heightLimit = 0;
                rowIndex--;
            } else if ((setupOption.horizontalBreaks.indexOf(rowIndex) >= 0 &&
                !(settings.layoutOptions === LayoutOptions.CustomScaling && setupOption.pageSetup.isFitToPage &&
                (setupOption.fitPagesTall > 1 || setupOption.fitPagesWide > 1))) && rowIndex < sheetLastRow) {
                checkSetupOption = false;
                result[rowStartIndex as number] = rowIndex;
                rowStartIndex++;
                heightLimit = 0;
            }
            if (!setupOption.checkRowBounds(result[(rowStartIndex - 1) as number], sheetLastRow) && setupOption.hasPrintTitleRows) {
                if (!checkSetupOption && sheetLastRow > setupOption.printTitleLastRow) {
                    if (setupOption.printTitleLastRow <= result[(rowStartIndex - 1) as number]) {
                        heightLimit += isCustomScaling
                            ? setupOption.titleRowHeight * this.arrayValue[1 as number]
                            : setupOption.titleRowHeight;
                    } else if (setupOption.titleRowHeight < sheetHeight) {
                        result[(rowStartIndex - 1) as number] += setupOption.printTitleLastRow - result[(rowStartIndex - 1) as number] + 1;
                        sheetFirstRow = result[(rowStartIndex - 1) as number];
                        rowIndex = sheetFirstRow - 1;
                        heightLimit = setupOption.titleRowHeight;
                    } else {
                        rowIndex++;
                        while (rowIndex < sheetLastRow && rowStartIndex < result.length - 1) {
                            const rowHeight: number = isCustomScaling
                                ? pxToPt(rowHeightGetter.getSize(rowIndex)) * this.arrayValue[1 as number]
                                : pxToPt(rowHeightGetter.getSize(rowIndex));
                            if (rowHeight > 0) {
                                result[rowStartIndex as number] = result[(rowStartIndex - 1) as number] + 1;
                                setupOption.rowIndexList.push(rowStartIndex);
                                rowStartIndex++;
                            }
                            rowIndex++;
                        }
                    }
                    setupOption.rowIndexList.push(rowStartIndex);
                    checkSetupOption = true;
                }
            }
        }
        return { result, rowStartIndex };
    }

    /**
     * Calculates page column split boundaries across the sheet width limit.
     *
     * @param {number} sheetFirstColumn Starting column index (1-based).
     * @param {number} sheetLastColumn Ending column index (1-based).
     * @param {number} sheetWidth Available horizontal page width in points.
     * @param {ItemSizeHelper} columnWidthGetter Cached column width helper.
     * @param {ExcelToPdfConverterSettings} settings Converter options and layout mode.
     * @returns {Object} Object containing column break boundaries and count.
     */
    public columnBreaker(
        sheetFirstColumn: number,
        sheetLastColumn: number,
        sheetWidth: number,
        columnWidthGetter: ItemSizeHelper,
        settings: ExcelToPdfConverterSettings
    ): { result: Int32Array; columnStartIndex: number } {
        const setupOption: PageSetupOption = this.pageSetupOption;
        const result: Int32Array = new Int32Array(16384);
        let widthLimit: number = 0;
        result[0 as number] = sheetFirstColumn;
        let columnStartIndex: number = 1;
        let checkPrintTitle: boolean = true;
        const isCustomScaling: boolean = settings.layoutOptions === LayoutOptions.CustomScaling && !setupOption.pageSetup.isFitToPage;
        if (isCustomScaling) {
            this.arrayValue = this.calculateFontValue(settings);
        }
        setupOption.columnIndexList.length = 0;
        for (let columnIndex: number = sheetFirstColumn; columnIndex <= sheetLastColumn; columnIndex++) {
            if (columnStartIndex >= result.length - 1) {
                break;
            }
            if (checkPrintTitle && setupOption.hasPrintTitleColumns && setupOption.checkColumnBounds(columnIndex)) {
                widthLimit += isCustomScaling
                    ? setupOption.titleColumnWidth * this.arrayValue[0 as number]
                    : setupOption.titleColumnWidth;
                setupOption.columnIndexList.push(columnStartIndex);
                if (columnIndex >= setupOption.printTitleFirstColumn && columnIndex <= setupOption.printTitleLastColumn) {
                    let canContinue: boolean = false;
                    if (widthLimit >= sheetWidth) {
                        let titleColumnWidthPt: number = 0;
                        for (let titleColumnIndex: number = setupOption.printTitleFirstColumn;
                            titleColumnIndex <= setupOption.printTitleLastColumn;
                            titleColumnIndex++) {
                            titleColumnWidthPt += isCustomScaling
                                ? pxToPt(setupOption.worksheet.getColumnWidthPx(titleColumnIndex)) * this.arrayValue[0 as number]
                                : pxToPt(columnWidthGetter.getSize(titleColumnIndex));
                            if (titleColumnWidthPt > sheetWidth) {
                                if (titleColumnIndex > columnIndex) {
                                    result[columnStartIndex as number] = titleColumnIndex - 1;
                                    checkPrintTitle = true;
                                    columnStartIndex++;
                                    widthLimit = 0;
                                    columnIndex = titleColumnIndex - 1;
                                    canContinue = true;
                                }
                                break;
                            }
                        }
                    } else {
                        columnIndex = setupOption.printTitleLastColumn;
                        widthLimit = 0;
                        canContinue = true;
                    }
                    if (canContinue) {
                        continue;
                    }
                }
            }
            widthLimit += isCustomScaling
                ? pxToPt(columnWidthGetter.getSize(columnIndex)) * this.arrayValue[0 as number]
                : pxToPt(columnWidthGetter.getSize(columnIndex));
            if (widthLimit > sheetWidth) {
                widthLimit -= isCustomScaling
                    ? pxToPt(columnWidthGetter.getSize(columnIndex)) * this.arrayValue[0 as number]
                    : pxToPt(columnWidthGetter.getSize(columnIndex));
                const isFirstColMatch: boolean = checkPrintTitle &&
                    result[(columnStartIndex - 1) as number] === columnIndex - 1;
                if (Math.trunc(widthLimit) === 0 || widthLimit >= sheetWidth || isFirstColMatch) {
                    if (columnIndex < sheetLastColumn) {
                        result[columnStartIndex as number] = columnIndex;
                    } else {
                        continue;
                    }
                } else if (columnIndex > sheetFirstColumn) {
                    result[columnStartIndex as number] = columnIndex - 1;
                    columnIndex--;
                }
                checkPrintTitle = true;
                columnStartIndex++;
                widthLimit = 0;
            } else if ((setupOption.verticalBreaks.indexOf(columnIndex) >= 0 &&
                !(settings.layoutOptions === LayoutOptions.CustomScaling && setupOption.pageSetup.isFitToPage &&
                (setupOption.fitPagesTall > 1 || setupOption.fitPagesWide > 1))) && columnIndex < sheetLastColumn) {
                result[columnStartIndex as number] = columnIndex;
                columnStartIndex++;
                checkPrintTitle = true;
                widthLimit = 0;
            } else {
                checkPrintTitle = false;
            }
        }
        return { result, columnStartIndex };
    }

    /**
     * Calculates the horizontal and vertical scaling factors based on worksheet zoom settings.
     *
     * @param {ExcelToPdfConverterSettings} settings Converter options and layout settings.
     * @returns {number[]} A two-element array containing `[horizontalZoom, verticalZoom]`.
     */
    public calculateFontValue(settings: ExcelToPdfConverterSettings): number[] {
        const isNoScaling: boolean = settings.layoutOptions === LayoutOptions.NoScaling;
        const zoom: number = isNoScaling ? 1.0 : this.pageSetupOption.worksheet.pageSetup.zoom / 100.0;
        return [zoom, zoom];
    }
}
