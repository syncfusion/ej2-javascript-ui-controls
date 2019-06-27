import { Component, Property, L10n } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { RenderingMode, BarcodeEvent, DataMatrixEncoding, DataMatrixSize } from '../barcode/enum/enum';import { ValidateEvent } from '../barcode/rendering/canvas-interface';import { DisplayTextModel } from '../barcode/primitives/displaytext-model';import { MarginModel } from '../barcode/primitives/margin-model';import { DisplayText } from '../barcode/primitives/displaytext';import { Margin } from '../barcode/primitives/margin';import { BarcodeRenderer } from '../barcode/rendering/renderer';import { removeChildElements, refreshCanvasBarcode } from '../barcode/utility/barcode-util';import { DataMatrix } from './datamatrix-util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class DataMatrixGenerator
 */
export interface DataMatrixGeneratorModel extends ComponentModel{

    /**
     * Defines encoding type of the DataMatrix.
     * @default 'Auto'
     */
    encoding?: DataMatrixEncoding;

    /**
     * Defines encoding type of the DataMatrix.
     * @default 'Auto'
     */
    size?: DataMatrixSize;

    /**
     * Defines the DataMatrix rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas
     * @default 'SVG'
     */
    mode?: RenderingMode;

    /**
     * Defines the value of the DataMatrix to be rendered.
     * @default undefined
     */
    value?: string;

    /**
     * Defines the height of the DataMatrix.
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the width of the DataMatrix.
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the text properties for the DataMatrix.
     * @default ''
     */
    displayText?: DisplayTextModel;

    /**
     * Defines the margin properties for the DataMatrix.
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the background color of the DataMatrix.
     * @default 'white'
     */
    backgroundColor?: string;

    /**
     * Triggers if we entered any invalid character
     * @event
     */
    invalid?: EmitType<Object>;

    /**
     * Defines the forecolor of the DataMatrix.
     * @default 'black'
     */
    foreColor?: string;

    /**
     * Defines the xDimension of the DataMatrix.
     */
    xDimension?: number;

}