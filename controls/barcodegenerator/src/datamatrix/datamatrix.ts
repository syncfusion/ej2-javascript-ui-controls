import { Component, Property, L10n } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeEvent, DataMatrixEncoding, DataMatrixSize } from '../barcode/enum/enum';
import { ValidateEvent } from '../barcode/rendering/canvas-interface';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayText } from '../barcode/primitives/displaytext';
import { Margin } from '../barcode/primitives/margin';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { removeChildElements, refreshCanvasBarcode } from '../barcode/utility/barcode-util';
import { DataMatrix } from './datamatrix-util';
import { DataMatrixGeneratorModel } from './datamatrix-model';


/**
 * Represents the Datamatrix control
 * ```
 */
export class DataMatrixGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines encoding type of the DataMatrix.
     * @default 'Auto'
     */
    @Property('Auto')
    public encoding: DataMatrixEncoding;

    /**
     * Defines encoding type of the DataMatrix.
     * @default 'Auto'
     */
    @Property(DataMatrixSize.Auto)
    public size: DataMatrixSize;

    /**
     * Defines the DataMatrix rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;



    /**
     * Defines the value of the DataMatrix to be rendered.
     * @default undefined
     */
    @Property(undefined)
    public value: string;

    /**
     * Defines the height of the DataMatrix.
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;
    /**
     * Defines the width of the DataMatrix.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Defines the text properties for the DataMatrix.
     * @default ''
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;
    /**
     * Defines the margin properties for the DataMatrix.
     * @default ''
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Defines the background color of the DataMatrix.
     * @default 'white'
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Triggers if we entered any invalid character
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;

    /**
     * Defines the forecolor of the DataMatrix.
     * @default 'black'
     */
    @Property('black')
    public foreColor: string;

    /**
     * Defines the xDimension of the DataMatrix.
     */
    @Property(1)
    public xDimension: number;



    /** @private */
    private barcodeRenderer: BarcodeRenderer;


    private barcodeCanvas: HTMLElement;

    /** @private */
    public localeObj: L10n;
    /** @private */
    private defaultLocale: Object;

    /**
     * Destroys the the data matrix generator
     */
    public destroy(): void {
        this.notify('destroy', {});
        super.destroy();
    }

    private initializePrivateVariables(): void {
        this.defaultLocale = {

        };
    }

    /**
     * Constructor for creating the widget
     */
    constructor(options?: DataMatrixGeneratorModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
    }


    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }


    /**
     * Returns the module name of the the data matrix generator
     */
    public getModuleName(): string {
        return 'DataMatrixGenerator';
    }
    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }


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
        //Initialize the width of the datamatrix generator
        this.element.style.width = this.getElementSize(this.width);
        //Initialize the hieght of the datamatrix generator
        this.element.style.height = this.getElementSize(this.height);
        let mode: string = this.mode;
        //initialize the canvas element
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement(
            {
                id: this.element.id, height: mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5,
                width: mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5
            },
            this.backgroundColor, this.element.offsetWidth, this.element.offsetHeight) as HTMLElement;
        this.element.appendChild(this.barcodeCanvas);
    }


    private triggerEvent(eventName: BarcodeEvent, message: string): void {
        let arg: ValidateEvent = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    }

    protected preRender(): void {
        //initialize the data matrix renderer
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        //initialize the data matrix renderer private variables
        this.initializePrivateVariables();
        this.setCulture();
        //set class data matrix renderer
        this.element.classList.add('e-datamatrix');
    }

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
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
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
                    this.barcodeCanvas.setAttribute('style', 'background:' + newProp.backgroundColor);
                    break;
            }

        }
        this.renderElements();
    }


    private checkdata(value: string): boolean {
        let validData: boolean = false;
        for (let i: number = 0; i < value.length; i++) {
            let number: number = 0;
            if ((value.charCodeAt(i) >= 32 && value.charCodeAt(i) <= 126) || (value.charCodeAt(i) === 10 || value.charCodeAt(i) === 13)) {
                validData = true;
            }
        }
        return validData;
    }


    private renderElements(): void {
        let dataMatrix: DataMatrix = new DataMatrix();
        dataMatrix.encodingValue = this.encoding;
        dataMatrix.size = this.size;
        dataMatrix.value = this.value;
        dataMatrix.width = this.barcodeCanvas.getAttribute('width');
        dataMatrix.height = this.barcodeCanvas.getAttribute('height');
        dataMatrix.XDimension = this.xDimension;
        dataMatrix.isSvgMode = this.mode === 'SVG' ? true : false;
        dataMatrix.margin = this.margin;
        dataMatrix.displayText = this.displayText;
        dataMatrix.foreColor = this.foreColor;
        let checkOtherLanguage: boolean = this.checkdata(this.value);
        let encoding: String | number[] = (dataMatrix.BuildDataMatrix());
        if (isNaN(encoding[0] as number)) {
            this.triggerEvent(BarcodeEvent.invalid, encoding as string);
        } else if (!checkOtherLanguage) {
            this.triggerEvent(BarcodeEvent.invalid, 'Invalid input');
        } else {
            dataMatrix.draw(this.barcodeCanvas);
        }
        if (this.mode === 'Canvas') {
            this.barcodeCanvas.style.transform = 'scale(' + (2 / 3) + ')';
            this.barcodeCanvas.style.transformOrigin = '0 0';
        }
    }



    /**
     * Renders the barcode control with nodes and connectors
     */
    public render(): void {

        this.notify('initial-load', {});
        /**
         * Used to load context menu
         */
        this.trigger('load');
        this.notify('initial-end', {});
        this.renderElements();
    }
}