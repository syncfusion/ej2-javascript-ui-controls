import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeEvent, DataMatrixEncoding, DataMatrixSize, BarcodeExportType } from '../barcode/enum/enum';
import { ValidateEvent } from '../barcode/rendering/canvas-interface';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayText } from '../barcode/primitives/displaytext';
import { Margin } from '../barcode/primitives/margin';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { removeChildElements, refreshCanvasBarcode, exportAsImage } from '../barcode/utility/barcode-util';
import { DataMatrix } from './datamatrix-util';
import { Gs1DataMatrix } from './gs1-datamatrix';
import { DataMatrixGeneratorModel } from './datamatrix-model';
import { WebMcpBarcode, WebMcpBarcodeSettings } from '../barcode/integrations/webmcp-adapter';
import { WebMcpBarcodeSettingsModel } from '../barcode/integrations/webmcp-adapter-model';
import { WebMcpToolExecuteEventArgs, WebMcpTool } from '../barcode/rendering/canvas-interface';


/**
 * Represents the Datamatrix control
 * ```
 */
export class DataMatrixGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines encoding type of the DataMatrix.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public encoding: DataMatrixEncoding;

    /**
     * Defines encoding type of the DataMatrix.
     *
     * @default 'Auto'
     */
    @Property(DataMatrixSize.Auto)
    public size: DataMatrixSize;

    /**
     * Defines the DataMatrix rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     *
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;



    /**
     * Defines the value of the DataMatrix to be rendered.
     *
     * @default undefined
     */
    @Property(undefined)
    public value: string;

    /**
     * Defines the height of the DataMatrix.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;
    /**
     * Defines the width of the DataMatrix.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Defines the text properties for the DataMatrix.
     *
     * @default ''
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;
    /**
     * Defines the margin properties for the DataMatrix.
     *
     * @default ''
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Defines the background color of the DataMatrix.
     *
     * @default 'white'
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Triggers if you enter any invalid character.
     *
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;


    /**
     * Defines the forecolor of the DataMatrix.
     *
     * @default 'black'
     */
    @Property('black')
    public foreColor: string;

    /**
     * Defines the xDimension of the DataMatrix.
     */
    @Property(1)
    public xDimension: number;

    /**
     * Specifies whether the value is encoded as a GS1 DataMatrix. When true, the value is
     * GS1 data, bracketed or raw; it is validated and encoded with FNC1. Base256 encoding
     * cannot be used.
     *
     * @default false
     */
    @Property(false)
    public enableGS1: boolean;



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
     * It is used to destroy the Barcode component.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.notify('destroy', {});
        super.destroy();
        const content: HTMLElement = document.getElementById(this.element.id + 'content');
        if (content) {
            this.element.removeChild(content);
        }
    }

    private initializePrivateVariables(): void {
        this.defaultLocale = {
            GS1InvalidFormat: 'The value must be GS1 data, in bracketed AI notation such as (01)09506000134376(10)ABC123, or raw.',
            GS1UnsupportedAI: 'The Application Identifier is not supported.',
            GS1InvalidLength: 'The value of an Application Identifier has an invalid length.',
            GS1InvalidCharacter: 'The value of an Application Identifier contains characters outside the GS1 character set.',
            GS1InvalidDate: 'The date of an Application Identifier is not a valid YYMMDD date.',
            GS1InvalidCheckDigit: 'The check digit of the GTIN or SSCC is not valid.',
            GS1DuplicateAI: 'An Application Identifier appears more than once.',
            GS1MissingRequiredAI: 'The value requires a GTIN (01) for the Application Identifiers used.',
            GS1InvalidEncoding: 'Base256 encoding cannot be used with GS1 DataMatrix.'
        };
    }

    /**
     * Constructor for creating the widget
     *
     * @param {DataMatrixGeneratorModel} options The barcode model.
     * @param {HTMLElement | string} element The barcode element.
     */
    constructor(options?: DataMatrixGeneratorModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
    }


    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} Get the properties to be maintained in the persisted state.
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
        return 'DataMatrixGenerator';
    }
    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }


    // eslint-disable-next-line
    private getElementSize(real: string | number, rulerSize?: number): string {
        //this method will return the size of the datamatrix
        let value: string;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        } else {
            value = real.toString() + 'px';
        }
        return value;
    }


    private initialize(): void {
        //Task 913517: Handle null properties for diagram and barcode properties -phase1
        if (!this.width) {
            this.width = '100%';
        }
        if (!this.height) {
            this.height = '100%';
        }
        //Task 913519: Barcode visibility issue and Dependabot issues
        this.element.style.display = 'block';
        //Initialize the width of the datamatrix generator
        this.element.style.width = this.getElementSize(this.width);
        //Initialize the hieght of the datamatrix generator
        this.element.style.height = this.getElementSize(this.height);
        //set height and width of the canvas element
        const height: number = this.mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5;
        const width: number = this.mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5;
        //initialize the canvas element
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement(
            {
                id: this.element.id + 'content',
                height, width
            },
            this.backgroundColor, width, height) as HTMLElement;
        this.element.appendChild(this.barcodeCanvas);
    }


    private triggerEvent(eventName: BarcodeEvent, message: string): void {
        const arg: ValidateEvent = {
            message: message
        };
        this.trigger(BarcodeEvent[`${eventName}`], arg);
    }

    protected preRender(): void {
        this.element.classList.add('e-datamatrix');
        //initialize the data matrix renderer
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        //initialize the data matrix renderer private variables
        this.initializePrivateVariables();
        this.setCulture();
        //set class data matrix renderer
    }

    // eslint-disable-next-line
    public onPropertyChanged(newProp: DataMatrixGeneratorModel, oldProp: DataMatrixGeneratorModel): void {
        let width: number | string;
        let height: number | string;
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            refreshCanvasBarcode(this as DataMatrixGenerator, this.barcodeCanvas as HTMLCanvasElement);
        } else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            width = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? (((newProp.width as number) * 1.5)) : newProp.width;
            this.barcodeCanvas.setAttribute('width', String(width));
        }
        if (newProp.height) {
            height = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? (((newProp.height as number) * 1.5)) : newProp.height;
            this.barcodeCanvas.setAttribute('height', String(height));
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'enableWebMcp':
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
                break;
            case 'webMcpSettings':
                if (this.webMcpBarcodeModule) {
                    this.webMcpBarcodeModule.registerTools({
                        prefix: this.webMcpSettings.name || this.element.id,
                        tools: this.webMcpSettings.tools,
                        exposedTo: this.webMcpSettings.exposedTo
                    });
                }
                break;
            case 'mode':
                this.initialize();
                break;
            case 'height':
                this.element.style.height = this.getElementSize(height);
                this.barcodeCanvas.setAttribute('height', String(this.element.offsetHeight));
                break;
            case 'width':
                this.element.style.width = this.getElementSize(width);
                this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                break;
            case 'backgroundColor':
                this.barcodeCanvas.style.background = newProp.backgroundColor;
                break;
            }

        }
        this.renderElements();
    }


    private checkdata(value: string): boolean {
        let validData: boolean = false;
        for (let i: number = 0; i < value.length; i++) {
            // eslint-disable-next-line
            const number: number = 0;
            if ((value.charCodeAt(i) >= 32 && value.charCodeAt(i) <= 126) || (value.charCodeAt(i) === 10 || value.charCodeAt(i) === 13)) {
                validData = true;
            }
        }
        return validData;
    }

    /**
     * Export the barcode as an image in the specified image type and downloads it in the browser.
     *
     * @returns {void} Export the barcode as an image in the specified image type and downloads it in the browser.
     *  @param {string} fileName - Specifies the filename of the barcode image to be download.
     *  @param {BarcodeExportType} exportType - Defines the format of the barcode to be exported
     */
    public exportImage(fileName: string, exportType: BarcodeExportType ): void {
        exportAsImage(exportType, fileName, this.element, false, this);
    }

    /**
     * Export the barcode as an image in the specified image type and returns it as base64 string.
     *
     * @returns {string} Export the barcode as an image in the specified image type and returns it as base64 string.
     *  @param {BarcodeExportType} barcodeExportType - Defines the format of the barcode to be exported
     */
    public exportAsBase64Image(barcodeExportType: BarcodeExportType): Promise<string> {
        const returnValue: Promise<string> = exportAsImage(barcodeExportType, '', this.element, true, this);
        return returnValue;
    }


    private renderElements(): void {
        const dataMatrix: DataMatrix = this.enableGS1 ? new Gs1DataMatrix() : new DataMatrix();
        this.value = this.value || '';
        if (this.enableGS1) {
            const gs1DataMatrix: Gs1DataMatrix = dataMatrix as Gs1DataMatrix;
            if (this.encoding === 'Base256') {
                this.triggerEvent(BarcodeEvent.invalid, this.localeObj.getConstant('GS1InvalidEncoding'));
                return;
            }
            gs1DataMatrix.locale = this.localeObj;
            const gs1Message: string = gs1DataMatrix.validateGs1(this.value);
            if (gs1Message !== undefined) {
                this.triggerEvent(BarcodeEvent.invalid, gs1Message);
                return;
            }
            dataMatrix.value = gs1DataMatrix.buildGs1Data();
        } else {
            dataMatrix.value = this.value;
        }
        dataMatrix.encodingValue = this.encoding;
        dataMatrix.size = this.size;
        dataMatrix.width = this.barcodeCanvas.getAttribute('width');
        dataMatrix.height = this.barcodeCanvas.getAttribute('height');
        dataMatrix.XDimension = this.xDimension;
        dataMatrix.isSvgMode = this.mode === 'SVG' ? true : false;
        dataMatrix.margin = this.margin;
        dataMatrix.displayText = this.displayText;
        dataMatrix.foreColor = this.foreColor;
        let originalText: string;
        if (this.enableGS1) {
            // Show the human-readable GS1 text with the AIs in brackets.
            originalText = this.displayText.text;
            if (!originalText) {
                this.displayText.text = (dataMatrix as Gs1DataMatrix).getHumanReadableText();
            }
        }
        const checkOtherLanguage: boolean = this.checkdata(this.value);
        const encoding: string | number[] = (dataMatrix.BuildDataMatrix());
        if (isNaN(encoding[0] as number)) {
            this.triggerEvent(BarcodeEvent.invalid, encoding as string);
        } else if (!checkOtherLanguage && !this.enableGS1) {
            this.triggerEvent(BarcodeEvent.invalid, 'Invalid input');
        } else {
            dataMatrix.draw(this.barcodeCanvas);
        }
        if (this.enableGS1) {
            this.displayText.text = originalText;
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    }



    /**
     * Renders the barcode control
     *
     * @returns {void}
     */
    public render(): void {

        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
        this.initWebMcp();
        this.renderComplete();
    }
}
