import {
    EventEmitter,
    ExcelToPdfConverterOptions,
    ConversionResult,
    Warning,
    ValidationResult,
    ConversionError,
    LayoutOptions,
    GridLinesDisplayStyle,
    WarningType,
    IWorksheet,
    IPicture,
    PerformanceTimer,
    decodeImageBytes,
    isPngBytes,
    InputValidator
} from '../common/index';
import { Workbook } from '@syncfusion/ej2-xlsx';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ExcelToPdfConverterCore } from './converter-core';
import { XlsxWorkbookAdapter } from './workbook-adapter';
import { PdfDocument } from '@syncfusion/ej2-pdf';

/**
 * Main conversion engine orchestrating validation, layout, pagination, rendering, and PDF output.
 */
export class ExcelToPdfConverter extends EventEmitter {
    private options: ExcelToPdfConverterOptions;
    private validator: InputValidator;
    private performanceTimer: PerformanceTimer;
    private isDestroyed: boolean = false;

    /**
     * Instantiates the converter with base configuration options.
     *
     * @param {ExcelToPdfConverterOptions} options - Base options.
     */
    constructor(options?: ExcelToPdfConverterOptions) {
        super();
        this.options = options || {};
        this.validator = new InputValidator();
        this.performanceTimer = new PerformanceTimer();
    }

    /**
     * Executes the conversion from an Excel workbook payload to a compiled PDF document.
     *
     * @param {Uint8Array | ArrayBuffer | Blob | Workbook} xlsxInput - Excel input bytes or Workbook instance.
     * @param {ExcelToPdfConverterOptions} options - Conversion settings.
     * @param {AbortSignal} abortSignal - Optional signal to cancel an in-flight conversion.
     * @returns {Promise<ConversionResult>} The converted PDF bytes and performance metadata.
     */
    async convert(
        xlsxInput: Uint8Array | ArrayBuffer | Blob | Workbook,
        options?: ExcelToPdfConverterOptions,
        abortSignal?: AbortSignal
    ): Promise<ConversionResult> {
        if (this.isDestroyed) {
            throw new ConversionError('INTERNAL_ERROR', 'Converter has been destroyed');
        }
        if (abortSignal && abortSignal.aborted) {
            throw new ConversionError('INTERNAL_ERROR', 'Conversion aborted by caller');
        }

        const opts: ExcelToPdfConverterOptions = Object.assign({}, this.options, options);
        this.performanceTimer.start();

        try {
            this.trigger('progress', { sheetName: '', currentPage: 0, totalPages: 0, percentComplete: 0 });

            const validationResult: ValidationResult = this.validator.validate(xlsxInput, {});
            if (!validationResult.isValid) {
                throw new ConversionError('INVALID_INPUT', 'Input validation failed: ' + validationResult.errors.join(', '));
            }

            const optionsValidationResult: ValidationResult = this.validator.validateOptions(opts);
            if (!optionsValidationResult.isValid) {
                throw new ConversionError('INVALID_INPUT', 'Options validation failed: ' + optionsValidationResult.errors.join(', '));
            }

            this.performanceTimer.mark('validation-complete');
            this.trigger('progress', { sheetName: '', currentPage: 0, totalPages: 0, percentComplete: 10 });

            let workbook: Workbook;
            if (xlsxInput instanceof Workbook) {
                workbook = xlsxInput;
            } else if (typeof Blob !== 'undefined' && xlsxInput instanceof Blob) {
                const buffer: ArrayBuffer = await new Promise<ArrayBuffer>(
                    (resolve: (value: ArrayBuffer) => void, reject: (reason?: unknown) => void) => {
                        const reader: FileReader = new FileReader();
                        reader.onload = (): void => resolve(reader.result as ArrayBuffer);
                        reader.onerror = (): void => reject(reader.error);
                        reader.readAsArrayBuffer(xlsxInput);
                    }
                );
                workbook = await Workbook.open(new Uint8Array(buffer), opts.password);
            } else if (xlsxInput instanceof Uint8Array || xlsxInput instanceof ArrayBuffer) {
                workbook = await Workbook.open(xlsxInput, opts.password);
            } else {
                throw new ConversionError('INVALID_INPUT', 'Unsupported workbook input type');
            }

            this.performanceTimer.mark('parsing-complete');
            this.trigger('progress', { sheetName: '', currentPage: 0, totalPages: 0, percentComplete: 30 });

            const workbookAdapter: XlsxWorkbookAdapter = new XlsxWorkbookAdapter(workbook, opts);
            if (Array.isArray(opts.sheets) && opts.sheets.length > 0) {
                const sheetFilterList: string[] = opts.sheets;
                if (sheetFilterList.length === 1 && sheetFilterList[0] === '0') {
                    const rawIdx: unknown = (workbook as Record<string, unknown>)['activeSheetIndex'];
                    const activeIdx: number = typeof rawIdx === 'number' ? (rawIdx as number) : 0;
                    const clampedIdx: number = Math.max(0, Math.min(activeIdx, workbookAdapter.worksheets.length - 1));
                    workbookAdapter.worksheets = [workbookAdapter.worksheets[clampedIdx as number]];
                } else {
                    workbookAdapter.worksheets = workbookAdapter.worksheets.filter(
                        (ws: IWorksheet) => sheetFilterList.indexOf(ws.name) >= 0
                    );
                }
            }
            const collectedWarnings: Warning[] = [];
            await this.normalizeWorksheetPictures(workbookAdapter, collectedWarnings, opts);
            let engineLayoutOption: LayoutOptions = !isNullOrUndefined(opts.layoutOptions)
                ? opts.layoutOptions
                : LayoutOptions.Automatic;
            if (isNullOrUndefined(opts.layoutOptions) && opts.pageSetup) {
                if (opts.pageSetup.fitSheetOnOnePage || opts.pageSetup.fitToPage) {
                    engineLayoutOption = LayoutOptions.FitSheetOnOnePage;
                } else if (
                    opts.pageSetup.fitAllColumnsOnOnePage ||
                    (opts.pageSetup as Record<string, unknown>).fitToWidth === true
                ) {
                    engineLayoutOption = LayoutOptions.FitAllColumnsOnOnePage;
                } else if (opts.pageSetup.fitAllRowsOnOnePage) {
                    engineLayoutOption = LayoutOptions.FitAllRowsOnOnePage;
                }
            }
            const gridlinesStyle: GridLinesDisplayStyle = !isNullOrUndefined(opts.displayGridLines)
                ? opts.displayGridLines
                : (opts.includeGridlines === true
                    ? GridLinesDisplayStyle.Visible
                    : (opts.includeGridlines === false ? GridLinesDisplayStyle.Invisible : GridLinesDisplayStyle.Auto));
            const customPaperSize: { width: number; height: number } | undefined = opts.customPaperSize ||
                (opts.pageSetup ? opts.pageSetup.customPaperSize : undefined);
            const showHeader: boolean = opts.headerFooterOption && !isNullOrUndefined(opts.headerFooterOption.showHeader)
                ? opts.headerFooterOption.showHeader
                : true;
            const showFooter: boolean = opts.headerFooterOption && !isNullOrUndefined(opts.headerFooterOption.showFooter)
                ? opts.headerFooterOption.showFooter
                : true;
            const showFileNameWithExtension: boolean = opts.showFileNameWithExtension === true ||
                (!isNullOrUndefined(opts.headerFooterOption) && opts.headerFooterOption.showFileNameWithExtension === true);
            const coreConverter: ExcelToPdfConverterCore = new ExcelToPdfConverterCore(workbookAdapter, {
                layoutOptions: engineLayoutOption,
                displayGridLines: gridlinesStyle,
                isConvertBlankPage: isNullOrUndefined(opts.isConvertBlankPage) ? true : opts.isConvertBlankPage,
                isConvertBlankSheet: isNullOrUndefined(opts.isConvertBlankSheet) ? true : opts.isConvertBlankSheet,
                throwWhenExcelFileIsEmpty: opts.throwWhenExcelFileIsEmpty === true,
                exportBookmarks: isNullOrUndefined(opts.exportBookmarks) ? true : opts.exportBookmarks,
                exportDocumentProperties: isNullOrUndefined(opts.exportDocumentProperties) ? true : opts.exportDocumentProperties,
                enableRtl: opts.enableRtl === true,
                embedFonts: opts.embedFonts === true,
                exportQualityImage: opts.exportQualityImage === true,
                showHeader: showHeader,
                showFooter: showFooter,
                showFileNameWithExtension: showFileNameWithExtension,
                renderHeadings: opts.renderHeadings === true,
                includeHiddenSheets: opts.includeHiddenSheets === true,
                customPaperSize: customPaperSize,
                onWarning: (type: WarningType, description: string) => {
                    const warningEnumKey: string = WarningType[type as number];
                    collectedWarnings.push({
                        code: warningEnumKey || String(type),
                        message: description,
                        context: { type: type }
                    });
                    if (!isNullOrUndefined(opts.warning) && !isNullOrUndefined(opts.warning.showWarning)) {
                        opts.warning.showWarning({ type: type, message: description });
                        return opts.warning.cancel === true;
                    }
                    return false;
                },
                onProgress: (sheetCount: number, sheetIndex: number) => {
                    const progressPercent: number = 30 + Math.round(((sheetIndex + 1) / (sheetCount || 1)) * 50);
                    const worksheetsList: IWorksheet[] = workbookAdapter.worksheets;
                    const currentSheet: IWorksheet | undefined = worksheetsList[sheetIndex as number];
                    this.trigger('progress', {
                        sheetName: currentSheet ? currentSheet.name : '',
                        currentPage: sheetIndex + 1,
                        totalPages: sheetCount,
                        percentComplete: progressPercent
                    });
                }
            });

            const pdfDoc: PdfDocument = coreConverter.convert();
            this.performanceTimer.mark('rendering-complete');

            if (!pdfDoc) {
                throw new ConversionError('INTERNAL_ERROR', 'PDF document generation was cancelled or failed');
            }

            const pdfBytes: Uint8Array = await pdfDoc.save();
            coreConverter.dispose();
            this.performanceTimer.mark('pdf-generation-complete');
            const docWithPages: { _pages?: unknown; pages?: { count?: number } } =
                pdfDoc as unknown as { _pages?: unknown; pages?: { count?: number } };
            const pagesArray: unknown[] = Array.isArray(docWithPages._pages) ? docWithPages._pages : [];
            const pageCount: number = pagesArray.length > 0 ? pagesArray.length :
                (docWithPages.pages && docWithPages.pages.count ? docWithPages.pages.count : 1);
            this.trigger('progress', { sheetName: '', currentPage: pageCount, totalPages: pageCount, percentComplete: 100 });

            const timings: Record<string, number> = {};
            const marks: Map<string, number> = this.performanceTimer.getMarks();
            marks.forEach((value: number, key: string) => {
                const timingsObj: Record<string, number> = timings;
                timingsObj[key as string] = value;
            });

            return {
                pdf: pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes),
                pageCount: pageCount,
                warnings: collectedWarnings,
                timings: timings,
                metadata: {
                    size: pdfBytes.length,
                    timestamp: new Date(),
                    workbookInfo: {
                        sheetCount: workbookAdapter.worksheets.length
                    }
                }
            };
        } finally {
            this.performanceTimer.mark('conversion-finished');
        }
    }

    private async normalizeWorksheetPictures(
        adapter: XlsxWorkbookAdapter,
        collectedWarnings: Warning[],
        opts: ExcelToPdfConverterOptions
    ): Promise<void> {
        if (typeof document === 'undefined' || typeof Image === 'undefined') {
            return;
        }
        const sheets: IWorksheet[] = adapter.worksheets || [];
        for (let sheetIndex: number = 0; sheetIndex < sheets.length; sheetIndex++) {
            const currentWorksheet: IWorksheet = sheets[sheetIndex as number];
            const pictures: IPicture[] = currentWorksheet.pictures || [];
            for (let pictureIndex: number = 0; pictureIndex < pictures.length; pictureIndex++) {
                const pic: IPicture = pictures[pictureIndex as number];
                if (isNullOrUndefined(pic) || isNullOrUndefined(pic.data)) { continue; }
                const bytes: Uint8Array | null = decodeImageBytes(pic.data);
                if (!isPngBytes(bytes)) { continue; }
                try {
                    const blob: Blob = new Blob([bytes as Uint8Array], { type: 'image/png' });
                    const url: string = URL.createObjectURL(blob);
                    const img: HTMLImageElement = new Image();
                    await new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void) => {
                        img.onload = (): void => resolve();
                        img.onerror = reject;
                        img.src = url;
                    });
                    URL.revokeObjectURL(url);
                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
                    if (ctx && canvas.width > 0 && canvas.height > 0) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        const jpegBytes: Uint8Array | null = decodeImageBytes(canvas.toDataURL('image/jpeg', 0.95));
                        if (!isNullOrUndefined(jpegBytes)) {
                            pic.data = jpegBytes;
                        }
                    }
                } catch (_err) {
                    const message: string = 'PNG normalization skipped for image: ' + pic.name;
                    collectedWarnings.push({
                        code: WarningType[WarningType.DrawingObjects as number] || String(WarningType.DrawingObjects),
                        message: message,
                        context: { type: WarningType.DrawingObjects }
                    });
                    if (!isNullOrUndefined(opts.warning) && !isNullOrUndefined(opts.warning.showWarning)) {
                        opts.warning.showWarning({ type: WarningType.DrawingObjects, message: message });
                    }
                }
            }
        }
    }

    /**
     * Releases references held by this instance.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.isDestroyed = true;
        this.removeAllListeners();
        this.options = {};
    }
}

/**
 * Converts Excel workbook to PDF document.
 *
 * One-shot function for simple Excel to PDF conversion.
 * For repeated conversions, use ExcelToPdfConverter class for better performance.
 *
 * @param {Uint8Array | ArrayBuffer | Blob | Workbook} xlsxInput - Excel workbook input.
 * @param {ExcelToPdfConverterOptions} [options] - Conversion options.
 * @returns {Promise<ConversionResult>} Promise resolving to conversion result.
 *
 * @example
 * ```typescript
 * // Convert from Uint8Array
 * const result = await convertExcelToPdf(xlsxBytes, {
 *     sheets: ['Sheet1'],
 *     pageSetup: { orientation: 'Landscape' }
 * });
 *
 * // Convert from Blob
 * const result = await convertExcelToPdf(xlsxBlob, {
 *     renderCharts: true,
 *     limits: { maxPages: 100 }
 * });
 * ```
 */
export async function convertExcelToPdf(
    xlsxInput: Uint8Array | ArrayBuffer | Blob | Workbook,
    options?: ExcelToPdfConverterOptions
): Promise<ConversionResult> {
    const converter: ExcelToPdfConverter = new ExcelToPdfConverter(options);
    try {
        return await converter.convert(xlsxInput);
    } finally {
        converter.destroy();
    }
}

