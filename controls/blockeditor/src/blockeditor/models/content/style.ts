import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the style attributes applicable to a content block.
 * This model specifies text formatting options such as bold, italic, underline, and colors.
 */
export class Style  extends ChildProperty<Style> {

    /**
     * Specifies whether the text is bold.
     *
     * @default false
     */
    @Property(false)
    public bold: boolean;

    /**
     * Specifies whether the text is italicized.
     *
     * @default false
     */
    @Property(false)
    public italic: boolean;

    /**
     * Specifies whether the text is underlined.
     *
     * @default false
     */
    @Property(false)
    public underline: boolean;

    /**
     * Specifies whether the text has a strikethrough effect.
     *
     * @default false
     */
    @Property(false)
    public strikethrough: boolean;

    /**
     * Specifies the text color in a HEX or RGBA format.
     *
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Specifies the background color for the text.
     *
     * @default ''
     */
    @Property('')
    public bgColor: string;

    /**
     * Specifies whether the text is displayed as superscript.
     *
     * @default false
     */
    @Property(false)
    public superscript: boolean;

    /**
     * Specifies whether the text is displayed as subscript.
     *
     * @default false
     */
    @Property(false)
    public subscript: boolean;

    /**
     * Converts the text to uppercase.
     *
     * @default false
     */
    @Property(false)
    public uppercase: boolean;

    /**
     * Converts the text to lowercase.
     *
     * @default false
     */
    @Property(false)
    public lowercase: boolean;

    /**
     * Specifies custom CSS styles for the text.
     *
     * @default ''
     */
    @Property('')
    public custom: string;
}
