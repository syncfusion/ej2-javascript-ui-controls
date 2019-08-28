import { removeChildElements, refreshCanvasBarcode } from '../barcode/utility/barcode-util';
import { Complex, Property, Component, INotifyPropertyChanged, L10n, Event, EmitType } from '@syncfusion/ej2-base';
import { ErrorCorrectionLevel, QRCodeVersion, RenderingMode, BarcodeEvent } from '../barcode/enum/enum';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { DisplayText } from '../barcode/primitives/displaytext';
import { Margin } from '../barcode/primitives/margin';
import { QRCodeGeneratorModel } from './qrcode-model';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { QRCode } from './qr-code-util';
import { ValidateEvent } from '../barcode';

/**
 * Represents the Qrcode control
 * ```
 */
export class QRCodeGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Constructor for creating the widget
     */
    constructor(options?: QRCodeGeneratorModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * Defines the height of the QR code model.
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;
    /**
     * Defines the width of the QR code model.
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the QR code rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     * @default 'SVG'
     */
    @Property('SVG')
    public mode: RenderingMode;

    /**
     * Defines the xDimension of the QR code model.
     */
    @Property(1)
    public xDimension: number;

    /**
     * Defines the error correction level of the QR code.
     * @aspDefaultValueIgnore
     * @aspNumberEnum 
     * @default undefined
     */
    @Property()
    public errorCorrectionLevel: ErrorCorrectionLevel;

    /**
     * Defines the margin properties for the QR code.
     * @default ''
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;


    /**
     * Defines the background color of the QR code.
     * @default 'white'
     */
    @Property('white')
    public backgroundColor: string;

    /**
     * Triggers if you enter any invalid character.
     * @event
     */
    @Event()
    public invalid: EmitType<Object>;

    /**
     * Defines the forecolor of the QR code.
     * @default 'black'
     */
    @Property('black')
    public foreColor: string;

    /**
     * Defines the text properties for the QR code.
     * @default ''
     */
    @Complex<DisplayTextModel>({}, DisplayText)
    public displayText: DisplayTextModel;

    /**
     * * Defines the version of the QR code.
     * @aspDefaultValueIgnore
     * @aspNumberEnum 
     * @default undefined
     */
    @Property()
    public version: QRCodeVersion;


    private widthChange: boolean = false;

    private heightChange: boolean = false;

    private isSvgMode: boolean;

    private barcodeRenderer: BarcodeRenderer;



    /**
     * Defines the type of barcode to be rendered.
     * @default undefined
     */
    @Property(undefined)
    public value: string;

    /** @private */
    public localeObj: L10n;
    /** @private */
    private defaultLocale: Object;


    private barcodeCanvas: HTMLElement;


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

    private triggerEvent(eventName: BarcodeEvent, message: string): void {
        let arg: ValidateEvent = {
            message: message
        };
        this.trigger(BarcodeEvent[eventName], arg);
    }


    private renderElements(): void {
        let barCode: QRCode = new QRCode();
        barCode.text = this.value;
        barCode.XDimension = this.xDimension;
        barCode.mIsUserMentionedErrorCorrectionLevel = (this.errorCorrectionLevel !== undefined) ? true : false;
        barCode.mErrorCorrectionLevel = (this.errorCorrectionLevel !== undefined) ? this.errorCorrectionLevel : ErrorCorrectionLevel.Medium;
        barCode.version = (this.version !== undefined) ? this.version : undefined;
        barCode.mIsUserMentionedVersion = (this.version !== undefined) ? true : false;
        let mode: boolean = (this.mode === 'SVG') ? true : false;
        let validInput: boolean = barCode.draw(
            this.value, this.barcodeCanvas, this.element.offsetHeight as number,
            this.element.offsetWidth as number, this.margin, this.displayText, mode, this.foreColor);
        if (!validInput) {
            let encoding: String = 'Invalid Input';
            this.triggerEvent(BarcodeEvent.invalid, encoding as string);
        }
    }

    private setCulture(): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
    }


    private getElementSize(real: string | number, rulerSize?: number): string {
        //this method will return the size of the qrcode 
        let value: string;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            value = real.toString();
        } else {
            value = real.toString() + 'px';
        }
        return value;
    }

    private initialize(): void {
        //Initialize the height of qrcode generator
        this.element.style.height = this.getElementSize(this.height);
        //Initialize the width of qrcode generator
        this.element.style.width = this.getElementSize(this.width);
        this.barcodeCanvas = this.barcodeRenderer.renderRootElement(
            {
                id: this.element.id, height: this.mode === 'SVG' ? this.element.offsetHeight : this.element.offsetHeight * 1.5,
                width: this.mode === 'SVG' ? this.element.offsetWidth : this.element.offsetWidth * 1.5
            },
            this.backgroundColor, this.element.offsetWidth, this.element.offsetHeight) as HTMLElement;
        this.element.appendChild(this.barcodeCanvas);
    }

    protected preRender(): void {
        this.barcodeRenderer = new BarcodeRenderer(this.element.id, this.mode === 'SVG');
        this.initialize();
        this.initializePrivateVariables();
        this.setCulture();
        this.element.classList.add('e-qrcode');
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
     * Returns the module name of the barcode
     */
    public getModuleName(): string {
        return 'QRCodeGenerator';
    }


    /**
     * Destroys the barcode control
     */
    public destroy(): void {
        this.notify('destroy', {});
        super.destroy();
    }

    private initializePrivateVariables(): void {
        this.defaultLocale = {

        };
    }

    public onPropertyChanged(newProp: QRCodeGeneratorModel, oldProp: QRCodeGeneratorModel): void {
        let width: number | string;
        let height: number | string;
        if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
            refreshCanvasBarcode(this, this.barcodeCanvas as HTMLCanvasElement);
        } else {
            this.barcodeRenderer = removeChildElements(newProp, this.barcodeCanvas, this.mode, this.element.id);
        }
        if (newProp.width) {
            if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
                this.widthChange = true;
            }
            width = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? (((newProp.width as number) * 1.5)) : newProp.width;
            this.barcodeCanvas.setAttribute('width', String(width));
        }
        if (newProp.height) {
            if (this.mode === 'Canvas' && newProp.mode !== 'Canvas') {
                this.heightChange = true;
            }
            height = (this.mode === 'Canvas' && newProp.mode !== 'Canvas') ? (((newProp.height as number) * 1.5)) : newProp.height;
            this.barcodeCanvas.setAttribute('height', String(height));
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    this.element.style.width = this.getElementSize(width);
                    this.barcodeCanvas.setAttribute('width', String(this.element.offsetWidth));
                    break;
                case 'height':
                    this.element.style.height = this.getElementSize(height);
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
}