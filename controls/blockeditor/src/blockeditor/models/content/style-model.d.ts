import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class Style
 */
export interface StyleModel {

    /**
     * Specifies whether the text is bold.
     *
     * @default false
     */
    bold?: boolean;

    /**
     * Specifies whether the text is italicized.
     *
     * @default false
     */
    italic?: boolean;

    /**
     * Specifies whether the text is underlined.
     *
     * @default false
     */
    underline?: boolean;

    /**
     * Specifies whether the text has a strikethrough effect.
     *
     * @default false
     */
    strikethrough?: boolean;

    /**
     * Specifies the text color in a HEX or RGBA format.
     *
     * @default ''
     */
    color?: string;

    /**
     * Specifies the background color for the text.
     *
     * @default ''
     */
    bgColor?: string;

    /**
     * Specifies whether the text is displayed as superscript.
     *
     * @default false
     */
    superscript?: boolean;

    /**
     * Specifies whether the text is displayed as subscript.
     *
     * @default false
     */
    subscript?: boolean;

    /**
     * Converts the text to uppercase.
     *
     * @default false
     */
    uppercase?: boolean;

    /**
     * Converts the text to lowercase.
     *
     * @default false
     */
    lowercase?: boolean;

    /**
     * Specifies custom CSS styles for the text.
     *
     * @default ''
     */
    custom?: string;

}