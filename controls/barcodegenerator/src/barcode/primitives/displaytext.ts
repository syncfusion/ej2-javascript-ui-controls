import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { Margin } from './margin';
import { MarginModel } from './margin-model';
import { Alignment, TextPosition } from '../enum/enum';

/**
 * Defines the space to be left between an object and its immediate parent
 */
export class DisplayText extends ChildProperty<DisplayText> {
    /**
     * Sets the textual description of the barcode.

     */
    @Property('')
    public text: string;

    /**
     * Defines the visibility of the text.

     */
    @Property(true)
    public visibility: boolean;

    /**
     * Defines the font style of the text

     */
    @Property('monospace')
    public font: string;

    /**
     * Defines the size of the text.

     */
    @Property(20)
    public size: number;

    /**
     * Sets the space to be left between the text and its barcode.

     */
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public margin: MarginModel;

    /**
     * Defines the horizontal alignment of the text.
     * * Left - Aligns the text at the left
     * * Right - Aligns the text at the Right
     * * Center - Aligns the text at the Center

     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Defines the position of the text.
     * * Bottom - Position the text at the Bottom
     * * Top - Position the text at the Top

     */
    @Property('Bottom')
    public position: TextPosition;
}