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
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Defines the visibility of the text.
     *
     * @default true
     */
    @Property(true)
    public visibility: boolean;

    /**
     * Defines the font style of the text
     *
     * @default 'monospace'
     */
    @Property('monospace')
    public font: string;

    /**
     * Defines the size of the text.
     *
     * @default 20
     */
    @Property(20)
    public size: number;

    /**
     * Sets the space to be left between the text and its barcode.
     *
     * @default ''
     */
    @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public margin: MarginModel;

    /**
     * Defines the horizontal alignment of the text.
     * * Left - Aligns the text at the left
     * * Right - Aligns the text at the Right
     * * Center - Aligns the text at the Center
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Defines the position of the text.
     * * Bottom - Position the text at the Bottom
     * * Top - Position the text at the Top
     *
     * @default 'Bottom'
     */
    @Property('Bottom')
    public position: TextPosition;
}
