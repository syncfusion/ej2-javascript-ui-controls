import { Component, Property, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeType, BarcodeEvent, } from './enum/enum';import { BarcodeRenderer } from './rendering/renderer';import { BarcodeCanvasRenderer } from './rendering/canvas-renderer';import { Code128B } from './one-dimension/code128B';import { Code128C } from './one-dimension/code128C';import { DisplayTextModel } from './primitives/displaytext-model';import { MarginModel } from './primitives/margin-model';import { DisplayText } from './primitives/displaytext';import { Margin } from './primitives/margin';import { Code39 } from './one-dimension/code39';import { CodaBar } from './one-dimension/codabar';import { Code128A } from './one-dimension/code128A';import { Code128 } from './one-dimension/code128';import { Ean8 } from './one-dimension/ean8';import { Ean13 } from './one-dimension/ean13';import { UpcE } from './one-dimension/upcE';import { UpcA } from './one-dimension/upcA';import { Code11 } from './one-dimension/code11';import { Code93 } from './one-dimension/code93';import { Code93Extension } from './one-dimension/code93Extension';import { ValidateEvent } from './rendering/canvas-interface';import { Code32 } from './one-dimension/code32';import { Code39Extension } from './one-dimension/code39Extension';import { removeChildElements } from './utility/barcode-util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BarcodeGenerator
 */
export interface BarcodeGeneratorModel extends ComponentModel{

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

     */
    width?: string | number;

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

     */
    height?: string | number;

    /**
     * Defines the barcode rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas

     */
    mode?: RenderingMode;

    /**
     * Defines the type of barcode to be rendered.

     */
    type?: BarcodeType;

    /**
     * Defines the value of the barcode to be rendered.

     */
    value?: string;

    /**
     * Defines the checksum for the barcode.

     */
    enableCheckSum?: boolean;

    /**
     * Defines the text properties for the barcode.

     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the barcode.

     */
    margin?: MarginModel;

    /**
     * Defines the background color of the barcode.

     */
    backgroundColor?: string;

    /**
     * Defines the forecolor of the barcode.

     */
    foreColor?: string;

    /**
     * Triggers if you enter any invalid character.
     * @event
     */
    invalid?: EmitType<Object>;

}