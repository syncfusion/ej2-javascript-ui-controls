import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeEvent, BarcodeExportType } from '../barcode/enum/enum';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayText } from '../barcode/primitives/displaytext';
import { Margin } from '../barcode/primitives/margin';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { exportAsImage } from '../barcode/utility/barcode-util';
import { DotCode } from './dotcode-util';
import { Gs1DotCode } from './gs1-dotcode';
import { DotCodeEncodeResult } from './dotcode-encoder';
import { DotCodeGeneratorModel } from './dotcode-model';
import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';
import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';
import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';

/** Maximum number of value characters included in the aria-label. */
const DOTCODE_ARIA_TEXT_LIMIT: number = 100;

/**
 * Represents the DotCode barcode control, for standard and GS1 DotCode.
 * ```html
 * <div id='dotcode'></div>
 * ```
 * ```typescript
 * let dotcode: DotCodeGenerator = new DotCodeGenerator({ value: 'Syncfusion', width: '300px', height: '150px' });
 * dotcode.appendTo('#dotcode');
 * ```
 */
export class DotCodeGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the DotCode rendering mode.
     * * SVG - Renders the DotCode as SVG elements
     * * Canvas - Renders the DotCode on a canvas
     *
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the value to be rendered as a DotCode symbol.
     *
     * @default undefined
     */
    @Property(undefined)
    public value: string;

    /**
     * Specifies whether the value is encoded as GS1 DotCode. When true, the value is
     * validated as GS1 data and encoded with FNC1.
     *
     * @default false
     */
    @Property(false)
    public enableGS1: boolean;

    /**
     * Defines the number of columns in the dot grid: 0 to choose the size automatically
     * from the width and height, or 5 or more. Rows are calculated so that rows plus
     * columns is odd, as the standard requires.
     *
     * @default 0
     */
    @Property(0)
    public columns: number;

    /**
     * Defines the height of the DotCode.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the width of the DotCode.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the text properties for the DotCode. The text is drawn on a single line;
     * text wider than the available width is shortened with an ellipsis.
     *
     * @default ''
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;

    /**
     * Defines the margin properties for the DotCode. The quiet zone of three dot
     * spacings required by the standard is drawn inside it, separately.
     *
     * @default ''
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Defines the background color of the DotCode.
     *
     * @default 'white'
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Defines the color of the dots.
     *
     * @default 'black'
     */
    @Property('black')
    public foreColor: string;

    /**
     * Triggers when the value or a property is invalid, or the value does not fit.
     *
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;

    /** @private */
    private barcodeRenderer: BarcodeRenderer;
    private barcodeCanvas: HTMLElement;
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
     * Rows and columns of the last rendered symbol.
     *
     * @private
     */
    public symbolInfo: { rows: number, columns: number, mask: number };

    /**
     * Constructor for creating the widget
     *
     * @param {DotCodeGeneratorModel} options The barcode model.
     * @param {HTMLElement | string} element The barcode element.
     */
    constructor(options?: DotCodeGeneratorModel, element?: HTMLElement | string) {
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
     * It is used to destroy the DotCode component.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.notify('destroy', {});
        this.removeRootElement();
        this.element.classList.remove('e-dotcode');
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
        return 'DotCodeGenerator';
    }

    private initializePrivateVariables(): void {
        this.defaultLocale = {
            ariaLabel: 'DotCode barcode',
            EmptyValue: 'The value is empty.',
            InvalidColumns: 'The number of columns must be 0 (auto) or at least 5, and enough to hold the value.',
            CapacityExceeded: 'The value is too long for the DotCode symbol with the current settings.',
            InsufficientSize: 'The width and height are too small to render the DotCode symbol after margins and text.',
            GS1InvalidFormat: 'The value must be GS1 data, in bracketed AI notation such as (01)09506000134376(10)ABC123, or raw.',
            GS1UnsupportedAI: 'The Application Identifier is not supported.',
            GS1InvalidLength: 'The value of an Application Identifier has an invalid length.',
            GS1InvalidCharacter: 'The value of an Application Identifier contains characters outside the GS1 character set.',
            GS1InvalidDate: 'The date of an Application Identifier is not a valid YYMMDD date.',
            GS1InvalidCheckDigit: 'The check digit of the GTIN or SSCC is not valid.',
            GS1DuplicateAI: 'An Application Identifier appears more than once.',
            GS1MissingRequiredAI: 'The value requires a GTIN (01) for the Application Identifiers used.'
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
        this.element.classList.add('e-dotcode');
        this.initializePrivateVariables();
        this.setCulture();
        this.initialize();
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @returns {void}
     * @param {DotCodeGeneratorModel} newProp - new properties
     * @param {DotCodeGeneratorModel} oldProp - old properties
     * @private
     */
    // eslint-disable-next-line
    public onPropertyChanged(newProp: DotCodeGeneratorModel, oldProp: DotCodeGeneratorModel): void {
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
        // Every property affects the drawing, so the root element is rebuilt at the current
        // size and mode. An invalid result clears the previous drawing, as the specification
        // requires; nothing is drawn from invalid input.
        this.removeRootElement();
        this.initialize();
        this.renderElements();
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

    private renderElements(): void {
        const dotcode: DotCode = new DotCode();
        // Keep falsy but meaningful values such as 0; only undefined and null mean "no value".
        this.value = (this.value === undefined || this.value === null) ? '' : this.value;
        const gs1DotCode: Gs1DotCode = this.enableGS1 ? new Gs1DotCode() : undefined;
        const originalText: string = this.displayText.text;
        if (gs1DotCode) {
            gs1DotCode.locale = this.localeObj;
            const gs1Message: string = gs1DotCode.validateGs1(this.value);
            if (gs1Message !== undefined) {
                this.triggerEvent(BarcodeEvent.invalid, gs1Message);
                // Nothing is drawn from invalid input, and a previous drawing is removed.
                this.removeRootElement();
                this.initialize();
                return;
            }
            dotcode.value = gs1DotCode.buildGs1Data();
            // Show the human-readable GS1 text with the AIs in brackets, unless the user set one.
            if (!originalText) {
                this.displayText.text = gs1DotCode.getHumanReadableText();
            }
        } else {
            dotcode.value = this.value;
        }
        dotcode.width = Number(this.barcodeCanvas.getAttribute('width'));
        dotcode.height = Number(this.barcodeCanvas.getAttribute('height'));
        dotcode.isSvgMode = this.mode === 'SVG';
        dotcode.margin = this.margin;
        dotcode.displayText = this.displayText;
        dotcode.foreColor = this.foreColor;
        dotcode.columns = this.columns;
        dotcode.isGs1 = this.enableGS1 === true;
        const result: DotCodeEncodeResult = dotcode.build();
        this.element.setAttribute('role', 'img');
        const label: string = this.localeObj.getConstant('ariaLabel');
        const text: string = String(this.displayText.text || this.value);
        // Long values are shortened so screen readers do not read hundreds of characters.
        const spoken: string = text.length > DOTCODE_ARIA_TEXT_LIMIT ?
            text.substring(0, DOTCODE_ARIA_TEXT_LIMIT) + '\u2026' : text;
        this.element.setAttribute('aria-label', spoken ? label + ': ' + spoken : label);
        if (!result.success) {
            this.symbolInfo = null;
            this.triggerEvent(BarcodeEvent.invalid, this.localeObj.getConstant(result.error));
            // Nothing is drawn from invalid input, and a previous drawing is removed.
            this.removeRootElement();
            this.initialize();
        } else {
            this.symbolInfo = { rows: result.rows, columns: result.columns, mask: result.mask };
            dotcode.draw(this.barcodeCanvas);
        }
        // Restore the user's display text after the GS1 text was substituted for drawing.
        this.displayText.text = originalText;
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    }

    /**
     * Renders the DotCode barcode control
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
