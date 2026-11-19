import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeEvent, BarcodeExportType, PDF417CompactionMode, PDF417ErrorCorrectionLevel } from '../barcode/enum/enum';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayText } from '../barcode/primitives/displaytext';
import { Margin } from '../barcode/primitives/margin';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { exportAsImage } from '../barcode/utility/barcode-util';
import { PDF417 } from './pdf417-util';
import { PDF417EncodeResult } from './pdf417-encoder';
import { PDF417GeneratorModel } from './pdf417-model';
import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';
import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';
import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';

/** Maximum number of value characters included in the aria-label. */
const PDF417_ARIA_TEXT_LIMIT: number = 100;

/**
 * Represents the PDF417 barcode control
 * ```html
 * <div id='pdf417'></div>
 * ```
 * ```typescript
 * let pdf417: PDF417Generator = new PDF417Generator({ value: 'Syncfusion', width: '300px', height: '120px' });
 * pdf417.appendTo('#pdf417');
 * ```
 */
export class PDF417Generator extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the PDF417 rendering mode.
     * * SVG - Renders the barcode objects as SVG elements
     * * Canvas - Renders the barcode in a canvas
     *
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the value of the PDF417 barcode to be rendered.
     *
     * @default undefined
     */
    @Property(undefined)
    public value: string;

    /**
     * Defines the height of the PDF417 barcode.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the width of the PDF417 barcode.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines how the value is compacted into codewords.
     * * Auto - Selects Text, Numeric and Byte compaction per segment of the value
     * * Text - Printable ASCII characters, tab, line feed and carriage return
     * * Numeric - Digits 0-9
     * * Byte - Any character
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public compactionMode: PDF417CompactionMode;

    /**
     * Defines the error correction level. Level0 to Level8 have the values 0 to 8, so a plain number
     * such as 2 can also be used. Level n adds 2^(n+1) error correction codewords.
     * Auto (-1) uses the level recommended by ISO/IEC 15438 for the data length: level 2 for up to
     * 40 data codewords, 3 for up to 160, 4 for up to 320 and 5 above that.
     *
     * @default PDF417ErrorCorrectionLevel.Auto
     */
    @Property(PDF417ErrorCorrectionLevel.Auto)
    public errorCorrectionLevel: PDF417ErrorCorrectionLevel;

    /**
     * Defines the number of data columns (1-30). Set 0 to calculate it automatically.
     *
     * @default 0
     */
    @Property(0)
    public columns: number;

    /**
     * Defines the number of rows (3-90). Set 0 to calculate it automatically.
     *
     * @default 0
     */
    @Property(0)
    public rows: number;

    /**
     * Renders a Compact (truncated) PDF417 symbol, which omits the right row indicator and
     * shortens the stop pattern to save horizontal space.
     *
     * @default false
     */
    @Property(false)
    public isCompact: boolean;

    /**
     * Defines the height of each row as a multiple of the module width (the narrowest bar).
     * ISO/IEC 15438 requires at least 3. Higher values make taller rows, which are easier
     * for linear scanners to read. The symbol keeps this ratio and is centered in any extra space.
     *
     * @default 3
     */
    @Property(3)
    public rowHeightRatio: number;

    /**
     * Defines the text properties for the PDF417 barcode. The text is drawn on a single line;
     * text wider than the available width is shortened with an ellipsis.
     *
     * @default ''
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;

    /**
     * Defines the margin properties for the PDF417 barcode.
     *
     * @default ''
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Defines the background color of the PDF417 barcode.
     *
     * @default 'white'
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Defines the forecolor of the PDF417 barcode.
     *
     * @default 'black'
     */
    @Property('black')
    public foreColor: string;

    /**
     * Triggers when the value or a property is invalid, or the value does not fit in the symbol.
     *
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;

    /** @private */
    private barcodeRenderer: BarcodeRenderer;
    private barcodeCanvas: HTMLElement;
    /** Automatic layout of the last successful render, reused when only the size changes. */
    private previousLayout: { rows: number, columns: number };
    /**
     * Specifies whether the WebMCP integration is enabled in the component.
     * When set to `true`, the component provides a set of tools with schemas and execute functions
     * that allow AI models to perform actions within the component context.
     *
     * @default false
     */
    @Property(false)
    public enableWebMcp: boolean;

    /**
     * Configures WebMCP tool registration and exposure settings.
     * When set, tools are automatically registered with the provided configuration.
     *
     * @default undefined
     */
    @Complex<WebMcpBarcodeSettingsModel>({}, WebMcpBarcodeSettings)
    public webMcpSettings: WebMcpBarcodeSettingsModel;

    /**
     * Triggers before a WebMCP tool execution begins.
     * Set `args.cancel` to `true` to prevent the tool from running, or `args.showConfirmationDialog`
     * to ask the user for confirmation first.
     *
     * @event
     */
    @Event()
    public beforeWebMcpToolExecute: EmitType<WebMcpToolExecuteEventArgs>;

    /**
     * `webMcpBarcodeModule` is used for WebMCP tool integration
     *
     * @private
     */
    public webMcpBarcodeModule: WebMcpBarcode;

    /** @private */
    public localeObj: L10n;
    /** @private */
    // eslint-disable-next-line
    private defaultLocale: Object;
    /**
     * Rows, columns and error correction level of the last rendered symbol.
     *
     * @private
     */
    public symbolInfo: { rows: number, columns: number, errorCorrectionLevel: number };

    /**
     * Constructor for creating the widget
     *
     * @param {PDF417GeneratorModel} options The barcode model.
     * @param {HTMLElement | string} element The barcode element.
     */
    constructor(options?: PDF417GeneratorModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Returns the WebMCP tool schemas for the given tool names.
     * When `toolNames` is omitted, schemas for all available tools are returned.
     *
     * @param {string[]} toolNames - Optional: filter tool names. Omit to get all tools.
     * @returns {WebMcpTool[]} - Array of tool schema objects matching the specified names
     */
    public getWebMcpTools(toolNames?: string[]): WebMcpTool[] {
        const args: { toolNames?: string[], tools?: WebMcpTool[] } = { toolNames };
        this.notify('getWebMcpTools', args);
        return args.tools || [];
    }

    /**
     * Registers WebMCP tools on document.modelContext for this component instance.
     *
     * @param {string} [prefix] - Optional: unique prefix for tool names. Defaults to the element `id`.
     * @param {string[] | WebMcpTool[]} [tools] - Optional: allowlist of tool names or customized tool definitions.
     * @param {string[]} [exposedTo] - Optional: list of allowed origins for cross-origin iframe access
     * @returns {void}
     */
    public registerWebMcpTools(prefix?: string, tools?: string[] | WebMcpTool[], exposedTo?: string[]): void {
        this.notify('registerWebMcpTools', { prefix, tools, exposedTo });
    }

    private initWebMcp(): void {
        if (this.webMcpBarcodeModule) {
            this.webMcpBarcodeModule.init(this);
            const settings: WebMcpBarcodeSettingsModel = this.webMcpSettings || {};
            this.webMcpBarcodeModule.registerTools({
                prefix: settings.name || this.element.id,
                tools: settings.tools,
                exposedTo: settings.exposedTo
            });
        }
    }

    /**
     * To provide the array of modules needed for control rendering
     *
     * @returns {ModuleDeclaration[]} To provide the array of modules needed for control rendering
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
        if (this.enableWebMcp) {
            modules.push({
                member: 'WebMcpBarcode',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * It is used to destroy the PDF417 component.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.notify('destroy', {});
        this.removeRootElement();
        this.element.classList.remove('e-pdf417');
        this.element.removeAttribute('role');
        this.element.removeAttribute('aria-label');
        this.barcodeRenderer = null;
        this.symbolInfo = null;
        super.destroy();
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} Get the properties to be maintained in the persisted state.
     * @private
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Returns the module name of the barcode
     *
     * @returns {string}  Returns the module name of the barcode
     */
    public getModuleName(): string {
        return 'PDF417Generator';
    }

    private initializePrivateVariables(): void {
        this.defaultLocale = {
            ariaLabel: 'PDF417 barcode',
            EmptyValue: 'The value is empty.',
            InvalidTextValue: 'The value contains characters that are not supported by Text compaction.',
            InvalidNumericValue: 'Numeric compaction supports only the digits 0-9.',
            InvalidCompactionMode: 'The compaction mode is not supported.',
            InvalidErrorCorrectionLevel: 'The error correction level must be Auto or a level from 0 to 8.',
            InvalidRows: 'The number of rows must be 0 (auto) or 3-90, and enough to hold the value.',
            InvalidColumns: 'The number of columns must be 0 (auto) or 1-30, and enough to hold the value.',
            InvalidSymbolSize: 'Rows x columns must not exceed 928 codewords.',
            InvalidRowHeightRatio: 'The row height ratio must be a number of 3 or more.',
            CapacityExceeded: 'The value is too long for the PDF417 symbol with the current settings.',
            InsufficientSize: 'The width and height are too small to render the PDF417 symbol after margins and text.'
        };
    }

    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }

    private getElementSize(real: string | number): string {
        const value: string = real.toString();
        return (value.indexOf('px') > 0 || value.indexOf('%') > 0) ? value : value + 'px';
    }

    private initialize(): void {
        if (!this.width) {
            this.width = '100%';
        }
        if (!this.height) {
            this.height = '100%';
        }
        this.element.style.display = 'block';
        this.element.style.width = this.getElementSize(this.width);
        this.element.style.height = this.getElementSize(this.height);
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        // Canvas is drawn at 1.5x and scaled down for sharper output, as in the other generators.
        const height: number = this.mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5;
        const width: number = this.mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5;
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement({
            id: this.element.id + 'content',
            height: height, width: width
        }, this.backgroundColor, width, height);
        this.element.appendChild(this.barcodeCanvas);
    }

    private removeRootElement(): void {
        if (this.barcodeCanvas && this.barcodeCanvas.parentNode) {
            this.barcodeCanvas.parentNode.removeChild(this.barcodeCanvas);
        }
        this.barcodeCanvas = null;
    }

    private triggerEvent(eventName: BarcodeEvent, message: string): void {
        const arg: { message: string } = { message: message };
        this.trigger(BarcodeEvent[`${eventName}`], arg);
    }

    protected preRender(): void {
        this.element.classList.add('e-pdf417');
        this.initializePrivateVariables();
        this.setCulture();
        this.initialize();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @returns {void}
     * @param {PDF417GeneratorModel} newProp - new properties
     * @param {PDF417GeneratorModel} oldProp - old properties
     * @private
     */
    // eslint-disable-next-line
    public onPropertyChanged(newProp: PDF417GeneratorModel, oldProp: PDF417GeneratorModel): void {
        if (newProp.enableWebMcp !== undefined) {
            if (newProp.enableWebMcp && !this.webMcpBarcodeModule) {
                // Enabling WebMCP at runtime: manually instantiate and initialize the module
                this.webMcpBarcodeModule = new WebMcpBarcode(this);
                this.initWebMcp();
            } else if (!newProp.enableWebMcp && this.webMcpBarcodeModule) {
                // Disabling WebMCP at runtime: unregister tools and destroy the module
                this.webMcpBarcodeModule.unregisterTools();
                this.webMcpBarcodeModule.destroy();
                this.webMcpBarcodeModule = null;
            }
        }
        if (newProp.webMcpSettings && this.webMcpBarcodeModule) {
            this.webMcpBarcodeModule.registerTools({
                prefix: this.webMcpSettings.name || this.element.id,
                tools: this.webMcpSettings.tools,
                exposedTo: this.webMcpSettings.exposedTo
            });
        }
        if (newProp.locale !== undefined) {
            this.setCulture();
        }
        // Every property affects the drawing, so the root element is rebuilt at the current size and mode.
        // The previous drawing is kept until the new one succeeds.
        const previousCanvas: HTMLElement = this.barcodeCanvas;
        this.barcodeCanvas = null;
        this.initialize();
        this.renderElements(newProp, previousCanvas);
    }

    /**
     * Export the barcode as an image in the specified image type and downloads it in the browser.
     *
     * @returns {void} Export the barcode as an image in the specified image type and downloads it in the browser.
     *  @param {string} fileName - Specifies the filename of the barcode image to be download.
     *  @param {BarcodeExportType} exportType - Defines the format of the barcode to be exported
     */
    public exportImage(fileName: string, exportType: BarcodeExportType): void {
        exportAsImage(exportType, fileName, this.element, false, this);
    }

    /**
     * Export the barcode as an image in the specified image type and returns it as base64 string.
     *
     * @returns {string} Export the barcode as an image in the specified image type and returns it as base64 string.
     *  @param {BarcodeExportType} barcodeExportType - Defines the format of the barcode to be exported
     */
    public exportAsBase64Image(barcodeExportType: BarcodeExportType): Promise<string> {
        return exportAsImage(barcodeExportType, '', this.element, true, this);
    }

    private renderElements(newProp?: PDF417GeneratorModel, previousCanvas?: HTMLElement): void {
        const pdf417: PDF417 = new PDF417();
        // Keep falsy but meaningful values such as 0; only undefined and null mean "no value".
        this.value = (this.value === undefined || this.value === null) ? '' : this.value;
        pdf417.value = this.value;
        pdf417.width = Number(this.barcodeCanvas.getAttribute('width'));
        pdf417.height = Number(this.barcodeCanvas.getAttribute('height'));
        pdf417.isSvgMode = this.mode === 'SVG';
        pdf417.margin = this.margin;
        pdf417.displayText = this.displayText;
        pdf417.foreColor = this.foreColor;
        pdf417.compactionMode = this.compactionMode;
        pdf417.errorCorrectionLevel = this.errorCorrectionLevel;
        pdf417.rows = this.rows;
        pdf417.columns = this.columns;
        pdf417.isCompact = this.isCompact;
        pdf417.rowHeightRatio = this.rowHeightRatio;
        // A new value or an explicit row, column, ratio or error-correction change must
        // recalculate the layout. A width or height change reuses it so the symbol scales.
        const layoutInvalidated: boolean = newProp === undefined || newProp.value !== undefined ||
            newProp.rows !== undefined || newProp.columns !== undefined || newProp.rowHeightRatio !== undefined ||
            newProp.errorCorrectionLevel !== undefined || newProp.compactionMode !== undefined ||
            newProp.isCompact !== undefined;
        if (layoutInvalidated) {
            this.previousLayout = undefined;
        }
        pdf417.previousLayout = this.previousLayout;
        const result: PDF417EncodeResult = pdf417.build();
        this.element.setAttribute('role', 'img');
        const label: string = this.localeObj.getConstant('ariaLabel');
        const text: string = String(this.displayText.text || this.value);
        // Long values are shortened so screen readers do not read hundreds of characters.
        const spoken: string = text.length > PDF417_ARIA_TEXT_LIMIT ? text.substring(0, PDF417_ARIA_TEXT_LIMIT) + '\u2026' : text;
        this.element.setAttribute('aria-label', spoken ? label + ': ' + spoken : label);
        if (!result.success) {
            this.symbolInfo = null;
            this.previousLayout = undefined;
            this.triggerEvent(BarcodeEvent.invalid, this.localeObj.getConstant(result.error));
            // A failed update must not leave a blank control. Put the previous symbol back.
            if (previousCanvas) {
                if (this.barcodeCanvas && this.barcodeCanvas.parentNode) {
                    this.barcodeCanvas.parentNode.removeChild(this.barcodeCanvas);
                }
                this.element.appendChild(previousCanvas);
                this.barcodeCanvas = previousCanvas;
            }
        } else {
            if (previousCanvas && previousCanvas.parentNode) {
                previousCanvas.parentNode.removeChild(previousCanvas);
            }
            this.symbolInfo = { rows: result.rows, columns: result.columns, errorCorrectionLevel: result.errorCorrectionLevel };
            this.previousLayout = (!this.rows && !this.columns) ?
                { rows: result.rows, columns: result.columns } : undefined;
            pdf417.draw(this.barcodeCanvas);
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    }

    /**
     * Renders the PDF417 barcode control
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        this.notify('initial-load', {});
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
        this.initWebMcp();
        this.renderComplete();
    }
}
