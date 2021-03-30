import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeType, BarcodeEvent, BarcodeExportType} from './enum/enum';
import { BarcodeRenderer } from './rendering/renderer';
import { BarcodeCanvasRenderer } from './rendering/canvas-renderer';
import { Code128B } from './one-dimension/code128B';
import { Code128C } from './one-dimension/code128C';
import { BarcodeGeneratorModel } from './barcode-model';
import { DisplayTextModel } from './primitives/displaytext-model';
import { MarginModel } from './primitives/margin-model';
import { DisplayText } from './primitives/displaytext';
import { Margin } from './primitives/margin';
import { Code39 } from './one-dimension/code39';
import { CodaBar } from './one-dimension/codabar';
import { Code128A } from './one-dimension/code128A';
import { Code128 } from './one-dimension/code128';
import { Ean8 } from './one-dimension/ean8';
import { Ean13 } from './one-dimension/ean13';
import { UpcE } from './one-dimension/upcE';
import { UpcA } from './one-dimension/upcA';
import { Code11 } from './one-dimension/code11';
import { Code93 } from './one-dimension/code93';
import { Code93Extension } from './one-dimension/code93Extension';
import { ValidateEvent } from './rendering/canvas-interface';
import { Code32 } from './one-dimension/code32';
import { Code39Extension } from './one-dimension/code39Extension';
import { removeChildElements, exportAsImage } from './utility/barcode-util';


/**
 * Represents the Barcode control
 * ```html
 * <div id='barcode'/>
 * ```
 * ```typescript
 * let barcode: Barcode = new Barcode({
 * width:'1000px', height:'500px' });
 * barcode.appendTo('#barcode');
 * ```
 */
export class BarcodeGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {



    /**
     * Defines the width of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * width:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;


    /**
     * Defines the height of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * height:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```
     *
     * @default '100'
     *
     */
    @Property('100px')
    public height: string | number;


    /**
     * Defines the barcode rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     *
     * @default 'SVG'
     *
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the type of barcode to be rendered.
     *
     * @default 'Code128'
     *
     */
    @Property('Code128')
    public type: BarcodeType;

    /**
     * Defines the value of the barcode to be rendered.
     *
     * @default undefined
     *
     */
    @Property(undefined)
    public value: string;

    /**
     * Defines the checksum for the barcode.
     *
     * @default 'true'
     *
     */
    @Property(true)
    public enableCheckSum: boolean;

    /**
     * Defines the text properties for the barcode.
     *
     * @default ''
     *
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;

    /**
     * Defines the margin properties for the barcode.
     *
     * @default ''
     *
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Defines the background color of the barcode.
     *
     * @default 'white'
     *
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Defines the forecolor of the barcode.
     *
     * @default 'black'
     *
     */
    @Property('black')
    public foreColor: string;

    /**
     * Triggers if you enter any invalid character.
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;



    /** @private */
    public localeObj: L10n;
    /** @private */
    // eslint-disable-next-line
    private defaultLocale: Object;

    private barcodeCanvas: HTMLElement;

    private barcodeRenderer: BarcodeRenderer;
    /**
     * Constructor for creating the widget
     *
     * @param {BarcodeGeneratorModel} options The barcode model.
     * @param {HTMLElement | string} element The barcode element.
     */
    constructor(options?: BarcodeGeneratorModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
    }


    private triggerEvent(eventName: BarcodeEvent, message: string): void {
        const arg: ValidateEvent = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    }

    // eslint-disable-next-line
    public onPropertyChanged(newProp: BarcodeGeneratorModel, oldProp: BarcodeGeneratorModel): void {
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            this.refreshCanvasBarcode();
        } else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            this.barcodeCanvas.setAttribute('width', String(newProp.width));
        }
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
                this.element.style.width = this.getElementSize(this.width);
                this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                break;
            case 'height':
                this.element.style.height = this.getElementSize(this.height);
                this.barcodeCanvas.setAttribute('height', String(this.element.offsetHeight));
                break;
            case 'backgroundColor':
                this.barcodeCanvas.setAttribute('style', 'background:' + newProp.backgroundColor);
                break;
            case 'mode':
                this.initialize();
            }

        }
        this.renderElements();
    }

    private initialize(): void {
        //Initialize the height of the barcode generator
        this.element.style.height = this.getElementSize(this.height);
        //Initialize the width of the barcode generator
        this.element.style.width = this.getElementSize(this.width);
        const height: number = this.mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5;
        const width: number = this.mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5;
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement(
            {
                id: this.element.id + 'content',
                height, width
            },
            this.backgroundColor, width, height) as HTMLElement;
        this.element.appendChild(this.barcodeCanvas);
    }

    /**
     * Export the barcode as an image in the specified image type and downloads it in the browser.
     *
     * @returns {void} Export the barcode as an image in the specified image type and downloads it in the browser.
     *  @param {string} filename - Specifies the filename of the barcode image to be download.
     *  @param {BarcodeExportType} exportType - Defines the format of the barcode to be exported
     */
    public exportImage(filename: string, exportType: BarcodeExportType ): void {
        exportAsImage(exportType, filename, this.element, false, this);
    }


    /**
     * Export the barcode as an image in the specified image type and returns it as base64 string.
     *
     * @returns {string} Export the barcode as an image in the specified image type and returns it as base64 string.
     *  @param {BarcodeExportType} exportType - Defines the format of the barcode to be exported
     */
    public exportAsBase64Image(exportType: BarcodeExportType): Promise<string> {
        const returnValue: Promise<string> =  exportAsImage(exportType, '', this.element, true, this);
        return returnValue;
    }

    private renderElements(): void {
        let barCode: Code39Extension | Code32 | Code39 | CodaBar | Code128A | Code128 | Ean8 |
        Ean13 | UpcE | UpcA | Code11 | Code93 | Code93Extension;
        switch (this.type) {
        case 'Code39Extension':
            barCode = new Code39Extension;
            break;
        case 'Code39':
            barCode = new Code39();
            break;
        case 'Codabar':
            barCode = new CodaBar();
            break;
        case 'Code128A':
            barCode = new Code128A();
            break;
        case 'Code128B':
            barCode = new Code128B();
            break;
        case 'Code128C':
            barCode = new Code128C();
            break;
        case 'Code128':
            barCode = new Code128();
            break;
        case 'Ean8':
            barCode = new Ean8();
            break;
        case 'Ean13':
            barCode = new Ean13();
            break;
        case 'UpcA':
            barCode = new UpcA();
            break;
        case 'UpcE':
            barCode = new UpcE();
            break;
        case 'Code11':
            barCode = new Code11();
            break;
        case 'Code93':
            barCode = new Code93();
            break;
        case 'Code93Extension':
            barCode = new Code93Extension();
            break;
        case 'Code32':
            barCode = new Code32();
            break;
        }
        if (this.mode === 'Canvas') {
            (this.barcodeCanvas as HTMLCanvasElement).getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
            (this.barcodeCanvas as HTMLCanvasElement).getContext('2d').scale(1.5, 1.5);
        }

        barCode.width = this.barcodeCanvas.getAttribute('width');
        if ((this.type === 'Ean8' || this.type === 'Ean13' || this.type === 'UpcA') && this.displayText.text.length > 0) {
            this.triggerEvent(BarcodeEvent.invalid, 'Invalid Display Text');
        }

        barCode.value = this.value;
        barCode.margin = this.margin;

        barCode.type = this.type;
        barCode.height = this.barcodeCanvas.getAttribute('height');
        barCode.foreColor = this.foreColor;
        barCode.isSvgMode = this.mode === 'SVG' ? true : false;
        barCode.displayText = this.displayText;
        barCode.enableCheckSum = this.enableCheckSum;
        const validateMessage: string = barCode.validateInput(this.value);
        if (validateMessage === undefined) {
            if (this.type === 'Code39Extension') {
                (barCode as Code39Extension).drawCode39(this.barcodeCanvas);
            } else if (this.type === 'Code93Extension') {
                (barCode as Code93Extension).drawCode93(this.barcodeCanvas);
            } else {
                barCode.draw(this.barcodeCanvas);
            }
        } else {
            this.triggerEvent(BarcodeEvent.invalid, validateMessage as string);
        }

        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    }

    private refreshCanvasBarcode(): void {
        this.clearCanvas(this);
    }

    private clearCanvas(view: BarcodeGenerator): void {
        const width: number = view.element.offsetWidth;
        const height: number = view.element.offsetHeight;
        if (view.mode !== 'SVG') {
            const ctx: CanvasRenderingContext2D = BarcodeCanvasRenderer.getContext(this.barcodeCanvas as HTMLCanvasElement);
            ctx.clearRect(0, 0, width, height);
        }
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
     * @private
     * @param real
     */

    // eslint-disable-next-line
    private getElementSize(real: string | number, rulerSize?: number): string {
        let value: string;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        } else {
            value = real.toString() + 'px';
        }
        return value;
    }

    protected preRender(): void {
        this.element.classList.add('e-barcode');
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        this.initializePrivateVariables();
        this.setCulture();
        const measureElement: HTMLCollection = document.getElementsByClassName('barcodeMeasureElement');
        if (measureElement.length > 0) {
            for (let i: number = measureElement.length - 1; i >= 0; i--) {
                measureElement[i].parentNode.removeChild(measureElement[i]);
            }
            const element: string = 'barcodeMeasureElement';
            window[element] = null;
        }
    }


    private initializePrivateVariables(): void {
        this.defaultLocale = {

        };
    }

    /**
     * Method to set culture for chart
     */

    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }

    /**
     * Renders the barcode control with nodes and connectors
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
        this.renderComplete();
    }


    /**
     * Returns the module name of the barcode
     *
     * @returns {string}  Returns the module name of the barcode
     */
    public getModuleName(): string {
        return 'barcode';
    }


    /**
     *To provide the array of modules needed for control rendering
     *
     * @function destroy
     * @returns {ModuleDeclaration[]} To provide the array of modules needed for control rendering
     * @private
     */
    public requiredModules(): ModuleDeclaration[] {

        const modules: ModuleDeclaration[] = [];

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
    }


}
