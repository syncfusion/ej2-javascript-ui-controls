import { removeChildElements, refreshCanvasBarcode, exportAsImage } from '../barcode/utility/barcode-util';import { Complex, Property, Component, INotifyPropertyChanged, L10n, Event, EmitType } from '@syncfusion/ej2-base';import { ErrorCorrectionLevel, QRCodeVersion, RenderingMode, BarcodeEvent, BarcodeExportType } from '../barcode/enum/enum';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { QRCode } from './qr-code-util';import { ValidateEvent } from '../barcode';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class QRCodeGenerator
 */
export interface QRCodeGeneratorModel extends ComponentModel{

    /**
     * Defines the height of the QR code model.
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the width of the QR code model.
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the QR code rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the xDimension of the QR code model.
     */
    xDimension?: number;

    /**
     * Defines the error correction level of the QR code.
     * @blazorDefaultValueIgnore
     * @aspDefaultValueIgnore
     * @aspNumberEnum 
     * @blazorNumberEnum
     * @default undefined
     */
    errorCorrectionLevel?: ErrorCorrectionLevel;

    /**
     * Defines the margin properties for the QR code.
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the QR code.
     * @default 'white'
     */
    backgroundColor?: string;

    /**
     * Triggers if you enter any invalid character.
     * @event
     */
    invalid?: EmitType<Object>;

    /**
     * Defines the forecolor of the QR code.
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Defines the text properties for the QR code.
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * * Defines the version of the QR code.
     * @aspDefaultValueIgnore
     * @blazorNumberEnum
     * @blazorDefaultValueIgnore
     * @aspNumberEnum 
     * @default undefined
     */
    version?: QRCodeVersion;

    /**
     * Defines the type of barcode to be rendered.
     * @default undefined
     */
    value?: string;

}