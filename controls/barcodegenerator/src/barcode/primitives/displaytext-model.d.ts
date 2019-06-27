import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { Margin } from './margin';import { MarginModel } from './margin-model';import { Alignment, TextPosition } from '../enum/enum';

/**
 * Interface for a class DisplayText
 */
export interface DisplayTextModel {

    /**
     * Sets the textual description of the barcode.
     * @default ''
     */
    text?: string;

    /**
     * Defines the visibility of the text.
     * @default true
     */
    visibility?: boolean;

    /**
     * Defines the font style of the text
     * @default 'monospace'
     */
    font?: string;

    /**
     * Defines the size of the text.
     * @default 20
     */
    size?: number;

    /**
     * Sets the space to be left between the text and its barcode.
     * @default ''
     */
    margin?: MarginModel;

    /**
     * Defines the horizontal alignment of the text.
     * * Left - Aligns the text at the left
     * * Right - Aligns the text at the Right
     * * Center - Aligns the text at the Center
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Defines the position of the text.
     * * Bottom - Position the text at the Bottom
     * * Top - Position the text at the Top
     * @default 'Bottom'
     */
    position?: TextPosition;

}